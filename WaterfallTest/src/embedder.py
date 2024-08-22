# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests
from requests.adapters import HTTPAdapter, Retry

from embedder_repository_facade import EmbeddingRespositoryFacade

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

class Embedder:

   def __init__(self, path : str, output_location: str):
      '''
      Initializes the Embedder object with the provided path and output location.
      '''
      self.path = path
      self.output_location = output_location       

   def embed(self, text: str) -> str: 
      '''
      Embeds the text content provided in the object to a file at the specified path within the output location. If the file already exists, the existing content is returned. If the file does not exist, a new embedding is generated using an external API, saved to the file, and returned.

      Returns:
         str: The embedded text content.
      ''' 

      path = self.path
      repository = EmbeddingRespositoryFacade (self.output_location)      
      if repository.exists (path):          
         return repository.load (path)

      logger.debug("Embedding: %s", path)

      session = requests.Session()
      retries = Retry(total=5, backoff_factor=1, status_forcelist=[ 502, 503, 504 ])
      session.mount('https://', HTTPAdapter(max_retries=retries))   
      
      embedUrl = f"https://braidapi.azurewebsites.net/api/Embed?session={SESSION_KEY}"
      input = {
         'data': {
         'text': text
         }
      }

      response = session.post(embedUrl, json=input, headers=headers)
      embedding = response.text         

      if path != None:
         repository.save (path, embedding)

      return embedding
   

   @staticmethod
   def textToFloat (embedding: str) -> list[float]:
      '''
      Converts a string representation of numbers to a list of floating-point numbers.

      Parameters:
         embedding (str): A string containing numbers to be converted.

      Returns:
         list: A list of floating-point numbers extracted from the input string.
      ''' 
      characters_to_remove = "[]"  
      translation_table = str.maketrans('', '', characters_to_remove)
   
      numbers = embedding.split(',')
         
      stripped_number_array = [number.translate(translation_table) for number in numbers]            
         
      number_array = [float(number) for number in stripped_number_array] 

      return number_array     
   

