'''
Test module for the theme finding API endpoint.
This module contains test cases for the theme finding API endpoint,
covering various scenarios including:
- Basic theme detection for basketball content
- Theme consistency with similar descriptions 
- Theme differentiation between sports

This module contains integration tests for the /findtheme endpoint, which is responsible
for identifying the main theme of input text. The tests verify the API's ability to
correctly identify sports themes and maintain consistent theme detection for similar content.

Environment Variables Required:
    - BRAID_SESSION_KEY: Authentication token for API access
'''


import os
import pytest
import requests  # assuming the API is accessed via HTTP

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
API_ENDPOINT = f'{BASE_URL}/findtheme?session=' + SESSION_KEY


def test_basic_basketball_theme():
    '''Test basic basketball description returns basketball theme'''
    request_data = {'request': {
        'text': 'The player dribbled down the court and scored a basket from inside the three point line',
        'length': 1
    }}

    response = requests.post(
        API_ENDPOINT, json=request_data, timeout=request_timeout)
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['theme'].lower().find('basketball') != -1


def test_alternative_basketball_description():
    '''Test different basketball description returns same basketball theme'''
    request_data = {'request': {
        'text': 'The player dribbled down the court but missed the basket from inside the three point line',
        'length': 1
    }}

    response = requests.post(
        API_ENDPOINT, json=request_data, timeout=request_timeout)
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['theme'].lower().find('basketball') != -1


def test_football_different_theme():
    '''Test football description returns different theme'''
    request_data = {'request': {
        'text': 'The quarterback threw a perfect touchdown pass to the receiver',
        'length': 1
    }}

    response = requests.post(
        API_ENDPOINT, json=request_data, timeout=request_timeout)
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['theme'].lower().find('football') != -1
