''' first step of Waterfall pipeline - search web and generate input list of PipelineItems'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import requests

from src.workflow import PipelineItem, WebSearchPipelineSpec

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.WARNING)

# get the API KEY here: https://developers.google.com/custom-search/v1/overview
GOOGLE_DEVELOPER_API_KEY = os.environ['GOOGLE_DEVELOPER_API_KEY']

# get your Search Engine ID on your CSE control panel
# https://programmablesearchengine.google.com/controlpanel/all
AI_SUPPLY_STACK_SEARCH_ENGINE_ID = '00d305498d8da42e1'
AI_DEMAND_STACK_SEARCH_ENGINE_ID = '22fafd262192b4c06'
AI_TELECOM_SEARCH_ENGINE_ID = '7789e6bd5a1d54069'
AI_NATIONWIDE_SEARCH_ENGINE_ID= '3498036ca64b54980'
AI_BNY_SEARCH_ENGINE_ID= 'a4521230dc31a4716'
AI_VODAFONE_SEARCH_ENGINE_ID= '1482b42ca30924b1c'

class WebSearcher:
    '''
    Searches for links related to a specific query using the Google Custom Search Engine API.
    Returns a list of URLs extracted from the search results.
    '''

    def __init__(self, output_location: str):
        self.output_location = output_location
        return

    def search(self, pipeline: WebSearchPipelineSpec) -> list[PipelineItem]:
        '''
        Searches for links related to a specific query using the Google Custom Search Engine API.
        Returns a list of URLs extracted from the search results.
        '''
        # See this link for details of what we are doing here
        # https://thepythoncode.com/article/use-google-custom-search-engine-api-in-python?utm_content=cmp-true

        pipeline_items = []

        # the search query you want
        query = 'Generative AI'
        if pipeline.query_additions:
            query += ' ' + pipeline.query_additions

        # Pull back 1- pages of results (100 items ...)
        for page in range(1, pipeline.pages + 1):
            # constructing the URL
            # doc: https://developers.google.com/custom-search/v1/using_rest
            # calculating start, (page=2) => (start=11), (page=3) => (start=21)
            start = (page - 1) * 10 + 1
            url = f'https://www.googleapis.com/customsearch/v1?key={GOOGLE_DEVELOPER_API_KEY}&cx={
                pipeline.search_key}&q={query}&start={start}&dateRestrict=m[1]'

            # make the API request
            data = requests.get(url, timeout=20).json()

            # get the result items
            search_items = data.get('items')

            # iterate over the results
            if search_items is not None:
                for search_item in search_items:
                    # extract the page url
                    link = search_item.get('link')
                    pipeline_item = PipelineItem()
                    pipeline_item.path = link
                    pipeline_items.append(pipeline_item)
            else:
                break

        return pipeline_items
