
"""
Test suite for the prompt management. We test each prompt with a basic functional call once. 
"""

import os
import copy
import requests

from CommonPy.src.request_utilities import request_timeout
from CommonPy.src.enriched_query_api import EnrichedQueryApi

from .enriched_query_util import valid_request_payload

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
SUMMARISE_API_ENDPOINT = f'{BASE_URL}/summarize?session=' + SESSION_KEY

def test_developer_assistant():
    '''Test basic query'''

    enriched_query_api = EnrichedQueryApi()
    valid_request = copy.deepcopy(valid_request_payload())
    valid_request.question = "What does the acronym LLM stand for?"
    enriched_response = enriched_query_api.enriched_query(valid_request)

    assert enriched_response.answer.lower().find('large language model') != -1

def test_article_summariser():
    '''Test basic summarization with a simple sports event description'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': 'The Lakers defeated the Warriors 120-110 in a regular season NBA game. LeBron James scored 30 points.',
        'lengthInWords': 3
    }}

    response = requests.post(SUMMARISE_API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result
    assert result['summary'].find('Lakers defeated Warriors') != -1 or result['summary'].find('Lakers beat Warriors') != -1, \
        f"Expected 'Lakers defeated/beat Warriors' but got: {result['summary']}"
    
 