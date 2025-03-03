# test_gemini.py

import os
import pytest
from unittest.mock import patch, MagicMock
from Salon.src.models.gemini import GeminiModel  # Update import if needed


@pytest.fixture
def gemini_model():
    """Fixture to create an instance of GeminiModel."""
    return GeminiModel()


@patch("gemini.genai.GenerativeModel")
def test_generate_content_success(mock_generative_model, gemini_model):
    """Test successful content generation."""
    mock_instance = mock_generative_model.return_value
    mock_instance.generate_content.return_value.text = "Generated content"

    result = gemini_model.generate_content("Test input", persona="TestPersona")
    
    assert result == "Generated content"
    mock_instance.generate_content.assert_called_once()


@patch("gemini.genai.GenerativeModel")
def test_generate_content_no_response(mock_generative_model, gemini_model):
    """Test when the Gemini API returns no response."""
    mock_instance = mock_generative_model.return_value
    mock_instance.generate_content.return_value.text = ""

    result = gemini_model.generate_content("Test input", persona="TestPersona")
    
    assert result is None
    assert mock_instance.generate_content.call_count == 3  # Should retry up to max_retries


@patch("gemini.genai.GenerativeModel")
@patch("time.sleep", return_value=None)  # Mock sleep to speed up tests
def test_generate_content_error(mock_sleep, mock_generative_model, gemini_model):
    """Test handling of errors with retries."""
    mock_instance = mock_generative_model.return_value
    mock_instance.generate_content.side_effect = Exception("API failure")

    result = gemini_model.generate_content("Test input", persona="TestPersona")

    assert result is None
    assert mock_instance.generate_content.call_count == 3  # Should retry up to max_retries
    mock_sleep.assert_called_with(2)  # Ensure retry delay was used


@patch.dict(os.environ, {}, clear=True)
@patch("builtins.print")
def test_missing_api_key(mock_print):
    """Test handling of missing API key."""
    model = GeminiModel()
    mock_print.assert_called_with("Warning: GOOGLE_DEVELOPER_API_KEY is not set. Local Gemini calls may fail.")
