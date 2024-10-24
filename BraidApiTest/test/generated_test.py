import pytest
import requests
import os
import jsonschema
from jsonschema.exceptions import ValidationError

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

# Construct the full URL to the /enumerateModels endpoint
enumerate_models_url = f"{BASE_URL}/enumerateModels?session=" + SESSION_KEY

# Load the API schema from the file
ENUMERATE_MODELS_API_SCHEMA = {
    "definitions": {
        "IEnumerateModelsRequest": {
            "type": "object",
            "additionalProperties": False,
            "title": "IEnumerateModelsRequest",
            "description": "Interface for the EnumerateModels request object."
        },
        "IEnumerateModelsResponse": {
            "type": "object",
            "properties": {
                "defaultId": {"type": "string"},
                "defaultEmbeddingId": {"type": "string"},
                "largeId": {"type": "string"},
                "largeEmbeddingId": {"type": "string"},
                "smallId": {"type": "string"},
                "smallEmbeddingId": {"type": "string"}
            },
            "required": ["defaultId", "defaultEmbeddingId", "largeId", "largeEmbeddingId", "smallId", "smallEmbeddingId"],
            "additionalProperties": False
        }
    }
}

def validate_enumerate_models_schema(instance, schema_name) -> bool:
    """Utility function to validate a JSON instance against a schema definition."""
    schema = {"$ref": f"#/definitions/{schema_name}"}

    jsonschema.validate(instance=instance, schema={"$schema": "http://json-schema.org/draft-07/schema#", **ENUMERATE_MODELS_API_SCHEMA, **schema})

def test_ienumerate_models_request_valid():
    """Test for a valid IEnumerateModelsRequest object."""
    request_instance = {}
    validate_enumerate_models_schema(request_instance, "IEnumerateModelsRequest")

def test_ienumerate_models_response_valid():
    """Test for a valid IEnumerateModelsResponse object."""
    response_instance = {
        "defaultId": "default-id",
        "defaultEmbeddingId": "default-embedding-id",
        "largeId": "large-id",
        "largeEmbeddingId": "large-embedding-id",
        "smallId": "small-id",
        "smallEmbeddingId": "small-embedding-id"
    }
    validate_enumerate_models_schema(response_instance, "IEnumerateModelsResponse")

def test_ienumerate_models_response_missing_fields():
    """Test for IEnumerateModelsResponse object missing required fields."""
    response_instance = {
        "defaultId": "default-id"
        # Missing other required fields
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate_enumerate_models_schema(response_instance, "IEnumerateModelsResponse")

def test_ienumerate_models_response_additional_fields():
    """Test for IEnumerateModelsResponse object with additional fields that should be disallowed."""
    response_instance = {
        "defaultId": "default-id",
        "defaultEmbeddingId": "default-embedding-id",
        "largeId": "large-id",
        "largeEmbeddingId": "large-embedding-id",
        "smallId": "small-id",
        "smallEmbeddingId": "small-embedding-id",
        "extraField": "extra"  # Additional field not defined in schema
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate_enumerate_models_schema(response_instance, "IEnumerateModelsResponse")

def test_enumerate_request():
    """Test sending an enumerate request to the API."""
    wrapped = {
        'request' : classify_request_data
    }       
    response = requests.post(enumerate_models_url, json=wrapped)
    assert response.status_code == 200
    response_json = response.json()
    validate_enumerate_models_schema(response_json, "IEnumerateModelsResponse")    

# Construct the full URL to the /enumerateRepositories endpoint
enumerate_repositories_url = f"{BASE_URL}/enumerateRepositories?session=" + SESSION_KEY

# Load the API schema from the file
ENUMERATE_REPOSITORIES_API_SCHEMA = {
    "definitions": {
        "IEnumerateRepositoriesRequest": {
            "type": "object",
            "additionalProperties": False,
            "title": "IEnumerateRepositoriesRequest",
            "description": "Interface for the EnumerateRepositories request object."
        },
        "IEnumerateRepositoriesResponse": {
            "type": "object",
            "properties": {
                "repositoryIds": {"type": "array"}
            },
            "required": ["repositoryIds"],
            "additionalProperties": False
        }
    }
}

# Test helper function to validate a response against a schema definition
def validate_enumerate_respositories_response(schema_definition, response_data):
    try:
        jsonschema.validate(instance=response_data, schema=schema_definition)
    except jsonschema.exceptions.ValidationError as ve:
        pytest.fail(f"Response did not match schema: {ve.message}")

# Test function for the 'EnumeratRepositories' API response.
def test_enumerate_repositories():
    # Load the response schema
    response_schema = ENUMERATE_REPOSITORIES_API_SCHEMA['definitions']['IEnumerateRepositoriesResponse']

    # Prepare a mocked request that matches the IEnumerateModelsRequest schema
    wrapped = {}  # This API doesn't require any specific request properties   
    response = requests.post(enumerate_repositories_url, json=wrapped)
    assert response.status_code == 200
    response_json = response.json()

    # Validate the response against the schema
    validate_enumerate_respositories_response(response_schema, response_json)


@pytest.mark.skip(reason="Helper function, not a test")
def test_IStudioBoxerResponseEnrichment_structure(enrichment_data):

    # Check for required fields
    assert 'id' in enrichment_data    
    assert 'summary' in enrichment_data

    # Check if fields are strings
    assert isinstance(enrichment_data['id'], str)    
    assert isinstance(enrichment_data['summary'], str)

    if 'url' in enrichment_data:
       assert isinstance(enrichment_data['url'], str)
    if 'icon' in enrichment_data:
       assert isinstance(enrichment_data['icon'], str)       
       print (enrichment_data['icon'])

@pytest.mark.skip(reason="Helper function, not a test")
def test_IStudioBoxerResponse_structure(response_data):

    # Check if 'enrichments' is a list
    assert isinstance(response_data, list)

    # Validate each enrichment
    for enrichment in response_data:
        test_IStudioBoxerResponseEnrichment_structure(enrichment)

# Construct the full URL to the /enumerateRepositories endpoint
studio_boxer_url = f"{BASE_URL}/StudioForTeams-Boxer"

# Load the API schema from the file
STUDIO_FOR_TEAMS_BOXER_API_SCHEMA = {
    "definitions": {
        "IStudioBoxerResponse": {
            "type": "array"
        }
    }
}

# Test function for the 'StudioBoxer' API .
def test_studio_boxer ():
    # Load the response schema
    response_schema = STUDIO_FOR_TEAMS_BOXER_API_SCHEMA['definitions']['IStudioBoxerResponse']

    # Prepare a mocked request that matches the IEnumerateModelsRequest schema
    params = {'question': 'What is the purpose of an LLM?'}  

    response = requests.post(studio_boxer_url, params=params)
    assert response.status_code == 200
    response_json = response.json()

    # Validate the response against the schema
    validate_enumerate_respositories_response(response_schema, response_json)
    test_IStudioBoxerResponse_structure (response_json)


def test_invalid_studio_request():
    # Test how the API handles invalid request data
    invalid_data = {"wrong_field": "Some value"}
    response = requests.post(studio_boxer_url, params=invalid_data)
    assert response.status_code == 400  # Assuming a bad request returns status code 400

if __name__ == "__main__":
    pytest.main()