import pytest
import requests
import os


# Configure the base URL for the API. 
BASE_URL = "http://localhost:7071/api"  
SESSION_KEY = os.environ['SessionKey']

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


if __name__ == "__main__":
    pytest.main()