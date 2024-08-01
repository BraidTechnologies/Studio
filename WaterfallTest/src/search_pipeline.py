# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)
 
from web_searcher import WebSearcher
from html_file_downloader import HtmlFileDownloader
from summariser import Summariser
from embedder import Embedder

class WaterfallDataPipeline:
   '''
   Searches for HTML content from a list of links.

   Returns:
      list[str]: A list of HTML content downloaded from the specified links.
   '''

   def __init__(self, output_location: str):
      self.output_location = output_location       
      return
       

   def search (self) -> list[str]: 
      '''
      Searches for HTML content from a list of links.

      Returns:
          list[str]: A list of HTML content downloaded from the specified links.
      '''
      searcher = WebSearcher (self.output_location)

      links = searcher.search ()

      summaries = []
      embeddings = []
      for link in links:
         downloader = HtmlFileDownloader (link, self.output_location)
         summary = downloader.download ()

         summariser = Summariser (link, summary, self.output_location)
         summary = summariser.summarise ()
         summaries.append (summary)

         embedder = Embedder (link, summary, self.output_location)
         embedding = embedder.embed ()
         embeddings.append (embedding)         

      output_results = []
      for i, summary in enumerate(summaries):
         output_item = dict()
         output_item["summary"] = summary
         output_item["embedding"] = embeddings[i]
         output_item["path"] = links[i]
         output_results.append (output_item)
      
      # save the test results to a json file
      output_file = os.path.join(self.output_location, "test_output.json")
      with open(output_file, "w+", encoding="utf-8") as f:
         json.dump(output_results, f)        
        
      return summaries
      
        

