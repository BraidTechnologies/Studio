# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports

import logging
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

headers = {
   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
   'Accept-Encoding': 'none',
   'Accept-Language': 'en-US,en;q=0.8',
   'Connection': 'keep-alive'       
}  

class HtmlLinkCrawler:
   """Utility class to crawl an HTML page for links and recursively build a full tree for file search within the same site.

   Attributes:
      path (str): The URL path to start crawling.
      output_location (str): The location to store the crawled links.
      max_depth (int): The maximum depth of recursion allowed.

   Methods:
     crawl() -> list[str]: Initiates the crawling process and returns a list of crawled links.
     crawl_links_recursively(path: str, output_location: str, links: list[str], current_depth: int) -> None: Recursively crawls links on an HTML page to build a full tree for file search within the same site.
   """

   def __init__(self, path : str, output_location: str, max_depth: int = 10):
      self.path = path
      self.output_location = output_location
      self.max_depth = max_depth        

   def crawl(self) -> list[str]: 
      links = []
      self.crawl_links_recursively (self.path, self.output_location, links, 0)
      return links
        
   def crawl_links_recursively (self, path: str, output_location: str, links: list[str], current_depth: int):
      """Recursively crawl links on an HTML page to build a full tree for file search within the same site.

      Args:
         path (str): The URL path to crawl.
         output_location (str): The location to store the crawled links.
         links (list[str]): List of links crawled so far.
         current_depth (int): The current depth of recursion.

      Returns:
         None
      """      
      logger.debug("Crawling: %s", path)

      # Bail if we hit maximum depth
      current_depth = current_depth + 1
      if current_depth > self.max_depth:
         logger.debug("Depth exceeded: %s", path)
         return        

      session = requests.Session()
      if (path.find("http") != -1):
         # Add headers in case the website expects cookies and/or JavaScript
         html_content = session.get(path, headers=headers).text         
      else:
         with open(path, 'r', encoding='utf-8') as file:
            html_content = file.read()          

      soup = BeautifulSoup(html_content, "html.parser")

      links.append(path)

      subLinks = soup.find_all('a')
      subUrls = []
      for link in subLinks:
         url = str(link.get('href'))
         subUrls.append(url)

      full = add_prefix(path, subUrls)
      deduped = deduplicate(links, full)
      trimmed = remove_exits(path, deduped)

      for link in trimmed:
         if link not in links:
            self.crawl_links_recursively (link, output_location, links, current_depth + 1)     

def deduplicate(currentLinks: list[str], newLinks: list[str]) -> list[str]: # remove duplicates 
   """Remove duplicates from a list of new links by comparing them with the current links list.

   Args:
      currentLinks (list): List of current links.
      newLinks (list): List of new links to be checked for duplicates.

   Returns:
      list: A list of new links without any duplicates.
   """
   deduped = []

   for item in newLinks:
      if not item in currentLinks:
         deduped.append(item)
    
   return deduped

def remove_exits(sourceUrl : str, links : list[str]) -> list[str]: # remove links that point outside the main site being searched
                                    # we also remove links starting with #as they are just the same page
    """Remove links that point outside the main site being searched.

    Args:
        sourceUrl (str): The URL of the main site being searched.
        links (list): List of links to be filtered.

    Returns:
        list: Filtered list of links that do not point outside the main site.
    """
    trimmed = []

    for item in links:
        match = ((not 'http' in item) 
                 and (not '#' in item))
        if match :
            trimmed .append(item)        

    return trimmed


def add_prefix(sourceUrl : str, links : str) -> str:
    """Add prefixes to relative URLs

    Args:
        sourceUrl (str): The base URL to resolve relative links from.
        links (list): List of relative URLs to be prefixed.

    Returns:
        list: List of fully qualified URLs after adding prefixes.
    """
    full = []

    for item in links:
        newUrl = makeFullyQualified(sourceUrl, item)
        full.append(newUrl)

    return full

        
def makeFullyQualified (base: str, rel: str) -> str:
    return urljoin(base,rel)
