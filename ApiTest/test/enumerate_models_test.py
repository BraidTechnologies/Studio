'''
Test module for the enumerate_models API endpoint.

This module contains test cases for validating the schema and functionality of the
enumerate_models endpoint, which provides information about available AI models and
their corresponding embedding models. Tests cover both request/response schema
validation and actual API interaction.

The module validates:
- IEnumerateModelsRequest schema
- IEnumerateModelsResponse schema
- API endpoint functionality
- Error handling for invalid responses
'''

import pytest
import requests
import os
import jsonschema

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

# Construct the full URL to the /enumerateModels endpoint
enumerate_models_url = f'{BASE_URL}/enumerateModels?session=' + SESSION_KEY

# Load the API schema from the file
ENUMERATE_MODELS_API_SCHEMA = {
    'definitions': {
        'IEnumerateModelsRequest': {
            'type': 'object',
            'additionalProperties': False,
            'title': 'IEnumerateModelsRequest',
            'description': 'Interface for the EnumerateModels request object.'
        },
        'IEnumerateModelsResponse': {
            'type': 'object',
            'properties': {
                'defaultId': {'type': 'string'},
                'defaultEmbeddingId': {'type': 'string'},
                'largeId': {'type': 'string'},
                'largeEmbeddingId': {'type': 'string'},
                'smallId': {'type': 'string'},
                'smallEmbeddingId': {'type': 'string'}
            },
            'required': ['defaultId', 'defaultEmbeddingId', 'largeId', 'largeEmbeddingId', 'smallId', 'smallEmbeddingId'],
            'additionalProperties': False
        }
    }
}


def validate_enumerate_models_schema(instance, schema_name) -> bool:
    '''Utility function to validate a JSON instance against a schema definition.'''
    schema = {'$ref': f'#/definitions/{schema_name}'}

    jsonschema.validate(instance=instance, schema={
                        '$schema': 'http://json-schema.org/draft-07/schema#', **ENUMERATE_MODELS_API_SCHEMA, **schema})


def test_ienumerate_models_request_valid():
    '''Test for a valid IEnumerateModelsRequest object.'''
    request_instance = {}
    validate_enumerate_models_schema(
        request_instance, 'IEnumerateModelsRequest')


def test_ienumerate_models_response_valid():
    '''Test for a valid IEnumerateModelsResponse object.'''
    response_instance = {
        'defaultId': 'default-id',
        'defaultEmbeddingId': 'default-embedding-id',
        'largeId': 'large-id',
        'largeEmbeddingId': 'large-embedding-id',
        'smallId': 'small-id',
        'smallEmbeddingId': 'small-embedding-id'
    }
    validate_enumerate_models_schema(
        response_instance, 'IEnumerateModelsResponse')


def test_ienumerate_models_response_missing_fields():
    '''Test for IEnumerateModelsResponse object missing required fields.'''
    response_instance = {
        'defaultId': 'default-id'
        # Missing other required fields
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate_enumerate_models_schema(
            response_instance, 'IEnumerateModelsResponse')


def test_ienumerate_models_response_additional_fields():
    '''Test for IEnumerateModelsResponse object with additional fields that should be disallowed.'''
    response_instance = {
        'defaultId': 'default-id',
        'defaultEmbeddingId': 'default-embedding-id',
        'largeId': 'large-id',
        'largeEmbeddingId': 'large-embedding-id',
        'smallId': 'small-id',
        'smallEmbeddingId': 'small-embedding-id',
        'extraField': 'extra'  # Additional field not defined in schema
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate_enumerate_models_schema(
            response_instance, 'IEnumerateModelsResponse')


def test_enumerate_request():
    '''Test sending an enumerate request to the API.'''
    wrapped = {
        'request': ''
    }
    response = requests.post(enumerate_models_url,
                             json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    response_json = response.json()
    validate_enumerate_models_schema(response_json, 'IEnumerateModelsResponse')


if __name__ == '__main__':
    pytest.main()
