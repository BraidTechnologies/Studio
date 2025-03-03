"""Test suite for the summarization API endpoint.

This module contains integration tests that verify the behavior of the /summarize endpoint,
focusing on sports event summarization capabilities. Tests check for consistency, accuracy,
and appropriate handling of different input variations.
"""

import os
import requests
import pytest

from CommonPy.src.request_utilities import request_timeout
from src.test_utils import simple_test, mutation_test, system_test
from CommonPy.src.generated_prompt_names import article_summariser_prompt_id
# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
API_ENDPOINT = f'{BASE_URL}/summarize?session=' + SESSION_KEY


@simple_test(
    test_id="summarise_001",
    name="Basic Sports Summary Test",
    description="Test basic summarization with a simple sports event description",
    prompt_id=article_summariser_prompt_id  # article-summariser prompt
)
def test_basic_sports_summary():
    '''Test basic summarization with a simple sports event description'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': 'The Lakers defeated the Warriors 120-110 in a regular season NBA game. LeBron James scored 30 points.',
        'lengthInWords': 3
    }}

    response = requests.post(API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result
    assert result['summary'].find('Lakers defeated Warriors') != - \
        1 or result['summary'].find('Lakers beat Warriors') != -1


@mutation_test(
    test_id="summarise_002",
    name="Same Game Different Wording Test",
    description="Test that different wording of the same event produces similar summary",
    prompt_id=article_summariser_prompt_id  # article-summariser prompt
)
def test_same_game_different_wording():
    '''Test that different wording of the same event produces similar summary'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': 'The Lakers defeated the Warriors 120-110 in a regular season NBA game. LeBron James scored 10 points.',
        'lengthInWords': 3
    }}

    response = requests.post(API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result
    assert result['summary'].find('Lakers defeated Warriors') != - \
        1 or result['summary'].find('Lakers beat Warriors') != -1


@system_test(
    test_id="summarise_003",
    name="Different Game Summary Test",
    description="Test that a different game produces a different summary",
    prompt_id=article_summariser_prompt_id  # article-summariser prompt
)
def test_different_game_different_summary():
    '''Test that a different game produces a different summary'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': 'The Warriors defeated the Lakers 120-110 in a regular season NBA game. LeBron James scored 0 points.',
        'lengthInWords': 3
    }}

    response = requests.post(API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result
    assert result['summary'].find('Warriors defeated Lakers') != - \
        1 or result['summary'].find('Warriors beat Lakers') != -1
