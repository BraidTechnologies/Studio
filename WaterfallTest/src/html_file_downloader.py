# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports

import logging
import os
from bs4 import BeautifulSoup
import requests
from urllib.parse import urlsplit
import json

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

class HtmlFileDownloader:
    """Utility class to download an HTML file"""

    def __init__(self, path : str, output_location: str):
        """initialize the counter"""
        self.path = path
        self.output_location = output_location       

    def download(self): 
       path = self.path

       logger.debug("Downloading: %s", path)

       session = requests.Session()
       if (path.find("http") != -1):
          # Add headers in case the website expects cookies and/or JavaScript
          html_content = session.get(path, headers=headers).text         
       else:
          with open(path, 'r', encoding='utf-8') as file:
             html_content = file.read()          

       soup = BeautifulSoup(html_content, "html.parser") 
       full_text = soup.get_text()

       path_only = makePathOnly (path)
       fakeName = path_only.replace("//", "_").replace("/", "_")
       if not os.path.exists(self.output_location):
          os.makedirs(self.output_location)
       contentOutputFileName = os.path.join(self.output_location, f"{fakeName}.text")

       # save the plain text content as a .json.mdd file
       with open(contentOutputFileName, "w+", encoding="utf-8") as file:
          json.dump(full_text, file, indent=4, ensure_ascii=False)

       return full_text



def makePathOnly (url: str) -> str:
   '''
   Extracts the path from the given URL and returns a clean path by combining the netloc and path components.
   '''    
   split_url = urlsplit(url)
   # split_url.scheme   "http"
   # split_url.netloc   "127.0.0.1" 
   # split_url.path     "/asdf/login.php"
   # Use all the path 
   clean_path = str(split_url.netloc) + split_url.path
   return clean_path