'''PipelineStep to create a summary for a text string'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests
from requests.adapters import HTTPAdapter, Retry

from workflow import PipelineItem, PipelineStep
from summary_repository_facade import SummaryRespositoryFacade

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

    def __init__(self, output_location: str):
        '''
        Initializes the Chunker object with the provided output location.
        '''
        super(Chunker, self).__init__(output_location)

    def chunk(self, pipeline_item: PipelineItem, max_words: int, overlap_words: int) -> list[PipelineItem]:
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

        summary_url = f'https://braidapi.azurewebsites.net/api/Chunk?session={
            SESSION_KEY}'

        if max_words == 0:
            input_json = {
               'data': {
                   'text': pipeline_item.text,
                   'overlapWords': overlap_words
               }
            }
        else:
            input_json = {
               'data': {
                 'text': pipeline_item.text,
                 'maxWords' : max_words,
                 'overlapWords': overlap_words
               }
            }

        response = session.post(summary_url, json=input_json, headers=headers)
        chunks = Chunker.text_to_array(response.text)
        pipeline_chunks = []

        for i, chunk in enumerate(chunks):
            new_item = PipelineItem()
            new_item.path = pipeline_item.path
            new_item.text = chunk
            new_item.chunk = i
            new_item.summary = pipeline_item.summary
            new_item.embedding = pipeline_item.embedding
            new_item.embedding_as_float = pipeline_item.embedding_as_float
            new_item.cluster = pipeline_item.cluster
            pipeline_chunks.append(new_item)

        return pipeline_chunks

    @staticmethod
    def text_to_array(text) -> list[float]:
        '''
        Converts a text string to a list of text elements by removing characters '[', ']' and splitting the text by '"'. Returns the resulting list of text element.
        '''
        characters_to_remove = '[]'
        translation_table = str.maketrans('', '', characters_to_remove)

        elements = text.split('"')

        stripped_array = [element.translate(
            translation_table) for element in elements]

        text_array = [item for item in stripped_array]
        filtered_array = [item for item in text_array if item != ',' and item != '']

        return filtered_array
