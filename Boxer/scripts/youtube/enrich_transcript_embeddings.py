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
import tiktoken
from tenacity import (
    retry,
    wait_random_exponential,
    stop_after_attempt,
    retry_if_not_exception_type,
)
from rich.progress import Progress

# Local Modules
from common.ApiConfiguration import ApiConfiguration
from common.common_functions import ensure_directory_exists
from common.common_functions import get_embedding

tokenizer = tiktoken.get_encoding("cl100k_base")

def normalize_text(s, sep_token=" \n "):
    """normalize text by removing extra spaces and newlines"""
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r". ,", "", s)
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
    """get the embedding for a text"""
    embedding = get_embedding(text, 
                              client, 
                              config)
    return embedding

def process_queue(client, config, progress, task, q, logger, output_chunks, current_chunks):
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
           try:
              embedding = get_text_embedding(client, config, chunk["text"])
              chunk["ada_v2"] = embedding.copy()     
              output_chunks.append(chunk.copy())                          
           except BadRequestError as request_error:
              logger.warning("Error: %s %s", chunk.get('sourceId'), request_error)
           except Exception as e:
              logger.warning("Error: %s %s", chunk.get('sourceId'), 'Unknown error')          

        progress.update(task, advance=1)
        q.task_done()

def convert_time_to_seconds(value):
    """convert time to seconds"""
    time_value = value.split(":")
    if len(time_value) == 3:
        h, m, s = time_value
        return int(h) * 3600 + int(m) * 60 + int(s)
    else:
        return 0

def enrich_transcript_embeddings(config, transcriptDestinationDir): 

   client = AzureOpenAI(
      azure_endpoint = config.resourceEndpoint, 
      api_key=config.apiKey,  
      api_version=config.apiVersion
   )   

   logger = logging.getLogger(__name__)
   logging.basicConfig(level=logging.WARNING)
   for key in logging.Logger.manager.loggerDict:
      logging.getLogger(key).setLevel(logging.WARNING)
   
   if not transcriptDestinationDir:
      logger.error("Transcript folder not provided")
      exit(1)

   total_chunks = 0
   output_chunks = []

   input_file = os.path.join(transcriptDestinationDir, "output", "master_enriched.json")
   with open(input_file, "r", encoding="utf-8") as f:
      chunks = json.load(f)

   total_chunks = len(chunks)

   logger.debug("Starting OpenAI Embeddings")
   logger.debug("Total chunks to be processed: %s", len(chunks))

   q = queue.Queue()
   for chunk in chunks:
      q.put(chunk)

   cache_file = os.path.join(transcriptDestinationDir, "output", "master_enriched.json")
   if os.path.isfile(cache_file):
      with open(cache_file, "r", encoding="utf-8") as f:
         current = json.load(f) 

   with Progress() as progress:
      task1 = progress.add_task("[green]Enriching Embeddings...", total=total_chunks)
      threads = []
      for i in range(config.processingThreads):
         t = threading.Thread(target=process_queue, args=(client, config, progress, task1, q, logger, output_chunks, current))
         t.start()
         threads.append(t)

      for t in threads:
         t.join()

   output_chunks.sort(key=lambda x: (x["sourceId"], convert_time_to_seconds(x["start"])))

   logger.debug("Total chunks processed: %s", len(output_chunks))

   output_subdir = "output"
   output_file = os.path.join(transcriptDestinationDir, output_subdir, "master_enriched.json")

   ensure_directory_exists(os.path.dirname(output_file))

   with open(output_file, "w", encoding="utf-8") as f:
      json.dump(chunks, f, ensure_ascii=False, indent=4)
