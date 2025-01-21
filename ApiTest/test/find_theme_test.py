"""
Test module for the /findtheme API endpoint.

This module contains test cases to verify the functionality of the theme finding API,
including validation of request parameters and response formats. Tests cover both
valid requests and error scenarios for missing required fields.

Endpoints tested:
    - POST /findtheme: Analyzes text to identify themes
"""

import pytest
import requests
import os

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
find_theme_url = f"{BASE_URL}/findtheme?session=" + SESSION_KEY

@pytest.fixture
def valid_request_data():
    return {
        "text": "Sample text input about magazines, books, literature, moves, films, records, CDs, vinyl, newspapers.",
        "length": 123
    }

def test_find_theme_with_valid_request(valid_request_data):
    wrapped = {
        'request' : valid_request_data
    }
    response = requests.post(find_theme_url, json=wrapped, timeout=request_timeout)
    assert response.status_code == 200, "Expected status code 200 for a valid request"
    data = response.json()
    assert "theme" in data, "Response should contain 'theme'"

def test_find_theme_with_missing_text():
    request_data = {
        "length": 123
    }
    wrapped = {
        'request' : request_data
    }
    response = requests.post(find_theme_url, json=wrapped, timeout=request_timeout)
    assert response.status_code == 400, "Expected status code 400 for missing 'text'"

def test_find_theme_with_missing_length():
    request_data = {
        "text": "Sample text input"
    }
    wrapped = {
        'request' : request_data
    }
    response = requests.post(find_theme_url, json=wrapped, timeout=request_timeout)
    assert response.status_code == 400, "Expected status code 400 for missing 'length'"    

if __name__ == "__main__":
    pytest.main()