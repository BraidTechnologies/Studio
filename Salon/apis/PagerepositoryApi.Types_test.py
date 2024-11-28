import pytest
import requests
from unittest.mock import patch

# Base URL for the API
BASE_URL = "http://api.example.com"

# Sample data for testing
sample_successful_html = "<html><body>Sample Page</body></html>"

def test_get_page_success():
    url = f"{BASE_URL}/functions"
    params = {
        'request': {"dummy_param": "SampleValue"} 
    }

    # Mocking the requests.get call to simulate a successful response
    with patch('requests.get') as mock_get:
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {"html": sample_successful_html}

        response = requests.get(url, params=params)
        assert response.status_code == 200
        assert "html" in response.json()
        assert response.json()["html"] == sample_successful_html

def test_get_page_missing_param():
    url = f"{BASE_URL}/functions"

    # Missing required 'request' parameter
    with patch('requests.get') as mock_get:
        mock_get.return_value.status_code = 400
        mock_get.return_value.json.return_value = "Bad Request: Missing required parameters"

        response = requests.get(url)
        assert response.status_code == 400
        assert response.json() == "Bad Request: Missing required parameters"