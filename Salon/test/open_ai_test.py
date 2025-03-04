import os
import pytest
import json
from unittest.mock import patch, MagicMock, ANY
import logging
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

from Salon.src.models.open_ai import OpenAiModel, summarise_endpoint_url

# Test fixtures
@pytest.fixture
def mock_env_vars():
    """Fixture to set up environment variables for testing"""
    with patch.dict(os.environ, {
        "OPENAI_API_KEY": "test_api_key",
        "BRAID_BASE_URL": "https://test-api.example.com/api",
        "BRAID_SESSION_KEY": "test_session_key"
    }, clear=True):
        yield

@pytest.fixture
def mock_openai_client():
    """Fixture to mock the OpenAI client"""
    with patch('Salon.src.models.open_ai.OpenAI') as mock_client_class:
        mock_instance = MagicMock()
        mock_client_class.return_value = mock_instance
        yield mock_instance

@pytest.fixture
def mock_requests_session():
    """Fixture to mock requests.Session"""
    with patch('requests.Session') as mock_session:
        mock_instance = MagicMock()
        mock_session.return_value = mock_instance
        yield mock_instance

@pytest.fixture
def mock_http_adapter():
    """Fixture to mock HTTPAdapter"""
    with patch('requests.adapters.HTTPAdapter') as mock_adapter:
        yield mock_adapter

@pytest.fixture
def mock_retry():
    """Fixture to mock Retry class"""
    with patch('requests.packages.urllib3.util.retry.Retry') as mock_retry_class:
        mock_instance = MagicMock()
        mock_retry_class.return_value = mock_instance
        yield mock_retry_class

class TestOpenAiModel:
    """Test suite for the OpenAiModel class"""

    @patch('Salon.src.models.open_ai.logger')
    def test_init_without_api_key(self, mock_logger):
        """Test initialization without API key raises ValueError"""
        with patch.dict(os.environ, {"BRAID_BASE_URL": "url", "BRAID_SESSION_KEY": "key"}, clear=True):
            with pytest.raises(ValueError) as excinfo:
                with patch('Salon.src.models.open_ai.api_key', None):
                    OpenAiModel()
            
            assert "OPENAI_API_KEY not found" in str(excinfo.value)

    def test_init_without_session_key(self, mock_openai_client):
        """Test initialization without session key logs warning"""
        with patch.dict(os.environ, {"OPENAI_API_KEY": "test_api_key", "BRAID_BASE_URL": "url"}, clear=True):
            with patch('Salon.src.models.open_ai.SESSION_KEY', ''):
                with patch('builtins.print') as mock_print:
                    OpenAiModel()
                    mock_print.assert_called_with("No BRAID_SESSION_KEY found in environment; cannot OpenAiModel.")

    def test_init_without_base_url(self, mock_openai_client):
        """Test initialization without base URL logs warning"""
        with patch.dict(os.environ, {"OPENAI_API_KEY": "test_api_key", "BRAID_SESSION_KEY": "key"}, clear=True):
            with patch('Salon.src.models.open_ai.BASE_URL', ''):
                with patch('builtins.print') as mock_print:
                    OpenAiModel()
                    mock_print.assert_called_with("No BRAID_BASE_URL found in environment; cannot call OpenAiModel.")

    @patch('Salon.src.models.open_ai.logger')
    def test_init_logs_error_without_api_key(self, mock_logger):
        """Test that initialization logs error when API key is missing"""
        with patch.dict(os.environ, {"BRAID_BASE_URL": "url", "BRAID_SESSION_KEY": "key"}, clear=True):
            with pytest.raises(ValueError):
                with patch('Salon.src.models.open_ai.api_key', None):
                    OpenAiModel()
            
            mock_logger.error.assert_called_once_with("OPENAI_API_KEY not found in environment variables.")

    def test_summarise_endpoint_url(self, mock_env_vars):
        """Test that summarise_endpoint_url constructs the correct URL"""
        with patch('Salon.src.models.open_ai.BASE_URL', "https://test-api.example.com/api"):
            with patch('Salon.src.models.open_ai.SESSION_KEY', "test_session_key"):
                expected_url = "https://test-api.example.com/api/Summarize?session=test_session_key"
                assert summarise_endpoint_url() == expected_url

    @patch('Salon.src.models.open_ai.requests.Session')
    @patch('Salon.src.models.open_ai.Retry')
    @patch('Salon.src.models.open_ai.HTTPAdapter')
    @patch('Salon.src.models.open_ai.summarise_endpoint_url')
    def test_generate_content_success(self, mock_endpoint_url, mock_http_adapter_class, mock_retry_class, 
                                     mock_session, mock_env_vars, mock_openai_client):
        """Test successful content generation"""
        # Set up mock endpoint URL
        mock_endpoint_url.return_value = "https://test-api.example.com/api/Summarize?session=test_session_key"
        
        # Set up mock instances
        mock_retry_instance = MagicMock()
        mock_retry_class.return_value = mock_retry_instance
        
        mock_adapter_instance = MagicMock()
        mock_http_adapter_class.return_value = mock_adapter_instance
        
        mock_session_instance = MagicMock()
        mock_session.return_value = mock_session_instance
        
        # Set up mock response
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"summary": "Generated summary text"}
        mock_session_instance.post.return_value = mock_response
        
        model = OpenAiModel()
        result = model.generate_content(
            text="Test text",
            persona="TestPersona",
            persona_intro="Test intro",
            length_in_words=150
        )
        
        # Verify retry configuration
        mock_retry_class.assert_called_once_with(
            total=5,
            backoff_factor=2,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"],
            respect_retry_after_header=True
        )
        
        # Verify adapter was created with retry strategy
        mock_http_adapter_class.assert_called_once_with(max_retries=mock_retry_instance)
        
        # Verify session was configured with adapter
        mock_session_instance.mount.assert_called_once_with("https://", mock_adapter_instance)
        
        # Verify API call
        mock_session_instance.post.assert_called_once_with(
            "https://test-api.example.com/api/Summarize?session=test_session_key",
            json={
                'request': {
                    'persona': 'TestPersona',
                    'text': 'Test intro\n\n---\nTest text\n---',
                    'lengthInWords': 150
                }
            },
            headers=ANY,
            timeout=ANY
        )
        
        # Verify result
        assert result == "Generated summary text"

    @patch('Salon.src.models.open_ai.requests.Session')
    @patch('Salon.src.models.open_ai.logger')
    @patch('Salon.src.models.open_ai.summarise_endpoint_url')
    def test_generate_content_api_error(self, mock_endpoint_url, mock_logger, mock_session, 
                                       mock_env_vars, mock_openai_client):
        """Test handling of API error in content generation"""
        # Set up mock endpoint URL
        mock_endpoint_url.return_value = "https://test-api.example.com/api/Summarize?session=test_session_key"
        
        # Set up mock response
        mock_session_instance = MagicMock()
        mock_session.return_value = mock_session_instance
        
        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_session_instance.post.return_value = mock_response
        
        model = OpenAiModel()
        result = model.generate_content(
            text="Test text",
            persona="TestPersona"
        )
        
        # Verify error was logged
        mock_logger.error.assert_called_with("Braid API returned status code: 500")
        
        # Verify result is None
        assert result is None

    @patch('Salon.src.models.open_ai.requests.Session')
    @patch('Salon.src.models.open_ai.logger')
    @patch('Salon.src.models.open_ai.summarise_endpoint_url')
    def test_generate_content_missing_summary(self, mock_endpoint_url, mock_logger, mock_session, 
                                            mock_env_vars, mock_openai_client):
        """Test handling of missing summary in API response"""
        # Set up mock endpoint URL
        mock_endpoint_url.return_value = "https://test-api.example.com/api/Summarize?session=test_session_key"
        
        # Set up mock response
        mock_session_instance = MagicMock()
        mock_session.return_value = mock_session_instance
        
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"not_summary": "Some other data"}
        mock_session_instance.post.return_value = mock_response
        
        model = OpenAiModel()
        result = model.generate_content(
            text="Test text",
            persona="TestPersona"
        )
        
        # Verify error was logged
        mock_logger.error.assert_called_with("Response JSON did not contain 'summary'.")
        
        # Verify result is None
        assert result is None

    @patch('Salon.src.models.open_ai.requests.Session')
    @patch('Salon.src.models.open_ai.logger')
    @patch('Salon.src.models.open_ai.summarise_endpoint_url')
    def test_generate_content_exception(self, mock_endpoint_url, mock_logger, mock_session, 
                                      mock_env_vars, mock_openai_client):
        """Test handling of exception in content generation"""
        # Set up mock endpoint URL
        mock_endpoint_url.return_value = "https://test-api.example.com/api/Summarize?session=test_session_key"
        
        # Set up mock to raise exception
        mock_session_instance = MagicMock()
        mock_session.return_value = mock_session_instance
        mock_session_instance.post.side_effect = Exception("Test exception")
        
        model = OpenAiModel()
        result = model.generate_content(
            text="Test text",
            persona="TestPersona"
        )
        
        # Verify error was logged
        mock_logger.error.assert_called_with("Error during API call: Test exception")
        
        # Verify result is None
        assert result is None

    @patch('Salon.src.models.open_ai.logger')
    def test_generate_code_success(self, mock_logger, mock_env_vars, mock_openai_client):
        """Test successful code generation"""
        # Set up mock assistant
        mock_assistant = MagicMock()
        mock_assistant.id = "assistant_id"
        mock_openai_client.beta.assistants.create.return_value = mock_assistant
        
        # Set up mock thread
        mock_thread = MagicMock()
        mock_thread.id = "thread_id"
        mock_openai_client.beta.threads.create.return_value = mock_thread
        
        # Set up mock run
        mock_run = MagicMock()
        mock_openai_client.beta.threads.runs.create_and_poll.return_value = mock_run
        
        # Set up mock messages
        mock_message = MagicMock()
        mock_message.role = "assistant"
        mock_message.content = [
            MagicMock(text=MagicMock(value="```python\ndef test_function():\n    return 'Hello World'\n```"))
        ]
        mock_openai_client.beta.threads.messages.list.return_value.data = [mock_message]
        
        model = OpenAiModel()
        result = model.generate_code(
            prompt="Generate a simple Python function",
            instructions="Create a Python function that returns 'Hello World'"
        )
        
        # Verify assistant creation
        mock_openai_client.beta.assistants.create.assert_called_once_with(
            name="API Test Code Generator",
            instructions="Create a Python function that returns 'Hello World'",
            tools=[{"type": "code_interpreter"}],
            model="gpt-4o"
        )
        
        # Verify thread creation
        mock_openai_client.beta.threads.create.assert_called_once()
        
        # Verify message creation
        mock_openai_client.beta.threads.messages.create.assert_called_once_with(
            thread_id="thread_id",
            role="user",
            content="Generate a simple Python function"
        )
        
        # Verify run creation
        mock_openai_client.beta.threads.runs.create_and_poll.assert_called_once_with(
            thread_id="thread_id",
            assistant_id="assistant_id",
            instructions="Return only the complete Python code in triple backticks, no additional commentary."
        )
        
        # Verify messages retrieval
        mock_openai_client.beta.threads.messages.list.assert_called_once_with(
            thread_id="thread_id"
        )
        
        # Verify result
        assert result == "```python\ndef test_function():\n    return 'Hello World'\n```"

    @patch('Salon.src.models.open_ai.logger')
    def test_generate_code_exception(self, mock_logger, mock_env_vars, mock_openai_client):
        """Test handling of exception in code generation"""
        # Set up mock to raise exception
        mock_openai_client.beta.assistants.create.side_effect = Exception("Test exception")
        
        model = OpenAiModel()
        result = model.generate_code(
            prompt="Generate a simple Python function",
            instructions="Create a Python function that returns 'Hello World'"
        )
        
        # Verify error was logged
        mock_logger.error.assert_called_once_with("Error during code generation: Test exception")
        
        # Verify result is None
        assert result is None

    def test_generate_code_empty_response(self, mock_env_vars, mock_openai_client):
        """Test handling of empty response in code generation"""
        # Set up mock assistant and thread
        mock_assistant = MagicMock()
        mock_thread = MagicMock()
        mock_openai_client.beta.assistants.create.return_value = mock_assistant
        mock_openai_client.beta.threads.create.return_value = mock_thread
        
        # Set up empty messages list
        mock_openai_client.beta.threads.messages.list.return_value.data = []
        
        model = OpenAiModel()
        result = model.generate_code(
            prompt="Generate a simple Python function",
            instructions="Create a Python function that returns 'Hello World'"
        )
        
        # Verify result is an empty string
        assert result == ""
