'''Module to store data in the Page table of the BraidApis '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import logging
import datetime
import requests
from urllib.parse import quote
from requests.adapters import HTTPAdapter, Retry
import zlib
import base64

from .page_repository_api_types import IStoredPage

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

waterfall_application_name = 'Waterfall'
boxer_application_name = 'Boxer'
chunk_class_name = 'Chunk'
chunk_schema_version = '1'


class PageRepository:
    '''
    Class providing save & load for Pages in the Braid Cosmos database.
    '''

    def __init__(self):

        self.session = requests.Session()
        retries = Retry(total=5, backoff_factor=1,
                        status_forcelist=[500, 502, 503, 504])
        self.session.mount('https://', HTTPAdapter(max_retries=retries))

    def save(self, page: IStoredPage) -> bool:
        '''
        Save the provided item to the database.

        Parameters:
           page (IStoredPage): The content to be saved.
        '''
        logger.debug('Saving: %s', page.id)

        utc_time = datetime.datetime.now(datetime.timezone.utc)
        utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')

        page.amended = utc_time_string

        # page_url = f'https://braid-api.azurewebsites.net/api/SavePage?session={
        page_url = f'http://localhost:7071/api/SavePage?session={
            SESSION_KEY}'
        json_input = {
            'request': page.__dict__
        }

        response = self.session.post(
            page_url, json=json_input, headers=headers)

        if response.status_code == 200:
            logger.debug('Saved: %s', page.id)
            return True

        logger.debug('failed save: %s', page.id)
        return False

    def load(self, record_id: str) -> str:
        '''
        Load content from the database based on the provided key.
        If the file exists in the output location, its contents are read and returned as a string.
        If the record is not found, return None

        Parameters:
           record_id (str): key to use for the record

        Returns:
           str - HTML for the page or None
        '''

        logger.debug('Finding: %s', record_id)

        # page_url = f'https://braid-api.azurewebsites.net/api/GetPage?session={
        page_url = f'http://localhost:7071/api/GetPage?session={
            SESSION_KEY}&id={record_id}'

        response = self.session.post(
            page_url, headers=headers)

        if response.status_code == 200:
            return response.text

        logger.debug('Failed to load: %s', record_id)
        return None

###
# https://stackoverflow.com/questions/46351275/using-pako-deflate-with-python
###


def js_string_to_byte(data: str) -> bytes:
    return bytes(data, 'iso-8859-1')


def js_encode_uri_component(data: str) -> str:
    return quote(data, safe='~()*!.\'')


def pako_deflate(data: str) -> str:
    compress = zlib.compressobj(zlib.Z_DEFAULT_COMPRESSION, zlib.DEFLATED, 15,
                                memLevel=8, strategy=zlib.Z_DEFAULT_STRATEGY)
    compressed_data = compress.compress(
        js_string_to_byte(js_encode_uri_component(data)))
    compressed_data += compress.flush()
    return compressed_data


def compress_string(string: str) -> str:
    """Compress a string using deflate and encode in Base64"""
    compressed = pako_deflate(string)
    return base64.b64encode(compressed).decode('utf-8')
