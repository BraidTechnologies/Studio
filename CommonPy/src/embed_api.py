'''
API client for the enriched query service.

This module provides a client for interacting with the enriched query API endpoints,
which handle semantic search, question generation, and retrieval of enriched text chunks.
'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import logging
import requests
from requests.adapters import HTTPAdapter, Retry

from .request_utilities import request_timeout
from .embed_api_types import IEmbedRequest, IEmbedResponse
from .type_utilities import safe_dict_to_object, safe_cast

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

class EmbeddingApi:
    '''
    API client for the embedding service.

    This class provides a client for interacting with the embedding API endpoint,
    which generates vector embeddings from text using AI models.

    Attributes:
        session: A requests Session object configured with retry logic

    Methods:
        embed: Generates a vector embedding for the provided text
    '''

    def __init__(self):

        self.session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        self.session.mount('https://', HTTPAdapter(max_retries=retries))


    def embed(self, embedding_request: IEmbedRequest) -> IEmbedResponse:

        logger.debug('Generating question for: %s', embedding_request.text)

        wrapped = {
            'request': embedding_request.__dict__
        }

        # send the request to the API
        # question_url = f'https://braid-api.azurewebsites.net/api/Embed?session={SESSION_KEY}'
        question_url = f'http://localhost:7071/api/Embed?session={SESSION_KEY}'

        response = self.session.post(
            question_url, json=wrapped, headers=headers, timeout=request_timeout)

        # Check for successful response
        if response.status_code == 200:
            return safe_dict_to_object(response.json(), IEmbedResponse)
        else:
            raise RuntimeError('Error returned from API:' + response.text)

        return None
    
    