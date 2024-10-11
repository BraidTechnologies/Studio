""" This script will take a text and create embeddings for each text using the OpenAI API."""
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import re
import os
import json
import threading
import queue

# Third-Party Packages
from openai import AzureOpenAI
from openai import BadRequestError
from tenacity import (
    retry,
    wait_random_exponential,
    stop_after_attempt,
    retry_if_not_exception_type,
)
from rich.progress import Progress

# Local Modules
from common.common_functions import ensure_directory_exists
from common.common_functions import get_embedding
from common.ApiConfiguration import ApiConfiguration

def normalize_text(s, sep_token=" \n "):
    """Normalize text by removing extra spaces and newlines."""
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r". ,", "", s)  # corrected the regex pattern
    s = s.replace("..", ".")
    s = s.replace(". .", ".")
    s = s.replace("\n", "")
    s = s.strip()

    return s


@retry(
    wait=wait_random_exponential(min=10, max=45),
    stop=stop_after_attempt(5),
    retry=retry_if_not_exception_type(BadRequestError),
)
def get_text_embedding(client : AzureOpenAI, config : ApiConfiguration, text: str):
    """Get the embedding for a text."""
    embedding = get_embedding(text,
                              client,
                              config)
    
    return embedding


def process_queue(client : AzureOpenAI, config : ApiConfiguration, progress, task, q, logger, output_chunks, current_chunks):
    """Process the queue."""
    while not q.empty():
        chunk = q.get()
        found = False

        for i in current_chunks:
            if i.get('sourceId') == chunk.get('sourceId'):
              current_summary = i.get("summary")
              current_ada = i.get("ada_v2")
              if current_summary and current_ada: 
                 chunk["summary"] = current_summary
                 chunk["ada_v2"] = current_ada                
                 found = True  
                 output_chunks.append(chunk.copy())                 
                 break

        if not found:
            if "ada_v2" in chunk:
                output_chunks.append(chunk.copy())
            else:
                # Get embedding using OpenAI API
                try:
                    embedding = get_text_embedding(client, config, chunk["text"])
                    chunk["ada_v2"] = embedding.copy()
                    output_chunks.append(chunk.copy())
                except BadRequestError as request_error:
                    logger.warning("Error processing chunk %s: %s", chunk.get('sourceId'), request_error)
                except Exception as e:
                    logger.warning("Unknown error processing chunk %s: %s", chunk.get('sourceId'), str(e))

        progress.update(task, advance=1)
        q.task_done()


def enrich_text_embeddings(config : ApiConfiguration, destinationDir : str):

    logging.basicConfig(level=logging.WARNING)
    logger = logging.getLogger(__name__)
    for key in logging.Logger.manager.loggerDict:
       logging.getLogger(key).setLevel(logging.WARNING)

    client = AzureOpenAI(
       azure_endpoint = config.resourceEndpoint, 
       api_key=config.apiKey,  
       api_version=config.apiVersion
    )   

    if not destinationDir:
        logger.error("Markdown folder not provided")
        exit(1)

    total_chunks = 0
    output_chunks = []
    current = []

    logger.debug("Starting OpenAI Embeddings")

    # Load chunks from the input JSON file
    input_file = os.path.join(destinationDir, "output", "master_enriched.json")
    with open(input_file, "r", encoding="utf-8") as f:
        chunks = json.load(f)

    total_chunks = len(chunks)
    logger.info("Total chunks to be processed: %s", total_chunks)

    # Prepare a queue with chunks to be processed
    q = queue.Queue()
    for chunk in chunks:
        q.put(chunk)

    # Load existing chunks from cache
    cache_file = os.path.join(destinationDir, "output", "master_enriched.json")
    if os.path.isfile(cache_file):
        with open(cache_file, "r", encoding="utf-8") as f:
            current = json.load(f)

    with Progress() as progress:
        task1 = progress.add_task("[green]Enriching Embeddings...", total=total_chunks)
        # Create multiple threads to process the queue
        threads = []
        for i in range(config.processingThreads):
            t = threading.Thread(target=process_queue, args=(client, config, progress, task1, q, logger, output_chunks, current))
            t.start()
            threads.append(t)

        # Wait for all threads to finish
        for t in threads:
            t.join()

    # Sort the output chunks by sourceId
    output_chunks.sort(key=lambda x: x["sourceId"])

    logger.debug("Total chunks processed: %s", len(output_chunks))

    # Save enriched chunks to a JSON file
    output_subdir = "output"
    output_file = os.path.join(destinationDir, output_subdir, "master_enriched.json")

    # Ensure the output subdirectory exists
    ensure_directory_exists(os.path.dirname(output_file))

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output_chunks, f, ensure_ascii=False, indent=4)
