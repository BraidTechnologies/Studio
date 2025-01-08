import pytest
from pydantic import BaseModel, ValidationError, conlist
from typing import List

# Define the data models
class IEmbedRequest(BaseModel):
    text: str

    class Config:
        title = "IEmbedRequest"
        extra = "forbid"
        schema_extra = {
            "description": "Interface for the embedding request object."
        }


class IEmbedResponse(BaseModel):
    embedding: List[float]

    class Config:
        title = "IEmbedResponse"
        extra = "forbid"
        schema_extra = {
            "description": "Interface for the embedding response object."
        }

# Write the tests

def test_valid_IEmbedRequest():
    # Test with valid input
    try:
        request = IEmbedRequest(text="This is a test text")
        assert request.text == "This is a test text"
    except ValidationError as e:
        pytest.fail(f"Unexpected ValidationError: {e}")

def test_invalid_IEmbedRequest_missing_text():
    # Test with missing required field 'text'
    with pytest.raises(ValidationError):
        IEmbedRequest()

def test_invalid_IEmbedRequest_additional_properties():
    # Test with additional properties
    with pytest.raises(ValidationError):
        IEmbedRequest(text="Valid text", extra_field="Not allowed")

def test_valid_IEmbedResponse():
    # Test with valid input
    try:
        response = IEmbedResponse(embedding=[0.1, 0.2, 0.3])
        assert response.embedding == [0.1, 0.2, 0.3]
    except ValidationError as e:
        pytest.fail(f"Unexpected ValidationError: {e}")

def test_invalid_IEmbedResponse_missing_embedding():
    # Test with missing required field 'embedding'
    with pytest.raises(ValidationError):
        IEmbedResponse()

def test_invalid_IEmbedResponse_non_numeric_embedding():
    # Test with non-numeric values in 'embedding' list
    with pytest.raises(ValidationError):
        IEmbedResponse(embedding=["string", 0.3, 0.2])