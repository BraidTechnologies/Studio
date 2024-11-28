'''
Test module for the classification API endpoint.

This module contains test cases for the /classify endpoint, including:
- Successful classification requests with valid data
- Error handling for invalid classification requests
- Validation of response format and content

The tests require a valid session key in the environment variables
and a running API server at the configured BASE_URL.
'''

import pytest
import requests
import os

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['SessionKey']

# Sample data based on the definitions
classify_request_data = {
    'text': 'Great, fabulous, magnificent, awesome, brilliant, great, love it, smashed it',
    'classifications': ['Positive', 'Negative', 'Neutral']
}

response_data = {
    'classification': 'Positive'
}

# Construct the full URL to the /classify endpoint
classify_url = f'{BASE_URL}/classify?session=' + SESSION_KEY

def test_classification_request():
    '''Test sending a classification request to the API.'''
    wrapped = {
        'request' : classify_request_data
    }
    response = requests.post(classify_url, json=wrapped, timeout=10)
    assert response.status_code == 200
    response_json = response.json()
    assert 'classification' in response_json
    assert response_json['classification'] in classify_request_data['classifications']

@pytest.mark.parametrize('invalid_data', [
    {'text': 'Example', 'classifications': None},  # Missing classifications
    {'text': '', 'classifications': ['Positive']},  # Empty text
    {'classifications': ['Positive', 'Negative']},  # Missing text
    {'text': 'Example text', 'classifications': []}  # Empty classifications
])
def test_invalid_classification_request(invalid_data):
    '''Test classification requests with invalid data.'''
    wrapped = {
        'request' : invalid_data
    }
    response = requests.post(classify_url, json=wrapped, timeout=10)
    assert response.status_code == 400  # Assuming the API returns 400 for bad requests

if __name__ == '__main__':
    pytest.main()
    