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
'''

# pylint: disable=inconsistent-quotes

import os
import copy
import pytest
import requests
from CommonPy.src.enriched_query_api_types import IEnrichedQueryRequest, IEnrichedChunk
from CommonPy.src.type_utilities import safe_dict_to_object
from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /queryModelWithEnrichment endpoint
API_URL = f'{BASE_URL}/queryModelWithEnrichment?session=' + SESSION_KEY

# Construct the full URL to the /chunk endpoint
EMBED_URL = f'{BASE_URL}/embed?session=' + SESSION_KEY


def embed_text(text_to_embed: str) -> list[float]:

    # Define a valid request payload according to the JSON schema
    valid_request = {
        'text': text_to_embed
    }

    wrapped = {
        'request': valid_request
    }

    # send the request to the API
    response = requests.post(EMBED_URL, json=wrapped, timeout=request_timeout)

    # Check for successful response
    assert response.status_code == 200, f'Unexpected status code: {
        response.status_code}'

    # Validate response structure
    response_data = response.json()

    # Check if embedding is a list
    return response_data.get('embedding')


def cosine_similarity(vector1: list[float], vector2: list[float]) -> float:
    '''
    Calculate the cosine similarity between two vectors.

    Parameters:
        vector1: First vector as list of floats
        vector2: Second vector as list of floats

    Returns:
        float: Cosine similarity between the vectors
    '''
    # Check if vectors have same length
    if len(vector1) != len(vector2):
        raise ValueError("Vectors must have the same length")

    # Calculate dot product
    dot_product = sum(a * b for a, b in zip(vector1, vector2))

    # Calculate magnitudes
    magnitude1 = sum(a * a for a in vector1) ** 0.5
    magnitude2 = sum(b * b for b in vector2) ** 0.5

    # Handle zero magnitude edge case
    if magnitude1 == 0 or magnitude2 == 0:
        return 0

    # Return cosine similarity
    return dot_product / (magnitude1 * magnitude2)


SAMPLE_RESPONSE = (
    "LLMs use deep learning to generate human-like text. They are trained on vast "
    "amounts of text data. When given a prompt, they predict the next word based "
    "on patterns learned during training. This process repeats to generate "
    "coherent and contextually relevant text."
)

EMBEDDED_RESPONSE = embed_text(SAMPLE_RESPONSE)

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
def test_enriched_query_invalid_payload(invalid_request_payload_fixture: IEnrichedQueryRequest):
    '''
    Test the enriched query API with an invalid payload.
    '''
    request = {'request': invalid_request_payload_fixture.__dict__}
    response = requests.post(API_URL, json=request, timeout=request_timeout)

    # Assuming the API returns a 400 Bad Request for invalid payloads
    assert response.status_code == 400 or response.status_code == 500, f"Expected status code 400 or 500, got {
        response.status_code}"

# pylint: disable=redefined-outer-name
def test_enriched_query_timeout(valid_request_payload_fixture: IEnrichedQueryRequest):
    '''
    Test the enriched query API with a timeout.
    '''
    with pytest.raises(requests.exceptions.Timeout):
        request = {'request': valid_request_payload_fixture.__dict__}
        requests.post(API_URL, json=request, timeout=0.001)


@pytest.mark.skip(reason='Helper function, not a test')
def test_enriched_query_success(payload: IEnrichedQueryRequest, expected_chunks: int, expected_embedding: list[float], threshold: float):
    '''
    Test the enriched query API with a successful response.
    Makes a request to the API and checks the response, including checking cosine similarity against a target response,
    then enumerating relevant chunks and also testing their cosine similarity
    '''
    try:
        request = {'request': payload.__dict__}
        response = requests.post(
            API_URL, json=request, timeout=request_timeout)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"API request failed: {e}")

    assert response.status_code == 200, f"Expected status code 200, got {
        response.status_code}"

    try:
        response_data = response.json()
    except ValueError:
        pytest.fail("Response is not valid JSON")

    assert "answer" in response_data, "Response JSON does not contain 'answer'"
    assert "chunks" in response_data, "Response JSON does not contain 'chunks'"

    assert isinstance(response_data["answer"],
                      str), "'answer' should be a string"
    assert isinstance(response_data["chunks"],
                      list), "'chunks' should be a list"
    assert len(response_data["chunks"]) == expected_chunks, f"Expected {
        expected_chunks} chunks, got {len(response_data['chunks'])}"

    if expected_chunks > 0 and expected_embedding is not None:
        embedded_answer = embed_text(response_data["answer"])
        assert cosine_similarity(
            embedded_answer, expected_embedding) > threshold, "Answer is not similar to the expected response:" + response_data["answer"]

        for chunk in response_data["chunks"]:
            typed_chunk: IEnrichedChunk = safe_dict_to_object(
                chunk['chunk'], IEnrichedChunk)
            # pylint: disable=no-member
            embedded_chunk = embed_text(typed_chunk.summary)
            assert cosine_similarity(
                embedded_chunk, expected_embedding) > threshold, "Chunk is not similar to the expected response:" + response_data["answer"]


def test_enriched_simple_function():
    '''
    Test the enriched query API with a simple function.
    '''
    try:
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How does an LLM work?"
        test_enriched_query_success(valid_request, 1, EMBEDDED_RESPONSE, 0.45)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test failed: {e}")


def test_enriched_simple_function_variant():
    '''
    Test the enriched query API with a simple function variant.
    '''
    try:
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How do LLMs work?"
        test_enriched_query_success(valid_request, 1, EMBEDDED_RESPONSE, 0.45)
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
            test_enriched_query_success(valid_request, 1, embedded_answer, 0.4)
        except requests.exceptions.RequestException as e:
            pytest.fail(f"Function from sample list failed: {e}")


if __name__ == '__main__':
    pytest.main()
