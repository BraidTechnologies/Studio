'''Module to store data in the Chunk table of the BraidApis '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import logging
import requests
from requests.adapters import HTTPAdapter, Retry

from src.make_local_file_path import make_local_file_path
from src.workflow import PipelineItem

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

SESSION_KEY = os.environ['SessionKey']

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

class DbRespository:
    '''
    Class providing load, save, and existence check for files in the Braid Cosmos database.
    '''

    def __init__(self, context_id: str):
        
        self.context_id = context_id

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        models_url = f'https://braid-api.azurewebsites.net/api/EnumerateModels?session={
            SESSION_KEY}'
        json_input = {
            'request': ""
        }

        response = session.post(models_url, json=json_input, headers=headers)

        if response.status_code == 200:
            self.default_model = response.text.defaultId
            self.default_embedding_model = response.text.defaultEmbeddingId

    def save(self, functional_key: str, item: PipelineItem) -> None:
        '''
        Save the provided item to the database.

        Parameters:
           functional_key (str): functionalKey to use for the record
           item (PipelineItem): The content to be saved.
        '''

        return None

    def load(self, functional_key: str, context_ID: str) -> PipelineItem:
        '''
        Load content from the database based on the provided context and functional key. 
        If the file exists in the output location, its contents are read and returned as a string. 
        If the record is not found, return None 

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           item (PipelineItem): The loaded content or None 
        '''
            
        return None

    def exists(self, path: str) -> bool:
        '''
        Checks if a record with the specified key and context exists in the database 

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           bool: True if the record exists, False otherwise.
        '''
        functional_key = make_local_file_path(path)        
        logger.debug('Loading: %s', functional_key)

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        chunk_url = f'https://braid-api.azurewebsites.net/api/GetChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': ""
        }

        response = session.post(chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:
            return True
        
        return False
