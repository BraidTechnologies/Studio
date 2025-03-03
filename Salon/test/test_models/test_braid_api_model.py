import os
import pytest
import requests
from unittest.mock import patch, MagicMock
from openai import OpenAI
from Salon.src.models.braid_api_model import BraidApiModel, summarise_endpoint_url


@pytest.fixture
def mock_env_vars(monkeypatch):
    """Mock required environment variables."""
    monkeypatch.setenv("OPENAI_API_KEY", "test_api_key")
    monkeypatch.setenv("BRAID_BASE_URL", "https://braid-api.azurewebsites.net/api")
    monkeypatch.setenv("BRAID_SESSION_KEY", "test_session_key")


@pytest.fixture
def openai_model(mock_env_vars):
    """Fixture to create an BraidApiModel instance."""
    return BraidApiModel()


def test_openai_model_initialization(mock_env_vars):
    """Test that BraidApiModel initializes correctly with environment variables."""
    model = BraidApiModel()
    assert model.client is not None


def test_openai_model_initialization_missing_api_key(monkeypatch):
    """Test that BraidApiModel raises an error if OPENAI_API_KEY is missing."""
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    with pytest.raises(ValueError, match="OPENAI_API_KEY not found in environment variables."):
        BraidApiModel()


@patch("requests.Session.post")
def test_generate_content_success(mock_post, openai_model):
    """Test that generate_content returns the expected summary when API call succeeds."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {"summary": "Generated summary text"}
    mock_post.return_value = mock_response

    summary = openai_model.generate_content(
        text="Test input",
        persona="CodeSummariser",
        persona_intro="Summarizing...",
        length_in_words=100
    )

    assert summary == "Generated summary text"
    mock_post.assert_called_once_with(
        summarise_endpoint_url(),
        json={"request": {"persona": "CodeSummariser", "text": "Summarizing...\n\n---\nTest input\n---", "lengthInWords": 100}},
        headers={
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        timeout=requests.get("https://braid-api.azurewebsites.net/api/Summarize?session=test_session_key").elapsed.total_seconds()
    )


@patch("requests.Session.post")
def test_generate_content_api_failure(mock_post, openai_model):
    """Test that generate_content returns None when API call fails."""
    mock_response = MagicMock()
    mock_response.status_code = 500
    mock_response.json.return_value = {}
    mock_post.return_value = mock_response

    summary = openai_model.generate_content(
        text="Test input",
        persona="CodeSummariser"
    )

    assert summary is None


@patch("requests.Session.post", side_effect=requests.RequestException("Network Error"))
def test_generate_content_network_error(mock_post, openai_model):
    """Test that generate_content handles network errors gracefully."""
    summary = openai_model.generate_content(text="Test input", persona="CodeSummariser")
    assert summary is None


@patch.object(OpenAI, "beta")
def test_generate_code_success(mock_beta, openai_model):
    """Test that generate_code returns generated Python code when OpenAI API succeeds."""
    mock_assistant = MagicMock()
    mock_assistant.id = "assistant_id"

    mock_thread = MagicMock()
    mock_thread.id = "thread_id"

    mock_beta.assistants.create.return_value = mock_assistant
    mock_beta.threads.create.return_value = mock_thread

    mock_beta.threads.messages.list.return_value.data = [
        MagicMock(role="assistant", content=[MagicMock(text=MagicMock(value="```python\nprint('Hello')\n```"))])
    ]

    generated_code = openai_model.generate_code("Test prompt", "Test instructions")
    assert "print('Hello')" in generated_code


@patch.object(OpenAI, "beta", side_effect=Exception("OpenAI Error"))
def test_generate_code_error(mock_beta, openai_model):
    """Test that generate_code returns None if OpenAI API fails."""
    generated_code = openai_model.generate_code("Test prompt", "Test instructions")
    assert generated_code is None
