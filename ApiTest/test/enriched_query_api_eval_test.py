'''
Test module for the enriched query API endpoint.

This module contains test cases to verify the functionality of the /queryModelWithEnrichment 
endpoint, which processes enriched queries with repository context. Tests cover both valid 
and invalid request scenarios, verifying response structures and error handling.

'''

import os
import copy
import pytest
import requests
from CommonPy.src.enriched_query_api_types import IEnrichedQueryRequest, IEnrichedResponse, IEnrichedChunk
from CommonPy.src.type_utilities import safe_dict_to_object, safe_cast
from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /queryModelWithEnrichment endpoint
API_URL = f'{BASE_URL}/queryModelWithEnrichment?session=' + SESSION_KEY

# Construct the full URL to the /chunk endpoint
EMBED_URL = f'{BASE_URL}/embed?session=' + SESSION_KEY

def embed_text(textToEmbed: str) -> list[float]:

    # Define a valid request payload according to the JSON schema
    valid_request = {
        'text': textToEmbed
    }

    wrapped = {
        'request' : valid_request
    }     

    # send the request to the API
    response = requests.post(EMBED_URL, json=wrapped, timeout=request_timeout)

    # Check for successful response
    assert response.status_code == 200, f'Unexpected status code: {response.status_code}'

    # Validate response structure
    response_data = response.json()

    # Check if embedding is a list
    return response_data.get('embedding')

def cosine_similarity(vector1: list[float], vector2: list[float]) -> float:
    """
    Calculate the cosine similarity between two vectors.
    
    Parameters:
        vector1: First vector as list of floats
        vector2: Second vector as list of floats
        
    Returns:
        float: Cosine similarity between the vectors
    """
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



SAMPLE_RESPONSE="LLMs use deep learning to generate human-like text. They are trained on vast amounts of text data. When given a prompt, they predict the next word based on patterns learned during training. This process repeats to generate coherent and contextually relevant text."

EMBEDDED_RESPONSE = embed_text(SAMPLE_RESPONSE)

def valid_request_payload():
    shell = IEnrichedQueryRequest ()
    shell.repositoryId = "Boxer"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell

def invalid_request_payload():
    shell = IEnrichedQueryRequest ()
    shell.repositoryId = "this_wont_work"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell

@pytest.fixture
def valid_request_payload_fixture():
    return valid_request_payload()

@pytest.fixture
def invalid_request_payload_fixture():
    return invalid_request_payload()

def test_enriched_query_invalid_payload(invalid_request_payload_fixture: IEnrichedQueryRequest):
    '''
    Test the enriched query API with an invalid payload.
    '''
    request = {'request' : invalid_request_payload_fixture.__dict__}
    response = requests.post(API_URL, json=request, timeout=request_timeout)

    # Assuming the API returns a 400 Bad Request for invalid payloads
    assert response.status_code == 400 or response.status_code == 500, f"Expected status code 400 or 500, got {response.status_code}"

def test_enriched_query_timeout(valid_request_payload_fixture: IEnrichedQueryRequest):
    '''
    Test the enriched query API with a timeout.
    '''
    with pytest.raises(requests.exceptions.Timeout):
        request= {'request' : valid_request_payload_fixture.__dict__}     
        requests.post(API_URL, json=request, timeout=0.001)

@pytest.mark.skip(reason='Helper function, not a test')
def test_enriched_query_success(payload: IEnrichedQueryRequest, expected_chunks: int, expected_embedding: list[float]):
    '''
    Test the enriched query API with a successful response.
    Makes a request to the API and checks the response, including checking cosine similarity against a target response,
    then enumerating relevant chunks and also testing their cosine similarity
    '''
    try:
        request= {'request' : payload.__dict__}
        response = requests.post(API_URL, json=request, timeout=request_timeout)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"API request failed: {e}")

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        response_data = response.json()
    except ValueError:
        pytest.fail("Response is not valid JSON")

    assert "answer" in response_data, "Response JSON does not contain 'answer'"
    assert "chunks" in response_data, "Response JSON does not contain 'chunks'"

    assert isinstance(response_data["answer"], str), "'answer' should be a string"
    assert isinstance(response_data["chunks"], list), "'chunks' should be a list"
    assert len(response_data["chunks"]) == expected_chunks, f"Expected {expected_chunks} chunks, got {len(response_data['chunks'])}"

    if expected_chunks > 0 and expected_embedding is not None:
      embedded_answer = embed_text(response_data["answer"])
      assert cosine_similarity(embedded_answer, expected_embedding) > 0.5, "Answer is not similar to the expected response"

      for chunk in response_data["chunks"]:
        typed_chunk: IEnrichedChunk = safe_dict_to_object(chunk['chunk'], IEnrichedChunk)
        embedded_chunk = embed_text(typed_chunk.summary)
        assert cosine_similarity(embedded_chunk, expected_embedding) > 0.5, "Chunk is not similar to the expected response"

def test_enriched_simple_function ():
    '''
    Test the enriched query API with a simple function.
    '''
    try:
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How does an LLM work?"
        test_enriched_query_success(valid_request, 1, EMBEDDED_RESPONSE)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test failed: {e}")

def test_enriched_simple_function_variant ():
    '''
    Test the enriched query API with a simple function variant.
    '''
    try:
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How do LLMs work?"
        test_enriched_query_success(valid_request, 1, EMBEDDED_RESPONSE)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function positive variant test failed: {e}")

def test_enriched_simple_function_negative ():
    '''
    Test the enriched query API with a simple function negative variant.
    '''
    try:
        valid_request = copy.deepcopy(valid_request_payload())
        valid_request.question = "How does a BLT work?"
        test_enriched_query_success(valid_request, 0, None)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test negative variant failed: {e}")

if __name__ == '__main__':
    pytest.main()