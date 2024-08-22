# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests
from requests.adapters import HTTPAdapter, Retry

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

SESSION_KEY = os.environ["SessionKey"]

headers = {
   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
   'Content-Type': 'application/json',   
   'Accept': 'application/json'
}  

class ThemeFinder:

   def __init__(self, text: str):
      self.text = text   

   def find_theme(self, length: int) -> str: 

      session = requests.Session()
      retries = Retry(total=5, backoff_factor=1, status_forcelist=[ 502, 503, 504 ])
      session.mount('https://', HTTPAdapter(max_retries=retries))  
      
      summaryUrl = f"https://braidapi.azurewebsites.net/api/FindTheme?session={SESSION_KEY}"
      input = {
         'data': {
         'text': self.text,
         'length' : length
         }
      }

      response = session.post(summaryUrl, json=input, headers=headers)
      theme = response.text         

      return theme

