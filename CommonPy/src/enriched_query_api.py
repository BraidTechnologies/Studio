'''API to store data in the Chunk table of the Braid Apis '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import logging
import requests
from requests.adapters import HTTPAdapter, Retry

from .request_utilities import request_timeout
from .enriched_query_api_types import IGenerateQuestionRequest, IQuestionGenerationResponse, IEnrichedQueryRequest, IEnrichedResponse, IEnrichedChunkSummary, IRelevantEnrichedChunk
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

class EnrichedQueryApi:


    def __init__(self):

        self.session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        self.session.mount('https://', HTTPAdapter(max_retries=retries))


    def generate_question(self, question_request: IGenerateQuestionRequest) -> IQuestionGenerationResponse:

        logger.debug('Generating question for: %s', question_request.summary)

        wrapped = {
            'request': question_request.__dict__
        }

        # send the request to the API
        # question_url = f'https://braid-api.azurewebsites.net/api/GenerateQuestion?session={SESSION_KEY}'
        question_url = f'http://localhost:7071/api/GenerateQuestion?session={SESSION_KEY}'

        response = self.session.post(
            question_url, json=wrapped, headers=headers, timeout=request_timeout)

        # Check for successful response
        if response.status_code == 200:
            return safe_dict_to_object(response.json(), IQuestionGenerationResponse)
        else:
            raise RuntimeError('Error returned from API:' + response.text)

        return None
    
    def enriched_query (self, enriched_query_request: IEnrichedQueryRequest) -> IEnrichedResponse:

        logger.debug('Generating enriched query for: %s', enriched_query_request.question)

        wrapped = {
            'request': enriched_query_request.__dict__
        }

        # send the request to the API
        # question_url = f'https://braid-api.azurewebsites.net/api/QueryModelWithEnrichment?session={SESSION_KEY}'
        question_url = f'http://localhost:7071/api/QueryModelWithEnrichment?session={SESSION_KEY}'

        response = self.session.post(
            question_url, json=wrapped, headers=headers, timeout=request_timeout)

        # Check for successful response
        if response.status_code == 200:
            response_json = response.json()
            
            return_obj = safe_dict_to_object(response_json, IEnrichedResponse)

            return_obj.chunks = []
            for chunk in response_json['chunks']:
               chunk_obj = safe_dict_to_object(chunk['chunk'])
               safe_chunk_obj = safe_cast(chunk_obj, IEnrichedChunkSummary)
               relevance = chunk['relevance']
               relevant_chunk = IRelevantEnrichedChunk()
               relevant_chunk.chunk = safe_chunk_obj
               relevant_chunk.relevance = relevance
               return_obj.chunks.append(relevant_chunk)
            return return_obj
        else:
            raise RuntimeError('Error returned from API:' + response.text)

        return None
