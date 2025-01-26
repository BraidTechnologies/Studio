"""
Test the summarise filter
"""

import os
import requests
import pytest

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
SUMMARISE_API_ENDPOINT = f'{BASE_URL}/summarize?session=' + SESSION_KEY
TEST_SUMMARISE_FAIL_API_ENDPOINT = f'{BASE_URL}/TestForSummariseFail?session=' + SESSION_KEY


def test_basic_summary():
    '''Test basic summarization with a simple sports event description'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': '<body><p>In a tough game, the Lakers defeated the Warriors 120-110 in a regular season NBA game.</p><p>LeBron James scored 30 points.</p></body>',
        'lengthInWords': 3
    }}

    response = requests.post(SUMMARISE_API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result
    assert result['summary'].find('Lakers defeated Warriors') != - \
        1 or result['summary'].find('Lakers beat Warriers') != -1


def test_different_summary():
    '''Test that different wording of the same event produces similar summary'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': '<body><p>In a tough game, the Lakers defeated the Warriors 120-110 in a regular season NBA game.</p><p>LeBron James scored 10 points.</p></body>',
        'lengthInWords': 3
    }}

    response = requests.post(SUMMARISE_API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result
    assert result['summary'].find('Lakers defeated Warriors') != - \
        1 or result['summary'].find('Lakers beat Warriers') != -1


def test_different_game_different_summary():
    '''Test that a no input produces a failed summary, and that we can detect the failure'''
    request_data = {'request': {
        'persona': 'ArticleSummariser',
        'text': '<body><a></a><a></a><a></a><a></a><a></a><a></a><a></a><p></p><p></p><p></p><p></p><p></p><p></p><p></p>  <p></p><p></p><p></p></body>',
        'lengthInWords': 3
    }}

    response = requests.post(SUMMARISE_API_ENDPOINT, json=request_data, timeout=request_timeout)
    result = response.json()

    assert response.status_code == 200
    assert 'summary' in result

    request_data_2 = {'request': {
        'persona': 'ArticleSummariser',
        'text': result['summary']
    }}

    response = requests.post(TEST_SUMMARISE_FAIL_API_ENDPOINT, json=request_data_2, timeout=request_timeout)
    result = response.text

    assert result.lower().find('failed') != -1
