import os
import pytest
from unittest.mock import patch, MagicMock, ANY
import logging
from google import genai
import requests

from Salon.src.models.gemini import GeminiModel

# Test fixtures
@pytest.fixture
def mock_env_vars():
    """Fixture to set up environment variables for testing"""
    with patch.dict(os.environ, {"GOOGLE_DEVELOPER_API_KEY": "test_api_key"}):
        yield

@pytest.fixture
def mock_env_vars_with_proxy():
    """Fixture to set up environment variables with proxy for testing"""
    with patch.dict(os.environ, {
        "GOOGLE_DEVELOPER_API_KEY": "test_api_key",
        "HTTPS_PROXY": "http://proxy.example.com:8080"
    }):
        yield

@pytest.fixture
def mock_genai_client():
    """Fixture to mock the genai.Client"""
    with patch('google.genai.Client') as mock_client:
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
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
    """Fixture to mock Retry class and its constructor"""
    with patch('requests.packages.urllib3.util.retry.Retry') as mock_retry_class:
        # Create a mock instance that will be returned when Retry is instantiated
        mock_retry_instance = MagicMock()
        mock_retry_class.return_value = mock_retry_instance
        yield mock_retry_class

class TestGeminiModel:
    """Test suite for the GeminiModel class"""

    def test_init_with_api_key(self, mock_env_vars, mock_genai_client):
        """Test initialization with API key"""
        model = GeminiModel()
        
        # Verify client was initialized with correct parameters
        genai.Client.assert_called_once_with(api_key="test_api_key")
        assert model.model_name == 'gemini-1.5-pro'

    def test_init_with_api_key_and_proxy(self, mock_env_vars_with_proxy, mock_genai_client):
        """Test initialization with API key and proxy"""
        model = GeminiModel()
        
        # Verify client was initialized with correct parameters including proxy
        genai.Client.assert_called_once_with(
            api_key="test_api_key",
            transport='rest',
            proxy='http://proxy.example.com:8080'
        )
        assert model.model_name == 'gemini-1.5-pro'

    def test_init_without_api_key(self):
        """Test initialization without API key raises ValueError"""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError) as excinfo:
                GeminiModel()
            
            assert "GOOGLE_DEVELOPER_API_KEY not found" in str(excinfo.value)

    @patch('logging.Logger.error')
    def test_init_logs_error_without_api_key(self, mock_logger):
        """Test that initialization logs error when API key is missing"""
        with patch.dict(os.environ, {}, clear=True):
            with pytest.raises(ValueError):
                GeminiModel()
            
            mock_logger.assert_called_once_with(
                "GOOGLE_DEVELOPER_API_KEY is not set. Local Gemini calls may fail."
            )

    @patch('Salon.src.models.gemini.requests.Session')
    @patch('Salon.src.models.gemini.Retry')
    @patch('Salon.src.models.gemini.HTTPAdapter')
    def test_retry_configuration(self, mock_http_adapter_class, mock_retry_class, mock_session, 
                               mock_env_vars, mock_genai_client):
        """Test that retry configuration is set up correctly"""
        # Set up mock instances
        mock_retry_instance = MagicMock()
        mock_retry_class.return_value = mock_retry_instance
        
        mock_adapter_instance = MagicMock()
        mock_http_adapter_class.return_value = mock_adapter_instance
        
        mock_session_instance = MagicMock()
        mock_session.return_value = mock_session_instance
        
        # Set up mock response
        mock_response = MagicMock()
        mock_response.text = "Generated content"
        mock_genai_client.models.generate_content.return_value = mock_response
        
        model = GeminiModel()
        
        # Call generate_content to trigger retry setup
        model.generate_content(
            text="Test prompt",
            persona="TestPersona",
            max_retries=5,
            retry_delay_seconds=3
        )
        
        # Verify Retry was configured correctly
        mock_retry_class.assert_called_once_with(
            total=5,
            backoff_factor=3,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"],
            respect_retry_after_header=True
        )
        
        # Verify HTTPAdapter was created with the retry strategy
        mock_http_adapter_class.assert_called_once_with(max_retries=mock_retry_instance)
        
        # Verify session was configured with the adapter
        mock_session_instance.mount.assert_called_once_with(
            "https://", mock_adapter_instance
        )

    @patch('Salon.src.models.gemini.requests.Session')
    @patch('Salon.src.models.gemini.Retry')
    @patch('Salon.src.models.gemini.HTTPAdapter')
    def test_default_parameters(self, mock_http_adapter_class, mock_retry_class, mock_session,
                              mock_env_vars, mock_genai_client):
        """Test that default parameters are used when not specified"""
        # Set up mock instances
        mock_retry_instance = MagicMock()
        mock_retry_class.return_value = mock_retry_instance
        
        mock_adapter_instance = MagicMock()
        mock_http_adapter_class.return_value = mock_adapter_instance
        
        mock_session_instance = MagicMock()
        mock_session.return_value = mock_session_instance
        
        # Set up mock response
        mock_response = MagicMock()
        mock_response.text = "Generated content"
        mock_genai_client.models.generate_content.return_value = mock_response
        
        model = GeminiModel()
        result = model.generate_content(
            text="Test prompt",
            persona="TestPersona"
        )
        
        # Verify the retry configuration used default values
        mock_retry_class.assert_called_once_with(
            total=3,  # Default max_retries
            backoff_factor=2,  # Default retry_delay_seconds
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"],
            respect_retry_after_header=True
        )
        
        # Verify the prompt includes default length
        called_args = mock_genai_client.models.generate_content.call_args[1]['contents']
        assert "Target length: ~100 words" in called_args  # Default length_in_words
