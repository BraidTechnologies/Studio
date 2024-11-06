import pytest
import requests
import os


# Configure the base URL for the API. 
BASE_URL = "http://localhost:7071/api"  
SESSION_KEY = os.environ['SessionKey']

# Construct the full URL to the /chunk endpoint
chunk_url = f"{BASE_URL}/chunk?session=" + SESSION_KEY

# Example test data based on the provided schema
@pytest.fixture
def chunk_request_data():
    return {
        "text": "This is a sample text to be chunked.",
        "chunkSize": 5,
        "overlapWords": 2
    }

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

if __name__ == "__main__":
    pytest.main()