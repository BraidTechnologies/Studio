'''Module to store data in the Chunk table of the BraidApis '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import logging
import datetime
import uuid
import json
import requests
from requests.adapters import HTTPAdapter, Retry

from CommonPy.src.chunk_repository_api_types import IStoredChunk, IStorableQuerySpec, IStoredEmbedding, IStoredTextRendering
from CommonPy.src.type_utilities import safe_dict_to_object, safe_cast
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


class DbRepository:
    '''
    Class providing load, save, and existence check for files in the Braid Cosmos database.
    '''

    def __init__(self, context_id: str):

        self.context_id = context_id

        self.session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        self.session.mount('https://', HTTPAdapter(max_retries=retries))

        models_url = f'https://braid-api.azurewebsites.net/api/EnumerateModels?session={
            SESSION_KEY}'
        json_input = {
            'request': ""
        }

        response = self.session.post(
            models_url, json=json_input, headers=headers)

        if response.status_code == 200:
            data = response.json()
            self.default_model = data["defaultId"]
            self.default_embedding_model = data["defaultEmbeddingId"]

        else:
            raise RuntimeError("Error returned from API:" + response.text)

    def save(self, path: str, item: PipelineItem) -> bool:
        '''
        Save the provided item to the database.

        Parameters:
           functional_key (str): functionalKey to use for the record
           item (PipelineItem): The content to be saved.
        '''
        functional_key = make_local_file_path(path)
        logger.debug('Saving: %s', functional_key)

        utc_time = datetime.datetime.now(datetime.timezone.utc)
        utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')

        summary: IStoredTextRendering = IStoredTextRendering()
        summary.modelId = self.default_model
        summary.text = item.summary

        embedding: IStoredEmbedding = IStoredEmbedding()
        embedding.modelId = self.default_embedding_model
        embedding.embedding = item.embedding

        chunk: IStoredChunk = IStoredChunk()
        chunk.id = str(uuid.uuid4())
        chunk.applicationId = "Test"
        chunk.contextId = "TestContext"
        chunk.userId = None
        chunk.created = utc_time_string
        chunk.amended = chunk.created
        chunk.className = "TestChunkClass"
        chunk.schemaVersion = "1"
        chunk.functionalSearchKey = functional_key
        chunk.parentChunkId = None
        chunk.originalText = item.text
        chunk.storedEmbedding = embedding.__dict__
        chunk.storedSummary = summary.__dict__
        chunk.storedTitle = None
        chunk.relatedChunks = None

        # chunk_url = f'https://braid-api.azurewebsites.net/api/SaveChunk?session={
        chunk_url = f'http://localhost:7071/api/SaveChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': chunk.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:
            return True

        return False

    def load(self, path: str) -> PipelineItem:
        '''
        Load content from the database based on the provided context and functional key. 
        If the file exists in the output location, its contents are read and returned as a string. 
        If the record is not found, return None 

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           item (PipelineItem): The loaded content or None 
        '''

        functional_key = make_local_file_path(path)
        spec: IStorableQuerySpec = IStorableQuerySpec()
        spec.id = None
        spec.functionalSearchKey = functional_key
        logger.debug('Loading: %s', functional_key)

        # chunk_url = f'https://braid-api.azurewebsites.net/api/FindChunk?session={
        chunk_url = f'http://localhost:7071/api/FindChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': spec.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:

            response_json = json.loads(response.text)

            # Convert the main class and nested classes from JSON to Python classes
            response_obj = safe_dict_to_object(response_json)
            safe_response = safe_cast(response_obj, IStoredChunk)

            summary_obj = safe_dict_to_object(response_json['storedSummary'])
            safe_summary = safe_cast(summary_obj, IStoredTextRendering)

            embedding_obj = safe_dict_to_object(
                response_json['storedEmbedding'])
            safe_embedding = safe_cast(embedding_obj, IStoredEmbedding)

            # Glue them together into one Python class
            safe_response.storedEmbedding = safe_embedding
            safe_response.storedSummary = safe_summary

            # Map from a Chunk to a PipelineItem
            item = PipelineItem()
            item.path = path
            item.text = safe_response.originalText
            if safe_response.storedSummary:
                item.summary = safe_response.storedSummary.text
            else:
                item.summary = None
            if safe_response.storedEmbedding:
                item.embedding = safe_response.storedEmbedding.embedding
            else:
                item.embedding = None

            return item

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
        spec: IStorableQuerySpec = IStorableQuerySpec()
        spec.id = None
        spec.functionalSearchKey = functional_key
        logger.debug('Checking existence of: %s', functional_key)

        # chunk_url = f'https://braid-api.azurewebsites.net/api/FindChunk?session={
        chunk_url = f'http://localhost:7071/api/FindChunk?session={
            SESSION_KEY}'
        json_input = {
            'request': spec.__dict__
        }

        response = self.session.post(
            chunk_url, json=json_input, headers=headers)

        if response.status_code == 200:
            return True

        return False
