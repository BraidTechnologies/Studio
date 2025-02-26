# test_model_factory.py
import pytest
from Salon.src.models.model_factory import create_model
from Salon.src.models.gemini import GeminiModel
from Salon.src.models.braid_api_model import BraidApiModel
from Salon.src.types.model_type import ModelType  # Ensure correct import path


def test_create_model_openai():
    """Test that create_model returns an BraidApiModel instance for ModelType.BRAID_API."""
    model = create_model(ModelType.BRAID_API.value)
    assert isinstance(model, BraidApiModel)


def test_create_model_gemini():
    """Test that create_model returns a GeminiModel instance for ModelType.LOCAL_GEMINI."""
    model = create_model(ModelType.LOCAL_GEMINI.value)
    assert isinstance(model, GeminiModel)


def test_create_model_invalid_type():
    """Test that create_model raises a ValueError for an invalid model type."""
    with pytest.raises(ValueError, match="Unknown model type: invalid_type"):
        create_model("invalid_type")
