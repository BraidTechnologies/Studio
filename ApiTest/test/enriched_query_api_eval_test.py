'''
Test module for the enriched query API endpoint.

This module contains a suite of test cases for the `/queryModelWithEnrichment` endpoint, 
which processes enriched search queries within the context of a specific repository. 
The tests are designed to ensure the endpoint functions correctly under various conditions and inputs. The key areas covered include:

- **Valid Requests**: 
    - Verifying that requests with all required parameters return successful responses.
    - Ensuring the returned data structures match the expected format and content.

- **Invalid Requests**: 
    - Assessing the endpoint's response to missing or incorrect parameters.
    - Checking for appropriate error messages and status codes when encountering malformed inputs.
  
- **Simple Evals**:
    - Confirming that the API works for queries with a set of sample questions and template answers
  
The objective of this module is to evaluate the accuracy of the enriched query API, ensuring it meets the expected standards.

@link https://github.com/BraidTechnologies/Studio/blob/develop/bdd/Boxer-001-Question-with-0-many-related-documents.feature.md
@link https://github.com/BraidTechnologies/Studio/blob/develop/bdd/Boxer-003-Ingest-youtube-and-html.feature.md

'''

# pylint: disable=inconsistent-quotes

import os
import copy
import pytest
import requests

from CommonPy.src.enriched_query_api_types import IEnrichedQueryRequest, IEnrichedResponse
from CommonPy.src.enriched_query_api import EnrichedQueryApi
from CommonPy.src.cosine_similarity import cosine_similarity

from CommonPy.src.embed_api import EmbeddingApi
from CommonPy.src.embed_api_types import IEmbedRequest, IEmbedResponse

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /chunk endpoint
EMBED_URL = f'{BASE_URL}/embed?session=' + SESSION_KEY

PAGE_SUMMARY = 'The State of Open Source AI Book discusses the role of hardware in machine learning, specifically GPUs. GPUs are well-suited for AI computations due to their parallelization capabilities and specialized hardware for deep learning operations.'
VIDEO_SUMMARY = 'The video discusses the patterns for augmenting language models with external context, including retrieval augmentation, chaining, and tool use. It explores the limitations of language models and the need for additional data and tools to enhance their performance. The video provides an overview of information retrieval techniques and explains how to make the most of the limited context window of language models.'
 

def embed_text(text_to_embed: str) -> list[float]:

    embed_api = EmbeddingApi()
    embed_request = IEmbedRequest()
    embed_request.text = text_to_embed
    embed_response : IEmbedResponse = embed_api.embed(embed_request)

    # Check if embedding is a list
    return embed_response.embedding


SAMPLE_RESPONSE = (
    "LLMs use deep learning to generate human-like text. They are trained on vast "
    "amounts of text data. When given a prompt, they predict the next word based "
    "on patterns learned during training. This process repeats to generate "
    "coherent and contextually relevant text."
)

SAMPLE_YOUTUBE_RESPONSE = (
   "Welcome to CS25s introductory lecture on Transformers, a course created and taught at Stanford "
   "in Fall 2021. This course focuses on deep learning models known as transformers, which have "
   "revolutionized fields such as NLP, computer vision, and reinforcement learning. The lecture "
   "introduces the instructors and covers the basics of transformer architecture, including "
   "self-attention mechanisms, encoder-decoder structure, and their advantages and drawbacks."
)

sampleqas = [
    {'q': "How do I integrate an LLM into my Python application?",
     'a': "Use APIs like OpenAI's `openai` Python library or Hugging Face's `transformers`. "
          "Install the library, authenticate, and call the model using provided methods. "
          "Ensure you preprocess input and postprocess outputs for your application's context, "
          "like formatting responses or handling incomplete answers."
     },
    {'q': "How can I fine-tune an LLM for my specific use case?",
     'a': "Fine-tune using frameworks like Hugging Face. Prepare domain-specific data in a proper "
          "format (e.g., text files or JSON). Use transfer learning to update the model weights "
          "without training from scratch. For larger models, leverage pre-trained checkpoints and "
          "cloud resources to minimize time and cost."
     },
    {'q': "How do I handle LLM input token limitations?",
     'a': "Token limits vary per model. Truncate or summarize inputs exceeding limits, or divide "
          "the input into chunks and process sequentially. Use tools like `tiktoken` to estimate "
          "token counts before submission to avoid errors and ensure complete processing."
     },
    {'q': "How do I optimize LLM API calls for cost and performance?",
     'a': "Minimize input size by sending only relevant text. Use smaller models when feasible. "
          "Cache responses for repeated queries and consider batching requests where supported. "
          "Monitor usage and adapt model configurations to balance cost and performance."
     },
    {'q': "How do I ensure data privacy when using an LLM?",
     'a': "Avoid sending sensitive data to external APIs unless securely encrypted and anonymized. "
          "For critical applications, consider deploying self-hosted LLMs using frameworks like "
          "Hugging Face or OpenLLM to keep data within your control."
     },
    {'q': "How do I manage the unpredictability of LLM responses?",
     'a': "Implement response validation. Use prompt engineering to guide model behavior and reduce "
          "randomness with parameters like `temperature`. For structured outputs, provide clear "
          "instructions in the prompt, such as 'Respond in JSON format.'"
     },
    {'q': "How do I handle multi-turn conversations in Python applications?",
     'a': "Maintain context by appending previous conversation turns to the prompt. Ensure the "
          "context does not exceed token limits. Tools like OpenAI's `ChatCompletion` API and "
          "conversational transformers are optimized for such scenarios."
     },
    {'q': "How do I choose the right LLM for my application?",
     'a': "Evaluate models based on requirements like accuracy, cost, latency, and token limits. "
          "General-purpose models like GPT-4 are versatile, while domain-specific models (e.g., "
          "legal, medical) may provide better performance for specialized tasks."
     },
    {'q': "How can I deploy an LLM at scale?",
     'a': "Use containerization tools like Docker for packaging and orchestration platforms like "
          "Kubernetes to scale. Cloud providers offer LLM-hosting services for scalable deployments. "
          "Optimize latency by using edge deployments or regional hosting for geographically "
          "distributed applications."
     }]


def valid_request_payload():
    '''
    Return a valid request payload. This function is used by both fixtures and test functions.
    '''
    shell = IEnrichedQueryRequest()
    shell.repositoryId = "Boxer"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell


def invalid_request_payload():
    '''
    Return an invalid request payload. This function is used by both fixtures and test functions.
    '''
    shell = IEnrichedQueryRequest()
    shell.repositoryId = "this_wont_work"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell


@pytest.fixture
def valid_request_payload_fixture():
    '''
    Return a valid request payload
    '''
    return valid_request_payload()


@pytest.fixture
def invalid_request_payload_fixture():
    '''
    Return an invalid request payload
    '''
    return invalid_request_payload()


# pylint: disable=redefined-outer-name
def test_enriched_query_invalid_payload(invalid_request_payload_fixture: IEnrichedQueryRequest) -> IEnrichedResponse:
    '''
    Test the enriched query API with an invalid payload.
    '''
    enriched_response = None

    try:
        enriched_query_api = EnrichedQueryApi()
        enriched_response = enriched_query_api.enriched_query(invalid_request_payload_fixture)
        assert False, "Should not parse invalid response"
    except RuntimeError:
        assert True, "Correctly detected invalid response"
   
    return enriched_response


@pytest.mark.skip(reason='Helper function, not a test')
def test_enriched_query_success(payload: IEnrichedQueryRequest, 
                                expected_chunks: int, 
                                expected_embedding: list[float], 
                                threshold: float, 
                                is_youtube: bool = False,
                                dont_care = True):
    '''
    Test the enriched query API with a successful response.
    Makes a request to the API and checks the response, including checking cosine similarity against a target response,
    then enumerating relevant chunks and also testing their cosine similarity
    '''
    has_youtube = False
    has_non_youtube = False

    try:
       enriched_query_api = EnrichedQueryApi()
       enriched_response = enriched_query_api.enriched_query(payload)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"API request failed: {e}")


    assert enriched_response.answer is not None, "Response JSON does not contain 'answer'"
    assert enriched_response.chunks is not None, "Response JSON does not contain 'chunks'"

    assert isinstance(enriched_response.answer,
                      str), "'answer' should be a string"
    assert isinstance(enriched_response.chunks,
                      list), "'chunks' should be a list"
    assert len(enriched_response.chunks) == expected_chunks, f"Expected {
        expected_chunks} chunks, got {len(enriched_response.chunks)}"

    if expected_chunks > 0 and expected_embedding is not None:
        embedded_answer = embed_text(enriched_response.answer)
        assert cosine_similarity(
            embedded_answer, expected_embedding) > threshold, "Answer is not similar to the expected response:" + enriched_response.answer

        for chunk in enriched_response.chunks:
            # pylint: disable=no-member
            embedded_chunk = embed_text(chunk.chunk.summary)
            if chunk.chunk.url.lower().find("youtube") != -1:
                has_youtube = True
            else:
                has_non_youtube = True
            assert cosine_similarity(
                embedded_chunk, expected_embedding) > threshold, "Chunk is not similar to the expected response:" + enriched_response.answer

    if not dont_care:
      if is_youtube:
        assert has_youtube, "Expected YouTube URL in the response"
      else:
        assert has_non_youtube, "Expected non-YouTube URL in the response"


def test_enriched_simple_function():
    '''
    Test the enriched query API with a simple function.
    '''
    try:
        embedded_target_response = embed_text(SAMPLE_RESPONSE)
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How does an LLM work?"
        test_enriched_query_success(valid_request, 1, embedded_target_response, 0.45)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test failed: {e}")


def test_enriched_simple_function_variant():
    '''
    Test the enriched query API with a simple function variant.
    '''
    try:
        embedded_target_response = embed_text(SAMPLE_RESPONSE)        
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How do LLMs work?"
        test_enriched_query_success(valid_request, 1, embedded_target_response, 0.45)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function positive variant test failed: {e}")


def test_enriched_simple_function_negative():
    '''
    Test the enriched query API with a simple function negative variant.
    '''
    try:
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How does a BLT work?"
        test_enriched_query_success(valid_request, 0, None, 0.45)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test negative variant failed: {e}")


def test_enriched_simple_function_list():
    '''
    Test the enriched query API with a list of primed questions and answers.
    '''

    for qa in sampleqas:
        try:
            valid_request = copy.deepcopy(valid_request_payload())
            valid_request.question = qa['q']
            embedded_answer = embed_text(qa['a'])
            test_enriched_query_success(valid_request, 1, embedded_answer, 0.35)
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Function from sample list failed: {e}")

def test_enriched_from_youtube():
    '''
    Test the enriched query API with a simple function where we specifically want a youtube URL
    '''
    try:
        embedded_target_response = embed_text(VIDEO_SUMMARY)
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.maxCount = 4
        valid_request.question = 'Please summarise the following text in 50 words: ' + VIDEO_SUMMARY

        test_enriched_query_success(valid_request, 4, embedded_target_response, 0.45, True, False)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Youtube test failed: {e}")

def test_enriched_from_html():
    '''
    Test the enriched query API with a simple function where we specifically want a non-youtube URL
    '''
    try:
        embedded_target_response = embed_text(PAGE_SUMMARY)
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.maxCount = 4
        valid_request.question = 'Please summarise the following text in 50 words: ' + PAGE_SUMMARY

        test_enriched_query_success(valid_request, 4, embedded_target_response, 0.45, False, False)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Html content test failed: {e}")

if __name__ == '__main__':
    pytest.main()
