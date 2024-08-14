""" This script generates a master csv file from the transcript files."""
# Copyright (c) 2024 Braid Technologies Ltd

# from the markdown files, generate a master json file
# from the makdown folder read all the .json files then load the associated .mdd file

# Standard Library Imports
import os
import json
import logging
from pathlib import Path
import math

# Third-Party Packages
import tiktoken
from rich.progress import Progress

# Local Modules
from common.common_functions import ensure_directory_exists

PERCENTAGE_OVERLAP = 0.05
AVERAGE_CHARACTERS_PER_TOKEN = 4
AVERAGE_WORDS_PER_MINUTE = 100
AVERAGE_TOKENS_PER_WORD=1.33

total_files = 0

class MddSegment:
    def __init__(self, chunk: dict) -> None:
        self.text = chunk.get("text")
        self.start = chunk.get("start")
        self.duration = chunk.get("duration")

def gen_metadata_master(metadata):
    """generate the metadata master csv file"""
    text = metadata["title"] + " " + metadata["description"]
    metadata["start"] = "0"

    text = text.strip()

    if not text:
        metadata["text"] = "No description available."
    else:
        # clean the text
        text = clean_text(text)
        metadata["text"] = text.strip()


def clean_text(text):
    """clean the text"""
    text = text.replace("\n", " ")  # remove new lines
    text = text.replace("&#39;", "'")
    text = text.replace(">>", "")  # remove '>>'
    text = text.replace("  ", " ")  # remove double spaces
    text = text.replace("[inaudible]", "")  # [inaudible]

    return text


def append_text_to_previous_chunk(text, chunks):
    """
    append PERCENTAGE_OVERLAP text to the previous chunk to smooth context transition
    """
    if chunks:
        words = text.split(" ")
        word_count = len(words)
        if word_count > 0:
            append_text = " ".join(words[0:int(word_count * PERCENTAGE_OVERLAP)])
            chunks[-1]["text"] += append_text


def add_new_chunk(metadata, text, chunk_begin_tokens, chunks, minimumSegmentTokenCount):
    """add a new chunk to the chunks list"""

    # don't add very short chunks
    if len(text) < minimumSegmentTokenCount * AVERAGE_CHARACTERS_PER_TOKEN:
        return
    
    charactersPerSecond = AVERAGE_WORDS_PER_MINUTE * AVERAGE_CHARACTERS_PER_TOKEN / 60

    metadata["start"] = str(chunk_begin_tokens)
    metadata["seconds"] = int(len(text) / charactersPerSecond)
    metadata["text"] = text
    chunks.append(metadata.copy())


def parse_json_mdd_transcript(config, mdd, metadata, tokenizer, chunks):
    """parse the json mdd file and return the transcript"""
    text = ""
    current_tokens = None
    seg_begin_tokens = None
    seg_finish_tokens = None
    current_token_length = 0
    first_chunk = True
    last_chunk = False

    # add the title to the transcript
    if "title" in metadata and metadata["title"]:
        metadata["title"] = clean_text(metadata.get("title"))
        text += metadata.get("title") + ". "

    current_token_length = len(tokenizer.encode(text))

    # open the mdd file
    with open(mdd, "r", encoding="utf-8") as json_file:
        json_mdd = json.load(json_file)

        if len(json_mdd) == 1:
            last_chunk = True

        for chunk in json_mdd:
            seg = MddSegment(chunk)
            current_tokens = int(seg.start)
            current_text = seg.text            

            if seg_begin_tokens is None:
                seg_begin_tokens = current_tokens
                # calculate the finish time from the chunk_begin_time
                seg_finish_tokens = seg_begin_tokens + config.chunkDurationMins * 60

            # Get the number of tokens in the text.
            # Need to calc to allow for tokens for 
            # summary request in next pipeline step
            total_tokens = len(tokenizer.encode(current_text, disallowed_special=())) + current_token_length

            # Deal with case of a chunk that is already over the limit - in which case we add it
            # in chunks # then return.
            if total_tokens >= seg_finish_tokens:
               
               currentWordCount = 0
               words = current_text.split(" ")
               word_count = len(words)
                  
               while currentWordCount < word_count:
                  maxWords = math.floor (seg_finish_tokens / AVERAGE_TOKENS_PER_WORD)
                  thisTextWordCount = min(maxWords, word_count - currentWordCount);
                  thisText = " ".join(words[currentWordCount : thisTextWordCount])
                  add_new_chunk(metadata, thisText, seg_begin_tokens, chunks, config.discardIfBelow)

                  #if we are not at the end, we overlap chunks by moving back a bit
                  if currentWordCount + thisTextWordCount < word_count:
                     currentWordCount += int (thisTextWordCount * (1- PERCENTAGE_OVERLAP))
                  else:
                     currentWordCount += thisTextWordCount

               return
        
            if current_tokens < seg_finish_tokens and total_tokens < config.maxTokens:
                # add the text to the transcript
                text += current_text + " "
                current_token_length = total_tokens
            else:
                if not first_chunk:
                    # append PERCENTAGE_OVERLAP text to the previous chunk
                    # to smooth context transition
                    append_text_to_previous_chunk(text, chunks)
                first_chunk = False
                add_new_chunk(metadata, text, seg_begin_tokens, chunks, config.discardIfBelow)

                text = current_text + " "

                # reset the chunk_begin_time
                seg_begin_tokens = None
                seg_finish_tokens = None

                current_token_length = len(tokenizer.encode(text))

        # Deal with case where there is only one chunk
        if first_chunk and last_chunk:
           add_new_chunk(metadata, text, seg_begin_tokens, chunks, config.discardIfBelow)
        else:
            # Append the last text chunk to the last chunk in chunks dictionary
            if seg_begin_tokens and text != "":
               previous_chunk_tokens = len(tokenizer.encode(chunks[-1]["text"]))
               current_chunk_tokens = len(tokenizer.encode(text))

               if previous_chunk_tokens + current_chunk_tokens < config.maxTokens:
                   chunks[-1]["text"] += text
               else:
                  if not first_chunk:
                     # append PERCENTAGE_OVERLAP text to the previous chunk
                     # to smooth context transition
                     append_text_to_previous_chunk(text, chunks)
                     first_chunk = False
                     add_new_chunk(metadata, text, seg_begin_tokens, chunks, config.discardIfBelow)


def get_transcript(config, metadata, markdownDestinationDir, logger, tokenizer, chunks):
    """get the transcript from the .mdd file"""

    global total_files
    mdd = os.path.join(markdownDestinationDir, metadata["filename"])

    # check that the .mdd file exists
    if not os.path.exists(mdd):
        logger.info("mdd file does not exist: %s", mdd)
        return None
    else:
        logger.debug("Processing file: %s", mdd)
        total_files += 1

    parse_json_mdd_transcript(config, mdd, metadata, tokenizer, chunks)


def enrich_text_chunks(config, markdownDestinationDir):
    logging.basicConfig(level=logging.WARNING)
    logger = logging.getLogger(__name__)
    chunks = []

    if not markdownDestinationDir:
        logger.error("Markdown folder not provided")
        exit(1)

    # https://stackoverflow.com/questions/75804599/openai-api-how-do-i-count-tokens-before-i-send-an-api-request
    ENCODING_MODEL = "gpt-3.5-turbo"
    tokenizer = tiktoken.encoding_for_model(ENCODING_MODEL)

    cwd = os.getcwd()
    logger.debug("Current directory : %s", cwd)
    logger.debug("Markdown folder: %s", markdownDestinationDir)
    logger.debug("Segment length %d minutes", config.chunkDurationMins)

    folder = os.path.join(markdownDestinationDir, "*.json")
    logger.debug("Search spec: %s", str(folder))

    directory_path = Path(markdownDestinationDir)

    # Use rglob() to recursively search for all files
    searchPath = directory_path.glob("*.json")
    jsonFiles = list(searchPath)

    global total_files
    total_files = len(jsonFiles)  # Initialize total_files with the count of jsonFiles

    with Progress() as progress:
        task1 = progress.add_task("[green]Enriching Buckets...", total=total_files)

        for file in jsonFiles:
            # load the json file
            meta = json.load(open(file, encoding="utf-8"))

            get_transcript(config, meta, markdownDestinationDir, logger, tokenizer, chunks)
            progress.update(task1, advance=1)

    logger.debug("Total files: %s", total_files)
    logger.debug("Total chunks: %s", len(chunks))

    # save chunks to a json file
    output_subdir = "output"
    output_file = os.path.join(markdownDestinationDir, output_subdir, "master_text.json")

    # Ensure the output subdirectory exists
    ensure_directory_exists(os.path.dirname(output_file))

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=4)