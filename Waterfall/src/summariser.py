'''PipelineStep to create a summary for a text string'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json
import requests
from requests.adapters import HTTPAdapter, Retry


from src.workflow import PipelineItem, PipelineStep
from src.summary_repository_facade import SummaryRespositoryFacade

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


class Summariser (PipelineStep):
    '''PipelineStep to create a summary for a text string'''

    # pylint: disable-next=useless-parent-delegation
    def __init__(self, output_location: str):
        '''
        Initializes the Summariser object with the provided output location.
        '''
        # pylint: disable-next=useless-parent-delegation         
        super(Summariser, self).__init__(output_location)

    def summarise(self, pipeline_item: PipelineItem) -> PipelineItem:
        '''
        Summarises the text content by either loading an existing summary from the specified path or generating a new summary using an external API. 
        If an existing summary is found, it is returned; otherwise, a new summary is generated and saved at the specified path. 
        Returns the generated or loaded summary as an enriched PipelineItem.
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
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        print("Summarising: " + pipeline_item.path)

        #summary_url = f'http://localhost:7071/api/Summarize?session={
        summary_url = f'https://braid-api.azurewebsites.net/api/Summarize?session={
            SESSION_KEY}'
        input_json = {
            'request': {
                'text': pipeline_item.text,
                'lengthInWords': 50
            }
        }

        response = session.post(summary_url, json=input_json, headers=headers)

        if (response.status_code == 200):
            response_json = json.loads(response.text)
            summary = response_json['summary']

            repository.save(path, summary)
            pipeline_item.summary = summary

            return pipeline_item
        else:
            logger.error("Unable to summarise item: %s", pipeline_item.path)
            return None
