'''Module to store data in the Chunk table of the BraidApis '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import logging
import datetime
import json
import requests
from requests.adapters import HTTPAdapter, Retry

from .storable_types import IStorableQuerySpec
from .chunk_repository_api_types import IStoredChunk, IStoredEmbedding, IStoredTextRendering
from .type_utilities import safe_dict_to_object, safe_cast

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.WARNING)

SESSION_KEY = os.environ['SessionKey']

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

waterfall_application_name = 'Waterfall'
boxer_application_name = 'Boxer'
chunk_class_name = 'Chunk'
chunk_schema_version = '1'

class ChunkRepository:
    '''
    Class providing load, save, and existence check for files in the Braid Cosmos database.
    '''

    def __init__(self):

        self.session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        self.session.mount('https://', HTTPAdapter(max_retries=retries))

        models_url = f'https://braid-api.azurewebsites.net/api/EnumerateModels?session={
        #models_url = f'http://localhost:7071/api/EnumerateModels?session={
            SESSION_KEY}'
        json_input = {
            'request': ''
        }

        response = self.session.post(
            models_url, json=json_input, headers=headers)

        if response.status_code == 200:
            data = response.json()
            self.default_model = data['defaultId']
            self.default_embedding_model = data['defaultEmbeddingId']

        else:
            raise RuntimeError('Error returned from API:' + response.text)

    def save(self, chunk: IStoredChunk) -> bool:
        '''
        Save the provided item to the database.

        Parameters:
           functional_key (str): functionalKey to use for the record
           chunk (IStoredChunk): The content to be saved.
        '''
        logger.debug('Saving: %s', chunk.id)

        utc_time = datetime.datetime.now(datetime.timezone.utc)
        utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')

        chunk.amended = utc_time_string

        # we need to turn embedded objects into JSON by converting to dictionaries
        chunk_as_json = IStoredChunk(chunk)
        if chunk.storedEmbedding:
            chunk_as_json.storedEmbedding = chunk.storedEmbedding.__dict__
        if chunk.storedTitle:
            chunk_as_json.storedTitle = chunk.storedTitle.__dict__
        if chunk.storedSummary:
            chunk_as_json.storedSummary = chunk.storedSummary.__dict__

        chunk_url = f'https://braid-api.azurewebsites.net/api/SaveChunk?session={
        #chunk_url = f'http://localhost:7071/api/SaveChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': chunk_as_json.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:
            logger.debug('Saved: %s', chunk.id)
            return True

        logger.debug('failed save: %s', chunk.id)
        return False

    def find(self, functional_key: str) -> IStoredChunk:
        '''
        Load content from the database based on the provided context and functional key.
        If the file exists in the output location, its contents are read and returned as a string.
        If the record is not found, return None

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           item (IStoredChunk): The loaded content or None
        '''

        spec: IStorableQuerySpec = IStorableQuerySpec()
        spec.id = None
        spec.functionalSearchKey = functional_key
        logger.debug('Finding: %s', functional_key)

        chunk_url = f'https://braid-api.azurewebsites.net/api/FindChunk?session={
        #chunk_url = f'http://localhost:7071/api/FindChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': spec.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:

            response_json = json.loads(response.text)

            # Convert the main class and nested classes from JSON to Python classes
            summary_obj = safe_dict_to_object(response_json['storedSummary'])
            safe_summary = safe_cast(summary_obj, IStoredTextRendering)

            title_obj = safe_dict_to_object(response_json['storedTitle'])
            safe_title = safe_cast(title_obj, IStoredTextRendering)

            embedding_obj = safe_dict_to_object(
                response_json['storedEmbedding'])
            safe_embedding = safe_cast(embedding_obj, IStoredEmbedding)

            # Glue them together into one Python class
            response_json['storedEmbedding'] = safe_embedding
            response_json['storedSummary'] = safe_summary
            response_json['storedTitle'] = safe_title

            response_obj = safe_dict_to_object(response_json)
            safe_response: IStoredChunk = safe_cast(response_obj, IStoredChunk)

            logger.debug('Found: %s', functional_key)
            return safe_response

        logger.debug('Failed to find: %s', functional_key)
        return None

    def load(self, record_id: str) -> IStoredChunk:
        '''
        Load content from the database based on the provided context and key.
        If the file exists in the output location, its contents are read and returned as a string.
        If the record is not found, return None

        Parameters:
           record_id (str): key to use for the record

        Returns:
           item (IStoredChunk): The loaded content or None
        '''

        spec: IStorableQuerySpec = IStorableQuerySpec()
        spec.id = record_id
        spec.functionalSearchKey = None
        logger.debug('Finding: %s', record_id)

        chunk_url = f'https://braid-api.azurewebsites.net/api/FindChunk?session={
        #chunk_url = f'http://localhost:7071/api/GetChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': spec.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:

            response_json = json.loads(response.text)

            # Convert the main class and nested classes from JSON dictionaries to Python classes
            response_obj = safe_dict_to_object(response_json)
            safe_response: IStoredChunk = safe_cast(response_obj, IStoredChunk)

            summary_obj = safe_dict_to_object(response_json['storedSummary'])
            safe_summary = safe_cast(summary_obj, IStoredTextRendering)

            embedding_obj = safe_dict_to_object(
                response_json['storedEmbedding'])
            safe_embedding = safe_cast(embedding_obj, IStoredEmbedding)

            # Glue them together into one Python class
            safe_response.storedEmbedding = safe_embedding
            safe_response.storedSummary = safe_summary

            logger.debug('Loaded: %s', record_id)
            return safe_response

        logger.debug('Failed to load: %s', record_id)
        return None

    def remove(self, record_id: str) -> bool:
        '''
        Removes a record with the specified key from database

        Parameters:
           id (str): primary key to use for the record

        Returns:
           bool: True if the record is removed, False otherwise.
        '''
        spec: IStorableQuerySpec = IStorableQuerySpec()
        spec.id = record_id
        spec.functionalSearchKey = None
        logger.debug('Removing: %s', id)

        chunk_url = f'https://braid-api.azurewebsites.net/api/FindChunk?session={
        #chunk_url = f'http://localhost:7071/api/RemoveChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': spec.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:
            logger.debug('Removed: %s', record_id)
            return True

        logger.debug('Failed to remove: %s', record_id)
        return False

    def exists(self, functional_key: str) -> bool:
        '''
        Checks if a record with the specified key and context exists in the database

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           bool: True if the record exists, False otherwise.
        '''
        spec: IStorableQuerySpec = IStorableQuerySpec()
        spec.id = None
        spec.functionalSearchKey = functional_key
        logger.debug('Checking existence of: %s', functional_key)

        chunk_url = f'https://braid-api.azurewebsites.net/api/FindChunk?session={
        #chunk_url = f'http://localhost:7071/api/FindChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': spec.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:
            logger.debug('Found: %s', functional_key)
            return True

        logger.debug('Failed to find: %s', functional_key)
        return False
