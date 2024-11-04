import pytest
from pydantic import BaseModel, ValidationError, Field
from typing import List, Optional


class IChunkRequest(BaseModel):
    text: str = Field(..., title="IChunkRequest.text")
    chunkSize: Optional[float] = Field(None, title="IChunkRequest.chunkSize")
    overlapWords: Optional[float] = Field(None, title="IChunkRequest.overlapWords")

    class Config:
        extra = "forbid"


class IChunkResponse(BaseModel):
    chunks: List[str] = Field(..., title="IChunkResponse.chunks")

    class Config:
        extra = "forbid"


def test_ichunkrequest_with_minimal_valid_data():
    try:
        req = IChunkRequest(text="This is a test.")
        assert req.text == "This is a test."
        assert req.chunkSize is None
        assert req.overlapWords is None
    except ValidationError as e:
        pytest.fail(f"Unexpected ValidationError: {e}")


def test_ichunkrequest_with_full_valid_data():
    try:
        req = IChunkRequest(text="This is a test.", chunkSize=100, overlapWords=10)
        assert req.text == "This is a test."
        assert req.chunkSize == 100
        assert req.overlapWords == 10
    except ValidationError as e:
        pytest.fail(f"Unexpected ValidationError: {e}")


def test_ichunkrequest_missing_text():
    with pytest.raises(ValidationError):
        IChunkRequest()


def test_ichunkrequest_with_extra_properties():
    with pytest.raises(ValidationError):
        IChunkRequest(text="This is a test.", extraProperty="not allowed")


def test_ichunkresponse_with_valid_data():
    try:
        resp = IChunkResponse(chunks=["chunk1", "chunk2"])
        assert resp.chunks == ["chunk1", "chunk2"]
    except ValidationError as e:
        pytest.fail(f"Unexpected ValidationError: {e}")


def test_ichunkresponse_missing_chunks():
    with pytest.raises(ValidationError):
        IChunkResponse()


def test_ichunkresponse_with_extra_properties():
    with pytest.raises(ValidationError):
        IChunkResponse(chunks=["chunk1"], extraProperty="not allowed")