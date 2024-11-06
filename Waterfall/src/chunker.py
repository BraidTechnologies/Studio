'''PipelineStep to create a summary for a text string'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json
import requests
from requests.adapters import HTTPAdapter, Retry

from src.workflow import PipelineItem, PipelineStep

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


class Chunker (PipelineStep):
    '''PipelineStep to chunk a text string'''

    # pylint: disable-next=useless-parent-delegation 
    def __init__(self, output_location: str):
        '''
        Initializes the Chunker object with the provided output location.
        '''
        super(Chunker, self).__init__(output_location)

    def chunk(self, pipeline_item: PipelineItem, chunk_size_words: int, overlap_words: int) -> list[PipelineItem]:
        '''
        Chunk a text string into smaller parts and return a list of PipelineItem objects representing each chunk. Uses an external API to perform the chunking process. 

        Parameters:
            - pipeline_item: PipelineItem - The item to be chunked.
            - max_words - maximum words per chunk. If 0, use the models context window size. 
            - overlap_words - how many words to use to overlap chunks. 0 = no overlap.             

        Returns:
            - List of PipelineItem - List of PipelineItem objects representing the chunks.
         ''' ''

        logger.debug('Chunking: %s', pipeline_item.path)

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        summary_url = f'https://braid-api.azurewebsites.net/api/Chunk?session={
            SESSION_KEY}'

        if chunk_size_words == 0:
            input_json = {
                'request': {
                    'text': pipeline_item.text,
                    'overlapWords': overlap_words
                }
            }
        else:
            input_json = {
                'request': {
                    'text': pipeline_item.text,
                    'chunkSize': chunk_size_words,
                    'overlapWords': overlap_words
                }
            }

        response = session.post(summary_url, json=input_json, headers=headers)
        pipeline_chunks = []  # If there is an error in the API, return an empty list

        if (response.status_code == 200):
            response_json = json.loads(response.text)
            chunks = response_json['chunks']

            for i, chunk in enumerate(chunks):
                new_item = PipelineItem()
                new_item.path = pipeline_item.path
                new_item.text = chunk
                new_item.chunk = i
                new_item.summary = pipeline_item.summary
                new_item.embedding = pipeline_item.embedding
                new_item.cluster = pipeline_item.cluster
                pipeline_chunks.append(new_item)

        return pipeline_chunks
