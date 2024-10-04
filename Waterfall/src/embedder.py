'''PipelineStep to create the embedding for a text string'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests
import json
from requests.adapters import HTTPAdapter, Retry

from workflow import PipelineItem, PipelineStep
from embedder_repository_facade import EmbeddingRespositoryFacade

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


class Embedder (PipelineStep):
    '''PipelineStep to create the embedding for a text string'''

    def __init__(self, output_location: str):
        '''
        Initializes the Embedder object with the provided output location.
        '''
        # pylint: disable-next=useless-parent-delegation TODO - investigate how superclass argument passing works
        super(Embedder, self).__init__(output_location)

    def embed(self, pipeline_item: PipelineItem) -> PipelineItem:

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

        embed_url = f'https://braidapi.azurewebsites.net/api/Embed?session={
            SESSION_KEY}'
        json_input = {
            'request': {
                'text': pipeline_item.text
            }
        }

        response = session.post(embed_url, json=json_input, headers=headers)

        if (response.status_code == 200):
           response_json = json.loads (response.text)
           embedding = response_json['embedding']        

           if path is not None:
              repository.save(path, embedding)

           pipeline_item.embedding = embedding

           return pipeline_item
        else:
           logger.error (f"Unable to summarise item: {pipeline_item.path}.")
           return None
