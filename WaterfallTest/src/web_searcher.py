# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests

from workflow import PipelineSpec

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)
 
 # get the API KEY here: https://developers.google.com/custom-search/v1/overview
GOOGLE_CUSTOM_WEB_SEARCH_API_KEY = os.environ["GOOGLE_CUSTOM_WEB_SEARCH_API_KEY"]

# get your Search Engine ID on your CSE control panel
#https://programmablesearchengine.google.com/controlpanel/all
AI_SUPPLY_STACK_SEARCH_ENGINE_ID = "00d305498d8da42e1"

class WebSearcher:
   '''
   Searches for links related to a specific query using the Google Custom Search Engine API.
   Returns a list of URLs extracted from the search results.
   '''

   def __init__(self, output_location: str):
      self.output_location = output_location   
      return
       

   def search (self, pipeline: PipelineSpec) -> list[str]: 
      '''
      Searches for links related to a specific query using the Google Custom Search Engine API.
      Returns a list of URLs extracted from the search results.
      '''
      # See this link for details of what we are doing here
      # https://thepythoncode.com/article/use-google-custom-search-engine-api-in-python?utm_content=cmp-true

      links = []
      # the search query you want
      query = "Generative AI"

      # Pull back 1- pages of results (100 items ...)
      for page in range(1, pipeline.pages + 1):
         # constructing the URL
         # doc: https://developers.google.com/custom-search/v1/using_rest
         # calculating start, (page=2) => (start=11), (page=3) => (start=21)
         start = (page - 1) * 10 + 1
         url = f"https://www.googleapis.com/customsearch/v1?key={GOOGLE_CUSTOM_WEB_SEARCH_API_KEY}&cx={pipeline.search_key}&q={query}&start={start}&dateRestrict=m[1]"      

         # make the API request
         data = requests.get(url).json()

         # get the result items
         search_items = data.get("items")

         # iterate over the results
         if search_items is not None:
            for i, search_item in enumerate(search_items, start=1):   
               # extract the page url
               link = search_item.get("link")
               links.append (link)
         else:
            break

      return links
        

