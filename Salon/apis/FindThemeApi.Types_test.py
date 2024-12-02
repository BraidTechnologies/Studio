import pytest
import jsonschema
from jsonschema import validate

# Define the schema for request and response
IFindThemeRequestSchema = {
    "type": "object",
    "properties": {
        "text": {"type": "string", "title": "IFindThemeRequest.text"},
        "length": {"type": "number", "title": "IFindThemeRequest.length"}
    },
    "required": ["text", "length"],
    "additionalProperties": False
}

IFindThemeResponseSchema = {
    "type": "object",
    "properties": {
        "theme": {"type": "string", "title": "IFindThemeResponse.theme"}
    },
    "required": ["theme"],
    "additionalProperties": False
}

# Test cases for IFindThemeRequest
def test_valid_ifind_theme_request():
    # Valid example
    payload = {
        "text": "Find the theme",
        "length": 17
    }
    # Test validation passes without exception
    validate(instance=payload, schema=IFindThemeRequestSchema)

def test_invalid_ifind_theme_request_missing_text():
    # Invalid example: missing 'text'
    payload = {
        "length": 10
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeRequestSchema)

def test_invalid_ifind_theme_request_missing_length():
    # Invalid example: missing 'length'
    payload = {
        "text": "Missing length"
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeRequestSchema)

def test_invalid_ifind_theme_request_additional_properties():
    # Invalid example: additional property
    payload = {
        "text": "Theme with extra",
        "length": 18,
        "extra": "This should not be here"
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeRequestSchema)
        
def test_invalid_ifind_theme_request_wrong_type():
    # Invalid example: 'length' is string instead of a number
    payload = {
        "text": "Theme with wrong type",
        "length": "I am not a number"
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeRequestSchema)

# Test cases for IFindThemeResponse
def test_valid_ifind_theme_response():
    # Valid example
    payload = {
        "theme": "Nature"
    }
    # Test validation passes without exception
    validate(instance=payload, schema=IFindThemeResponseSchema)
    
def test_invalid_ifind_theme_response_missing_theme():
    # Invalid example: missing 'theme'
    payload = {}
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeResponseSchema)

def test_invalid_ifind_theme_response_additional_properties():
    # Invalid example: additional property
    payload = {
        "theme": "History",
        "extra": "This should not be here"
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeResponseSchema)

def test_invalid_ifind_theme_response_wrong_type():
    # Invalid example: 'theme' is number instead of a string
    payload = {
        "theme": 12345
    }
    with pytest.raises(jsonschema.exceptions.ValidationError):
        validate(instance=payload, schema=IFindThemeResponseSchema)

# Run the tests
pytest.main()