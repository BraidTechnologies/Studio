import pytest

# Sample valid and invalid data based on the IChunkRequest and IChunkResponse definitions
valid_chunk_request = {
    "text": "This is a sample text to be chunked.",
    "chunkSize": 5,
    "overlapWords": 2
}

invalid_chunk_request_missing_text = {
    "chunkSize": 5,
    "overlapWords": 2
}

invalid_chunk_request_additional_property = {
    "text": "This is a sample text.",
    "chunkSize": 5,
    "additionalProperty": "not_allowed"
}

valid_chunk_response = {
    "chunks": ["This is", "a sample", "text to", "be chunked."]
}

invalid_chunk_response_missing_chunks = {
    "wrongKey": ["This is", "a sample", "text to", "be chunked."]
}

invalid_chunk_response_additional_property = {
    "chunks": ["This is", "a sample"],
    "additionalProperty": "not_allowed"
}


def is_valid_chunk_request(payload):
    if not isinstance(payload, dict):
        return False
    required_keys = {"text"}
    optional_keys = {"chunkSize", "overlapWords"}
    all_keys = required_keys | optional_keys
    
    if not required_keys <= payload.keys() <= all_keys:
        return False
    
    if not isinstance(payload["text"], str):
        return False
    
    if "chunkSize" in payload and not isinstance(payload["chunkSize"], (int, float)):
        return False
    
    if "overlapWords" in payload and not isinstance(payload["overlapWords"], (int, float)):
        return False
    
    return True


def is_valid_chunk_response(payload):
    if not isinstance(payload, dict):
        return False
    if "chunks" not in payload or not isinstance(payload["chunks"], list):
        return False
    if any(not isinstance(chunk, str) for chunk in payload["chunks"]):
        return False
    if len(payload) != 1:
        return False
    
    return True


def test_valid_chunk_request():
    assert is_valid_chunk_request(valid_chunk_request) is True


def test_invalid_chunk_request_missing_text():
    assert is_valid_chunk_request(invalid_chunk_request_missing_text) is False


def test_invalid_chunk_request_additional_property():
    assert is_valid_chunk_request(invalid_chunk_request_additional_property) is False


def test_valid_chunk_response():
    assert is_valid_chunk_response(valid_chunk_response) is True


def test_invalid_chunk_response_missing_chunks():
    assert is_valid_chunk_response(invalid_chunk_response_missing_chunks) is False


def test_invalid_chunk_response_additional_property():
    assert is_valid_chunk_response(invalid_chunk_response_additional_property) is False