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
    shell.similarityThreshold = 0.8
    shell.maxCount = 10
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell

@pytest.fixture
def invalid_request_payload():
    shell = IEnrichedQueryRequest ()
    shell.repositoryId = "this_wont_work"
    shell.similarityThreshold = 0.8
    shell.maxCount = 10
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell

def test_enriched_query_success(valid_request_payload):
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

    assert "answer" in response_data, "Response JSON does not contain 'answer'"
    assert "chunks" in response_data, "Response JSON does not contain 'chunks'"

    assert isinstance(response_data["answer"], str), "'answer' should be a string"
    assert isinstance(response_data["chunks"], list), "'chunks' should be a list"

    # Additional validations can be added here
    # For example, check the contents of 'chunks' if they have a specific structure

def test_enriched_query_invalid_payload(invalid_request_payload):
    request = {'request' : invalid_request_payload.__dict__}
    response = requests.post(API_URL, json=request)

    # Assuming the API returns a 400 Bad Request for invalid payloads
    assert response.status_code == 400 or response.status_code == 500, f"Expected status code 400 or 500, got {response.status_code}"

def test_enriched_query_timeout(valid_request_payload):
    with pytest.raises(requests.exceptions.Timeout):
        request= {'request' : valid_request_payload.__dict__}     
        requests.post(API_URL, json=request, timeout=0.001) 


if __name__ == '__main__':
    pytest.main()