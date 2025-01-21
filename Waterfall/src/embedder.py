'''PipelineStep to create the embedding for a text string'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json
import requests
from requests.adapters import HTTPAdapter, Retry

from src.workflow import PipelineItem, PipelineStep
from src.embedder_repository_facade import EmbeddingRespositoryFacade
from CommonPy.src.request_utilities import request_timeout

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.WARNING)

SESSION_KEY = os.environ['BRAID_SESSION_KEY']

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}


class Embedder (PipelineStep):
    '''PipelineStep to create the embedding for a text string'''

    # pylint: disable-next=useless-parent-delegation
    def __init__(self, output_location: str):
        '''
        Initializes the Embedder object with the provided output location.
        '''
        # pylint: disable-next=useless-parent-delegation
        super(Embedder, self).__init__(output_location)

    def embed(self, pipeline_item: PipelineItem) -> PipelineItem:
        """
        Generates an embedding for the given PipelineItem. If an embedding
        already exists for the item's path, it is loaded from the repository.
        Otherwise, a new embedding is created using an external API, saved,
        and assigned to the PipelineItem.

        Args:
            pipeline_item (PipelineItem): The item containing text to be embedded.

        Returns:
            PipelineItem: The updated item with the generated embedding, or
            None if the embedding could not be calculated.
        """
        path = pipeline_item.path
        repository = EmbeddingRespositoryFacade(self.output_location)
        if repository.exists(path):
            embedding = repository.load(path)
            pipeline_item.embedding = embedding
            return pipeline_item

        logger.debug('Embedding: %s', path)

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        embed_url = f'https://braid-api.azurewebsites.net/api/Embed?session={
            SESSION_KEY}'
        json_input = {
            'request': {
                'text': pipeline_item.text
            }
        }

        response = session.post(embed_url, json=json_input, 
                                headers=headers,
                                timeout=request_timeout)

        if response.status_code == 200:
            response_json = json.loads(response.text)
            embedding = response_json['embedding']

            if path is not None:
                repository.save(path, embedding)

            pipeline_item.embedding = embedding

            return pipeline_item
        else:
            logger.error("Unable to calculate embedding item: %s", pipeline_item.path)
            return None
        

    def embed_text (self, text: str) -> list[float]:
        """
        Generates an embedding for the given text using an external API.

        Args:
            text (str): The text string to be embedded.

        Returns:
            list[float]: The generated embedding as a list of floats, or
            None if the embedding could not be calculated.
        """

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        embed_url = f'https://braid-api.azurewebsites.net/api/Embed?session={
            SESSION_KEY}'
        json_input = {
            'request': {
                'text': text
            }
        }

        response = session.post(embed_url, json=json_input, 
                                headers=headers,
                                timeout=request_timeout)

        if response.status_code == 200:
            response_json = json.loads(response.text)
            embedding = response_json['embedding']

            return embedding
        else:
            logger.error("Unable to calculate embedding: %s", text)
            return None        
