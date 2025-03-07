'''
Test module for the text classification API endpoint.
This module contains test cases for the text classification API endpoint,
covering various scenarios including:
- Basic classification of sports-related text
- Classification consistency with similar phrasings
- Differentiation between similar sports contexts

This module contains integration tests for the /classify endpoint, which is responsible
for categorizing input text into predefined classifications. The tests verify the 
API's ability to correctly classify sports-related text and maintain consistent 
classifications for similar content.

Environment Variables Required:
    - BRAID_SESSION_KEY: Authentication token for API access
'''

from CommonPy.src.request_utilities import request_timeout
import os
import pytest
import requests
from src.test_utils import simple_test, mutation_test, system_test
from CommonPy.src.generated_prompt_names import article_classifier_prompt_id

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
API_ENDPOINT = f'{BASE_URL}/classify?session=' + SESSION_KEY

@simple_test(
    test_id="classify_001",
    name="Basic Basketball Classification",
    description="Test basic basketball-related text classification",
    prompt_id=article_classifier_prompt_id  # article-classifier prompt
)
def test_basic_basketball_classification():
    request_data = {'request': {
        'text': 'Shooting hoops at the basketball court',
        'classifications': ['basketball', 'soccer', 'tennis']
    }}

    response = requests.post(API_ENDPOINT, json=request_data, timeout=request_timeout)
    assert response.status_code == 200

    result = response.json()
    assert result['classification'] == 'basketball'


@mutation_test(
    test_id="classify_002",
    name="Similar Basketball Classification",
    description="Test similar basketball text with different wording should yield same classification",
    prompt_id=article_classifier_prompt_id  # article-classifier prompt
)
def test_similar_basketball_classification():
    request_data = {'request': {
        'text': 'Shooting hoops at the gym',
        'classifications': ['basketball', 'soccer', 'tennis']
    }}

    response = requests.post(
        API_ENDPOINT, json=request_data, timeout=request_timeout)
    assert response.status_code == 200

    result = response.json()
    assert result['classification'] == 'basketball'


@system_test(
    test_id="classify_003",
    name="Different Sport Classification",
    description="Test different sport text should yield different classification",
    prompt_id=article_classifier_prompt_id  # article-classifier prompt
)
def test_different_sport_classification():
    request_data = {'request': {
        'text': 'Practicing free serves on the court',
        'classifications': ['basketball', 'soccer', 'tennis']
    }}

    response = requests.post(
        API_ENDPOINT, json=request_data, timeout=request_timeout)
    assert response.status_code == 200

    result = response.json()
    assert result['classification'] == 'tennis'
