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


class Summariser (PipelineStep):
    '''PipelineStep to create a summary for a text string'''

    def __init__(self, output_location: str):
        '''
        Initializes the Summariser object with the provided output location.
        '''
        super(Summariser, self).__init__(output_location)

    def summarise(self, pipeline_item: PipelineItem) -> PipelineItem:
        '''
        Summarises the text content by either loading an existing summary from the specified path or generating a new summary using an external API. 
        If an existing summary is found, it is returned; otherwise, a new summary is generated and saved at the specified path. 
        Returns the generated or loaded summary as a string.
        '''
        path = pipeline_item.path
        repository = SummaryRespositoryFacade(self.output_location)
        if repository.exists(path):
            summary = repository.load(path)
            pipeline_item.summary = summary
            return pipeline_item

        logger.debug('Summarising: %s', path)

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        summary_url = f'https://braidapi.azurewebsites.net/api/Summarize?session={
            SESSION_KEY}'
        input_json = {
            'data': {
                'text': pipeline_item.text
            }
        }

        response = session.post(summary_url, json=input_json, headers=headers)
        summary = response.text

        repository.save(path, summary)
        pipeline_item.summary = summary

        return pipeline_item
