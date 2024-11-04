import pytest
import requests
import os
import jsonschema
from jsonschema.exceptions import ValidationError

# Configure the base URL for the API. 
BASE_URL = "http://localhost:7071/api"  
SESSION_KEY = os.environ['SessionKey']

# Test helper function to validate a response against a schema definition
def validate_response_vs_schema(schema_definition, response_data):
    try:
        jsonschema.validate(instance=response_data, schema=schema_definition)
    except jsonschema.exceptions.ValidationError as ve:
        pytest.fail(f"Response did not match schema: {ve.message}")
        
@pytest.mark.skip(reason="Helper function, not a test")
def test_IStudioBoxerResponseEnrichment_structure(enrichment_data):

    print (str(enrichment_data))
    
    # Check for required fields
    assert 'id' in enrichment_data    
    assert 'summary' in enrichment_data

    # Check if fields are strings
    assert isinstance(enrichment_data['id'], str)    
    assert isinstance(enrichment_data['summary'], str)

    if 'url' in enrichment_data:
       assert isinstance(enrichment_data['url'], str)
    if 'iconUrl' in enrichment_data:
       assert isinstance(enrichment_data['iconUrl'], str)       
       print (enrichment_data['iconUrl'])
    if 'title' in enrichment_data:
       assert isinstance(enrichment_data['title'], str)            

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
    validate_response_vs_schema(response_schema, response_json)
    test_IStudioBoxerResponse_structure (response_json)


def test_invalid_studio_request():
    # Test how the API handles invalid request data
    invalid_data = {"wrong_field": "Some value"}
    response = requests.post(studio_boxer_url, params=invalid_data)
    assert response.status_code == 400  # Assuming a bad request returns status code 400

if __name__ == "__main__":
    pytest.main()