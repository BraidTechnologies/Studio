# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests
import json

from make_local_file_path import make_local_file_path

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

class Summariser:


   def __init__(self, path : str, text: str, output_location: str):
      self.path = path
      self.text = text
      self.output_location = output_location       

   def summarise(self) -> str: 
 
     
      path = self.path
      fake_name = make_local_file_path (path)
      contentOutputFileName = os.path.join(self.output_location, f"{fake_name}.summary.text")       

      if os.path.exists(contentOutputFileName):
         with open(contentOutputFileName, 'r', encoding='utf-8') as file:
            contents = file.read()  
         return contents

      logger.debug("Summarising: %s", path)

      session = requests.Session()

      summaryUrl = f"https://braidapi.azurewebsites.net/api/Summarize?session={SESSION_KEY}"
      data = {
         'text': self.text
      }

      response = session.post(summaryUrl, json=data, headers=headers)
      summary = response.text         

      if not os.path.exists(self.output_location):
         os.makedirs(self.output_location)

      # save the plain text content 
      with open(contentOutputFileName, "w+", encoding="utf-8") as file:
         json.dump(summary, file, indent=4, ensure_ascii=False)

      return summary

