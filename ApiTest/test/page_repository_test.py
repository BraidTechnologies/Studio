import pytest
import requests
import os

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['SessionKey']

# Construct the full URL to the /chunk endpoint
get_page_url = f"{BASE_URL}/getpage?session=" + SESSION_KEY

# Sample data for testing
sample_successful_html = "<html><body>Sample Page</body></html>"

def test_get_page_success():
    url = get_page_url+ '&id=769686001'

    response = requests.get(url)
    assert response.status_code == 200

def test_get_page_missing_param():
    url = get_page_url

    # Missing required 'id' parameter
    response = requests.get(url)
    assert response.status_code == 404