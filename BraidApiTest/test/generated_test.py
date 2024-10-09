import pytest
import requests
import os

# Configure the base URL for the API. 
BASE_URL = "http://localhost:7071/api"  
SESSION_KEY = os.environ['SessionKey']

def summarise_endpoint_url():
    # Construct the full URL for the summary endpoint
    return f"{BASE_URL}/Summarize?session=" + SESSION_KEY

def test_valid_summarise_request():
    # Test case for a valid summarization request
    payload = {
        "text": "This is a text that needs to be summarized and in order for this to work it needs to be over the minumum text length.",
        "lengthInWords": 10
    }
    wrapped = {
        'request' : payload
    }    
    response = requests.post(summarise_endpoint_url(), json=wrapped)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert isinstance(data["summary"], str)
    # Further checks can be added based on expected summary content

def test_summarise_request_without_length():
    # Test case with the text but no lengthInWords
    payload = {
        "text": "This text needs summarization but without specifying the length."
    }
    wrapped = {
        'request' : payload
    }     
    response = requests.post(summarise_endpoint_url(), json=wrapped)
    assert response.status_code == 200
    data = response.json()
    assert "summary" in data
    assert isinstance(data["summary"], str)

def test_summarise_request_missing_text():
    # This should fail because 'text' is a required field
    payload = {
        "lengthInWords": 10
    }
    wrapped = {
        'request' : payload
    }     
    response = requests.post(summarise_endpoint_url(), json=wrapped)
    assert response.status_code == 400  # Assuming the API returns a 400 Bad Request
    # Additional logic to verify error message can be added here

def test_empty_summarise_request():
    # Test case with an empty payload
    payload = {}
    response = requests.post(summarise_endpoint_url(), json=payload)
    assert response.status_code == 500  # Empty request should fail

# Example test data based on the provided schema
@pytest.fixture
def chunk_request_data():
    return {
        "text": "This is a sample text to be chunked.",
        "chunkSize": 5,
        "overlapWords": 2
    }

       
# Construct the full URL to the /chunk endpoint
chunk_url = f"{BASE_URL}/chunk?session=" + SESSION_KEY

def test_chunk_endpoint(chunk_request_data):

    wrapped = {
        'request' : chunk_request_data
    } 

    # Send a POST request
    response = requests.post(chunk_url, json=wrapped)

    # Assert that the response status code is 200
    assert response.status_code == 200

    # Parse the response JSON
    response_data = response.json()

    # Assert the presence of expected keys in the response data
    assert "chunks" in response_data

    assert len(response_data['chunks']) > 0


# Construct the full URL to the /chunk endpoint
embed_url = f"{BASE_URL}/embed?session=" + SESSION_KEY

def test_embedding_request_structure():    

    # Define a valid request payload according to the JSON schema
    valid_request = {
        "text": "This is a test string for generating embeddings"
    }

    wrapped = {
        'request' : valid_request
    }     

    # Simulate sending the request to the API
    response = requests.post(embed_url, json=wrapped)

    # Check for successful response
    assert response.status_code == 200, f"Unexpected status code: {response.status_code}"

    # Validate response structure
    response_data = response.json()

    # Check if embedding is a list
    assert isinstance(response_data.get("embedding"), list), "Response 'embedding' is not a list"

    # Check if all elements in embedding are numbers
    assert all(isinstance(x, (int, float)) for x in response_data["embedding"]), "Embedding contains non-numeric elements"

def test_invalid_request_structure():
    
    # Define an invalid request with missing 'text' field
    invalid_request = {
        "wrong_field": "This should cause an error"
    }
    wrapped = {
        'request' : invalid_request
    }   
    # Simulate sending the request to the API
    response = requests.post(embed_url, json=wrapped)

    # Expecting a 400 status code for bad request
    assert response.status_code == 400, f"Expected 400 status for invalid request, got {response.status_code}"

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
    response = requests.post(find_theme_url, json=wrapped)
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
    response = requests.post(find_theme_url, json=wrapped)
    assert response.status_code == 400, "Expected status code 400 for missing 'text'"

def test_find_theme_with_missing_length():
    request_data = {
        "text": "Sample text input"
    }
    wrapped = {
        'request' : request_data
    }       
    response = requests.post(find_theme_url, json=wrapped)
    assert response.status_code == 400, "Expected status code 400 for missing 'length'"    

# Sample data based on the definitions
classify_request_data = {
    "text": "Great, fabulous, magnificent, awesome, brilliant, great, love it, smashed it",
    "classifications": ["Positive", "Negative", "Neutral"]
}

response_data = {
    "classification": "Positive"
}

# Construct the full URL to the /classify endpoint
classify_url = f"{BASE_URL}/classify?session=" + SESSION_KEY

def test_classification_request():
    """Test sending a classification request to the API."""
    wrapped = {
        'request' : classify_request_data
    }       
    response = requests.post(classify_url, json=wrapped)
    assert response.status_code == 200
    response_json = response.json()
    assert "classification" in response_json
    assert response_json["classification"] in classify_request_data["classifications"]

@pytest.mark.parametrize("invalid_data", [
    {"text": "Example", "classifications": None},  # Missing classifications
    {"text": "", "classifications": ["Positive"]},  # Empty text
    {"classifications": ["Positive", "Negative"]},  # Missing text
    {"text": "Example text", "classifications": []}  # Empty classifications
])
def test_invalid_classification_request(invalid_data):
    """Test classification requests with invalid data."""
    wrapped = {
        'request' : invalid_data
    }      
    response = requests.post(classify_url, json=wrapped)
    assert response.status_code == 400  # Assuming the API returns 400 for bad requests    