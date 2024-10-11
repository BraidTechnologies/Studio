# Standard Library Imports
import json
import os
import threading
import queue
import logging
from logging import Logger

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
from common.ApiConfiguration import ApiConfiguration

class Counter:
    """thread safe counter"""

    def __init__(self):
        """initialize the counter"""
        self.value = 0
        self.lock = threading.Lock()

    def increment(self):
        """increment the counter"""
        with self.lock:
            self.value += 1
            return self.value

@retry(
    wait=wait_random_exponential(min=10, max=45),
    stop=stop_after_attempt(5),
    retry=retry_if_not_exception_type(BadRequestError),
)
def chatgpt_summary(client : AzureOpenAI, config : ApiConfiguration, text : str, logger : Logger):
    """generate a summary using chatgpt"""

    messages = [
        {
            "role": "system",
            "content": "You are an AI Assistant for video summarization, write an authoritative " 
                       + str(config.summaryWordCount) + 
                       " word summary. Avoid starting sentences with 'This document' or 'The document'.",
        },
        {"role": "user", "content": text},
    ]

    response = client.chat.completions.create(
        model=config.azureDeploymentName,
        messages=messages,
        temperature=0.7,
        max_tokens=config.maxTokens,
        top_p=0.0,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        timeout=config.openAiRequestTimeout,
    )

    text = response.choices[0].message.content
    finish_reason = response.choices[0].finish_reason

    if finish_reason != "stop" and finish_reason != 'length' and finish_reason != "":
        logger.warning("Stop reason: %s", finish_reason)
        logger.warning("Text: %s", text)
        logger.warning("Increase Max Tokens and try again")
        exit(1)

    return text

def process_queue(client : AzureOpenAI, config : ApiConfiguration, progress, task, q, counter, logger, output_chunks, current_chunks):
    """process the queue"""
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
                 output_chunks.append(chunk.copy())                                 
                 found = True  
                 break

        if not found:           
           text = chunk.get("text")

           # get a summary of the text using chatgpt
           try:
              summary = chatgpt_summary(client, config, text, logger)
              # add the summary to the segment dictionary
              chunk["summary"] = summary
              output_chunks.append(chunk.copy())
           except BadRequestError as request_error:
              logger.warning("Error: %s", request_error)
           except Exception as e:
              logger.warning("Error: %s", e)

        count = counter.increment()
        progress.update(task, advance=1)

        q.task_done()

# convert time '00:01:20' to seconds
def convert_time_to_seconds(value):
    """convert time to seconds"""
    time_value = value.split(":")
    if len(time_value) == 3:
        h, m, s = time_value
        return int(h) * 3600 + int(m) * 60 + int(s)
    else:
        return 0

def enrich_transcript_summaries(config : ApiConfiguration, transcriptDestinationDir: str): 
   
   client = AzureOpenAI(
      azure_endpoint = config.resourceEndpoint, 
      api_key=config.apiKey,  
      api_version=config.apiVersion
   )      

   logging.basicConfig(level=logging.WARNING)
   logger = logging.getLogger(__name__)
   for key in logging.Logger.manager.loggerDict:
      logging.getLogger(key).setLevel(logging.WARNING)

   if not transcriptDestinationDir:
      logger.error("Transcript folder not provided")
      exit(1)

   chunks = []
   output_chunks = []
   current = []
   total_chunks = 0

   counter = Counter()

   logger.debug("Starting OpenAI summarization")

   # load the chunks from a json file
   input_file = os.path.join(transcriptDestinationDir, "output", "master_transcriptions.json")
   with open(input_file, "r", encoding="utf-8") as f:
      chunks = json.load(f)

   total_chunks = len(chunks)

   logger.debug("Total chunks to be processed: %s", len(chunks))

   # add segment list to a queue
   q = queue.Queue()
   for chunk in chunks:
      q.put(chunk)

   # load the existing chunks from a json file
   cache_file = os.path.join(transcriptDestinationDir, "output", "master_enriched.json")
   if os.path.isfile(cache_file):
      with open(cache_file, "r", encoding="utf-8") as f:
         current = json.load(f)  

   with Progress() as progress:
      task1 = progress.add_task("[purple]Enriching Summaries...", total=total_chunks)

      # create multiple threads to process the queue
      threads = []
      for i in range(config.processingThreads):
         t = threading.Thread(target=process_queue, args=(client, config, progress, task1, q, counter, logger, output_chunks, current))
         t.start()
         threads.append(t)

      # wait for all threads to finish
      for t in threads:
         t.join()

   # sort the output chunks by sourceId and start
   output_chunks.sort(key=lambda x: (x["sourceId"], convert_time_to_seconds(x["start"])))

   logger.debug("Total chunks processed: %s", len(output_chunks))

   # save the output chunks to a json file
   output_subdir = "output"
   output_file = os.path.join(transcriptDestinationDir, output_subdir, "master_enriched.json")

   ensure_directory_exists(os.path.dirname(output_file))

   with open(output_file, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=4)

