'''
Test module for the summarization API endpoint.

This module contains test cases for the text summarization API endpoint,
covering various scenarios including:
- Valid summarization requests with specified length
- Requests without length specification
- Invalid requests with missing text
- Empty requests

The tests verify both successful responses and proper error handling.
'''

import pytest
import requests
import os

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['SessionKey']


def summarise_endpoint_url():
    # Construct the full URL for the summary endpoint
    return f'{BASE_URL}/Summarize?session=' + SESSION_KEY


def test_valid_summarise_request():
    # Test case for a valid summarization request
    payload = {
        'text': 'This is a text that needs to be summarized and in order for this to work it needs to be over the minumum text length.',
        'lengthInWords': 10
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(), json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    data = response.json()
    assert 'summary' in data
    assert isinstance(data['summary'], str)
    # Further checks can be added based on expected summary content


def test_summarise_request_without_length():
    # Test case with the text but no lengthInWords
    payload = {
        'text': 'This text needs summarization but without specifying the length.'
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(),
                             json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    data = response.json()
    assert 'summary' in data
    assert isinstance(data['summary'], str)


def test_summarise_request_missing_text():
    # This should fail because 'text' is a required field
    payload = {
        'lengthInWords': 10
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(),
                             json=wrapped, timeout=request_timeout)
    assert response.status_code == 400  # Assuming the API returns a 400 Bad Request
    # Additional logic to verify error message can be added here


def test_empty_summarise_request():
    # Test case with an empty payload
    payload = {}
    response = requests.post(summarise_endpoint_url(),
                             json=payload, timeout=request_timeout)
    assert response.status_code == 500  # Empty request should fail


if __name__ == '__main__':
    pytest.main()
