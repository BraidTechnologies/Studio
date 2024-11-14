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


class SummariseFailSuppressor (PipelineStep):
    '''PipelineStep to create a summary for a text string'''

    # pylint: disable-next=useless-parent-delegation
    def __init__(self, output_location: str):
        '''
        Initializes the SummariseFailSuppressor object with the provided output location.
        '''
        super(SummariseFailSuppressor, self).__init__(output_location)

    def should_suppress(self, pipeline_item: PipelineItem) -> PipelineItem:
        '''
        Checks if the given PipelineItem should be suppressed based on evaluation criteria.

        Args:
          pipeline_item (PipelineItem): The PipelineItem to evaluate for suppression.

        Returns:
          PipelineItem: The PipelineItem if suppression is not needed, otherwise None.
        '''

        logger.debug('Evaluation for suppression: %s', pipeline_item.path)

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        summary_url = f'https://braid-api.azurewebsites.net/api/SuppressSummariseFail?session={
            SESSION_KEY}'
        input_json = {
            'request': {
                'text': pipeline_item.summary
            }
        }

        response = session.post(summary_url, json=input_json, headers=headers)
        keep: bool = True  # If there is an error in the API, we default to 'keep'
        if response.status_code == 200:
            response_json = json.loads(response.text)
            keep = response_json['isValidSummary'] == 'Yes'

        if keep:
            return pipeline_item
