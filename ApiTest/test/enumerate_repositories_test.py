'''
Test module for the EnumerateRepositories API endpoint.

This module contains test cases to verify the functionality of the EnumerateRepositories
API endpoint, which returns a list of available repository IDs. It includes schema 
validation and basic HTTP response testing.

Environment Requirements:
    - BRAID_SESSION_KEY: Must be set as an environment variable
'''

import pytest
import requests
import os
import jsonschema

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /enumerateRepositories endpoint
enumerate_repositories_url = f'{
    BASE_URL}/enumerateRepositories?session=' + SESSION_KEY

# Load the API schema from the file
ENUMERATE_REPOSITORIES_API_SCHEMA = {
    'definitions': {
        'IEnumerateRepositoriesRequest': {
            'type': 'object',
            'additionalProperties': False,
            'title': 'IEnumerateRepositoriesRequest',
            'description': 'Interface for the EnumerateRepositories request object.'
        },
        'IEnumerateRepositoriesResponse': {
            'type': 'object',
            'properties': {
                'repositoryIds': {'type': 'array'}
            },
            'required': ['repositoryIds'],
            'additionalProperties': False
        }
    }
}

# Test helper function to validate a response against a schema definition


def validate_response_vs_schema(schema_definition, response_data):
    try:
        jsonschema.validate(instance=response_data, schema=schema_definition)
    except jsonschema.exceptions.ValidationError as ve:
        pytest.fail(f'Response did not match schema: {ve.message}')

# Test function for the 'EnumeratRepositories' API response.


def test_enumerate_repositories():
    # Load the response schema
    response_schema = ENUMERATE_REPOSITORIES_API_SCHEMA[
        'definitions']['IEnumerateRepositoriesResponse']

    # Prepare a mocked request that matches the IEnumerateModelsRequest schema
    wrapped = {}  # This API doesn't require any specific request properties
    response = requests.post(enumerate_repositories_url, json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    response_json = response.json()

    # Validate the response against the schema
    validate_response_vs_schema(response_schema, response_json)


if __name__ == '__main__':
    pytest.main()
