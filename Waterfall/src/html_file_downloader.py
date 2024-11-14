'''PipelineStep to download thw text of a web page '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from selenium import webdriver
from bs4 import BeautifulSoup

from src.workflow import PipelineItem, PipelineStep
from src.text_repository_facade import TextRespositoryFacade

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
    'Accept-Encoding': 'none',
    'Accept-Language': 'en-US,en;q=0.8',
    'Connection': 'keep-alive'
}


class HtmlFileDownloader (PipelineStep):
    '''Utility class to download an HTML file

     Args:
         output_location (str): The location to save the downloaded file.
    '''

    # pylint: disable-next=useless-parent-delegation
    def __init__(self, output_location: str):
        '''
        Initializes the HtmlFileDownloader object with the provided output location.
        '''
        super(HtmlFileDownloader, self).__init__(output_location)

    def download(self, pipeline_item: PipelineItem) -> PipelineItem:
        '''
         Downloads the HTML content from the specified path and saves it to the output location.

         Returns:
             PipelineItem: Enriched with the content of the downloaded HTML file.
        '''

        path = pipeline_item.path
        repository = TextRespositoryFacade(self.output_location)
        if path is not None and repository.exists(path):
            full_text = repository.load(path)
            pipeline_item.text = full_text
            return pipeline_item

        logger.debug('Downloading: %s', path)

        if path.find('http') != -1:
            # These lines left from version using session library
            # Switched to webdriver as it has fewer failures to parse
            # Add headers in case the website expects cookies and/or JavaScript
            # session = requests.Session()
            # html_content = session.get(path, headers=headers).text
            driver = webdriver.Chrome()
            driver.get(path)
            html_content = driver.page_source
        else:
            with open(path, 'r', encoding='utf-8') as file:
                html_content = file.read()

        soup = BeautifulSoup(html_content, 'html.parser')
        full_text = soup.get_text()

        repository.save(path, full_text)

        pipeline_item.text = full_text

        return pipeline_item
