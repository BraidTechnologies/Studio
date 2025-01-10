import pytest
from typing import Any, Dict

# Fixtures to provide test data
@pytest.fixture
def valid_request_data():
    return {
        "text": "Sample text for classification",
        "classifications": ["category1", "category2"]
    }

@pytest.fixture
def invalid_request_data():
    return {
        "classifications": ["category1", "category2"]
    }

@pytest.fixture
def valid_response_data():
    return {
        "classification": "category1"
    }

@pytest.fixture
def invalid_response_data():
    return {
        "classification": 123  # Incorrect type, should be string
    }

# Dummy functions - to be implemented according to your application logic
def classify_request_handler(data: Dict[str, Any]) -> Dict[str, Any]:
    # TODO: Implement the actual request handling logic here
    return data  # Replace with actual logic

def classify_response_handler(data: Dict[str, Any]) -> Dict[str, Any]:
    # TODO: Implement the actual response handling logic here
    return data  # Replace with actual logic

# Test cases
def test_valid_classify_request(valid_request_data):
    response = classify_request_handler(valid_request_data)
    assert response["text"] == valid_request_data["text"]
    assert response["classifications"] == valid_request_data["classifications"]

def test_invalid_classify_request(invalid_request_data):
    with pytest.raises(KeyError):
        classify_request_handler(invalid_request_data)

def test_valid_classify_response(valid_response_data):
    response = classify_response_handler(valid_response_data)
    assert response["classification"] == valid_response_data["classification"]

def test_invalid_classify_response(invalid_response_data):
    with pytest.raises(TypeError):
        classify_response_handler(invalid_response_data)

def test_additional_properties_in_request(valid_request_data):
    extended_data = valid_request_data.copy()
    extended_data["unexpected"] = "unexpected value"
    with pytest.raises(ValueError):
        classify_request_handler(extended_data)

def test_additional_properties_in_response(valid_response_data):
    extended_data = valid_response_data.copy()
    extended_data["unexpected"] = "unexpected value"
    with pytest.raises(ValueError):
        classify_response_handler(extended_data)