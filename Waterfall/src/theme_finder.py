'''Class to create a theme for a number of input paragraphs of text'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests
import json
from requests.adapters import HTTPAdapter, Retry

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


class ThemeFinder:
    '''Class to create a theme for a number of input paragraphs of text'''

    def __init__(self):
        return

    def find_theme(self, text: str, length: int) -> str:

        session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[502, 503, 504])
        session.mount('https://', HTTPAdapter(max_retries=retries))

        summary_url = f'https://braidapi.azurewebsites.net/api/FindTheme?session={
            SESSION_KEY}'
        input_json = {
            'request': {
                'text': text,
                'length': length
            }
        }

        response = session.post(summary_url, json=input_json, headers=headers)
        if (response.status_code == 200):        
           response_json = json.loads (response.text)        
           theme = response_json['theme']

           return theme
        else:
            logger.error (f"Unable to find theme for: {text}.")
            return None