'''
Test module for the summarization API endpoint.

This module contains test cases for the text summarization API endpoint,
covering various scenarios including:
- Valid summarization requests with specified length
- Requests without length specification
- Invalid requests with missing text
- Empty requests

The tests verify both successful responses and proper error handling.
'''

import pytest
import requests
import os

from CommonPy.src.request_utilities import request_timeout

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['SessionKey']

survey_text = "The course meets my overall expectations:'Agree'" + \
   "The duration and pacing of the course were appropriate:'Agree'" + \
   "The “AI Ethics” session provided valuable insights that I can apply in real-world scenarios. :'Strongly agree'" + \
   ". The “Design Thinking” sessions enhanced my problem-solving and innovation skills.:'Agree'" + \
   "The “Achieving Personal High Performance” session offered practical techniques to improve my productivity and focus.:'Strongly agree'" + \
   "The Python coursework helped build a strong foundation in programming for AI applications.:'Neutral'" + \
   "The courses on Large Language Models (LLMs) and Generative AI improved my understanding of these technologies and their potential uses. :'Agree'" + \
   "I feel confident the skills I'm building will help my career at Vodafone :'Agree'" + \
   "The practical exercises, examples, and group activities were engaging and helped reinforce key concepts. :'Strongly agree'" + \
   "What was the most valuable part of this course for you, and why:'Personal Performance was really good for 3 out of the 4 sessions. Last session did not hit home quite as much a the others. AI Ethics provided great sessions to enhance thinking around this subject'" + \
   "What could be improved to enhance the learning experience for future participants?:'For a complete novice, the Python and Udacity training could have been made better with some live support for troubleshooting. '" + \
   "What changes would you like to see for the “Gateway Projects” build phase?:'Continued support from PO's, SMe's and Braid team during build phase'"


def summarise_endpoint_url():
    # Construct the full URL for the summary endpoint
    return f'{BASE_URL}/Summarize?session=' + SESSION_KEY


def test_valid_summarise_request():
    # Test case for a valid summarization request
    payload = {
        'text': 'This is a text that needs to be summarized and in order for this to work it needs to be over the minumum text length.',
        'lengthInWords': 10
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(), json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    data = response.json()
    assert 'summary' in data
    assert isinstance(data['summary'], str)
    # Further checks can be added based on expected summary content

def test_valid_summarise_survey_request():
    # Test case for a valid summarization request
    payload = {
        'promptPersona': 'SurveySummariser',
        'text': survey_text,
        'lengthInWords': 100
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(), json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    data = response.json()
    assert 'summary' in data
    assert isinstance(data['summary'], str)
    print(data['summary'])
    
def test_summarise_request_without_length():
    # Test case with the text but no lengthInWords
    payload = {
        'text': 'This text needs summarization but without specifying the length.'
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(),
                             json=wrapped, timeout=request_timeout)
    assert response.status_code == 200
    data = response.json()
    assert 'summary' in data
    assert isinstance(data['summary'], str)


def test_summarise_request_missing_text():
    # This should fail because 'text' is a required field
    payload = {
        'lengthInWords': 10
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(),
                             json=wrapped, timeout=request_timeout)
    assert response.status_code == 400  # Assuming the API returns a 400 Bad Request
    # Additional logic to verify error message can be added here


def test_empty_summarise_request():
    # Test case with an empty payload
    payload = {}
    response = requests.post(summarise_endpoint_url(),
                             json=payload, timeout=request_timeout)
    assert response.status_code == 500  # Empty request should fail


if __name__ == '__main__':
    pytest.main()
