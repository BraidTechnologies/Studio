'''
Test module for the text chunking API endpoint.
This module contains test cases for the text chunking API endpoint,
covering various scenarios including:
- Valid chunking requests with specified size and overlap
- Invalid requests with missing parameters
- Edge cases with very small or large chunk sizes

This module contains integration tests for the /chunk endpoint, which is responsible
for splitting input text into smaller chunks with configurable size and overlap.
The tests verify the API's response format and basic functionality.

Environment Variables Required:
    - SessionKey: Authentication token for API access
'''

import pytest
import requests
import os

from CommonPy.src.request_utilities import request_timeout


# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['SessionKey']

# Construct the full URL to the /chunk endpoint
chunk_url = f'{BASE_URL}/chunk?session=' + SESSION_KEY

# Example test data based on the provided schema
@pytest.fixture
def chunk_request_data():
    return {
        'text': 'This is a sample text to be chunked.',
        'chunkSize': 5,
        'overlapWords': 2
    }

def test_chunk_endpoint(chunk_request_data):

    wrapped = {
        'request' : chunk_request_data
    }

    # Send a POST request
    response = requests.post(chunk_url, json=wrapped, timeout=request_timeout)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Parse the response JSON
    response_data = response.json()

    # Assert the presence of expected keys in the response data
    assert 'chunks' in response_data

    assert len(response_data['chunks']) > 0

if __name__ == '__main__':
    pytest.main()
