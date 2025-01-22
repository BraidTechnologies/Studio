import os
import pytest
import requests
from CommonPy.src.enriched_query_api_types import IEnrichedQueryRequest, IEnrichedResponse
from CommonPy.src.type_utilities import safe_dict_to_object, safe_cast

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /enumerateModels endpoint
API_URL = f'{BASE_URL}/queryModelWithEnrichment?session=' + SESSION_KEY

@pytest.fixture
def valid_request_payload():
    shell = IEnrichedQueryRequest ()
    shell.repositoryId = "Boxer"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell

@pytest.fixture
def invalid_request_payload():
    shell = IEnrichedQueryRequest ()
    shell.repositoryId = "this_wont_work"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell


def test_enriched_query_invalid_payload(invalid_request_payload):
    request = {'request' : invalid_request_payload.__dict__}
    response = requests.post(API_URL, json=request)

    # Assuming the API returns a 400 Bad Request for invalid payloads
    assert response.status_code == 400 or response.status_code == 500, f"Expected status code 400 or 500, got {response.status_code}"

def test_enriched_query_timeout(valid_request_payload):
    with pytest.raises(requests.exceptions.Timeout):
        request= {'request' : valid_request_payload.__dict__}     
        requests.post(API_URL, json=request, timeout=0.001)

@pytest.mark.skip(reason='Helper function, not a test')
def test_enriched_query_success(valid_request_payload: IEnrichedQueryRequest, expectedChunks: int):
    try:
        request= {'request' : valid_request_payload.__dict__}
        response = requests.post(API_URL, json=request)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"API request failed: {e}")

    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    try:
        response_data = response.json()
    except ValueError:
        pytest.fail("Response is not valid JSON")

    print (response_data["answer"])
    print (response_data["chunks"])

    assert "answer" in response_data, "Response JSON does not contain 'answer'"
    assert "chunks" in response_data, "Response JSON does not contain 'chunks'"

    assert isinstance(response_data["answer"], str), "'answer' should be a string"
    assert isinstance(response_data["chunks"], list), "'chunks' should be a list"
    assert len(response_data["chunks"]) == expectedChunks, f"Expected {expectedChunks} chunks, got {len(response_data['chunks'])}"

def test_enriched_simple_function (valid_request_payload):
    try:
        valid_request = valid_request_payload
        valid_request.question = "How does an LLM work?"
        test_enriched_query_success(valid_request_payload, 1)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test failed: {e}")

def test_enriched_simple_function_variant (valid_request_payload):
    try:
        valid_request = valid_request_payload
        valid_request.question = "How do LLMs work?"
        test_enriched_query_success(valid_request_payload, 1)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function positive variant test failed: {e}")

def test_enriched_simple_function_negative (valid_request_payload):
    try:
        valid_request = valid_request_payload
        valid_request.question = "How does a BLT work?"
        test_enriched_query_success(valid_request_payload, 0)
    except requests.exceptions.RequestException as e:
        pytest.fail(f"Simple function test negative variant failed: {e}")

if __name__ == '__main__':
    pytest.main()