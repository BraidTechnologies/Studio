'''
Test the generate_follow_up_question API
@link https://github.com/BraidTechnologies/Studio/blob/develop/bdd/Boxer-002-Suggest-related-content.feature.md
'''

import pytest

from CommonPy.src.enriched_query_api import EnrichedQueryApi
from CommonPy.src.enriched_query_api_types import IGenerateQuestionRequest, IQuestionGenerationResponse

def suggest_content(request: IGenerateQuestionRequest) -> IQuestionGenerationResponse:
    enriched_query_api = EnrichedQueryApi()
    return enriched_query_api.generate_question(request)

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
