# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging


# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)
 
from web_searcher import WebSearcher
from html_file_downloader import HtmlFileDownloader
from summariser import Summariser

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

      content_list = []
      for link in links:
         downloader = HtmlFileDownloader (link, self.output_location)
         content = downloader.download ()

         summariser = Summariser (link, content, self.output_location)
         summary = summariser.summarise ();

         content_list.append (summary)
      
      return content_list
      
        

