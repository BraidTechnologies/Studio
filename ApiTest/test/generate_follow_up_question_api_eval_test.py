import os
import pytest
import requests
from CommonPy.src.enriched_query_api_types import IGenerateQuestionRequest, IQuestionGenerationResponse
from CommonPy.src.type_utilities import safe_dict_to_object
from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /GenerateQuestion endpoint
GENERATE_FOLLOWUP_QUESTION_API_URL = f'{BASE_URL}/GenerateQuestion?session=' + SESSION_KEY

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

def suggest_content(request: IGenerateQuestionRequest):
    wrapped = {
        'request': request.__dict__
    }

    # send the request to the API
    response = requests.post(GENERATE_FOLLOWUP_QUESTION_API_URL, json=wrapped, headers=headers, timeout=request_timeout)

    # Check for successful response
    assert response.status_code == 200, f'Unexpected status code: {
        response.status_code}'
    
    return safe_dict_to_object (response.json(), IQuestionGenerationResponse)

@pytest.fixture
def suggest_content_fixture():
    return suggest_content

# pylint: disable=redefined-outer-name
def test_generate_follow_up_suggestions_simple_summary(suggest_content_fixture):
    '''
    Scenario: Generate follow-up suggestions from a simple summary of how LLMs work
    '''
    request = IGenerateQuestionRequest()
    request.summary='A large language model (LLM) is an AI system that uses deep learning techniques to understand and generate human-like text based on the input it receives.'
    request.wordTarget=50

    response: IQuestionGenerationResponse = suggest_content_fixture(request)
    assert response.question, 'The response should contain a follow-up question.'
    assert 'LLM' in response.question, 'The question should be related to LLMs.'

# pylint: disable=redefined-outer-name
def test_generate_follow_up_suggestions_slightly_varied_summary(suggest_content_fixture):
    '''
    Scenario: Generate follow-up suggestions from a slightly varied summary of how LLMs work
    '''
    request = IGenerateQuestionRequest()
    request.summary = 'LLMs are AI models utilizing deep learning to comprehend and produce text similar to human language based on given inputs.'
    request.wordTarget=50

    response: IQuestionGenerationResponse = suggest_content_fixture(request)
    assert response.question, 'The response should contain a follow-up question.'
    assert 'LLM' in response.question, 'The question should be related to LLMs.'

# pylint: disable=redefined-outer-name
def test_generate_follow_up_suggestions_significantly_varied_summary(suggest_content_fixture):
    '''
    Scenario: Generate follow-up suggestions from a significantly varied summary on a different topic
    '''
    request = IGenerateQuestionRequest()
    request.summary='An article about climate change discusses the impact of rising temperatures on global ecosystems and human societies.'
    request.wordTarget=50

    response: IQuestionGenerationResponse = suggest_content_fixture(request)
    assert response.question, 'The response should contain a follow-up question.'
    assert 'climate change' in response.question.lower() or 'global warming' in response.question.lower(), 'The question should be related to climate change.'
