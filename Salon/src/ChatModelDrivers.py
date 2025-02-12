"""
Factory module for creating chat model drivers based on specified model types.
Supports different model implementations like Braid API and Local Gemini.
"""

from enum import Enum
import os
import requests
from CommonPy.src.request_utilities import request_timeout
import google.generativeai as genai


class SummariseModelType(Enum):
    """
    Enum representing different types of summarisation models.
    """
    BRAID_API = "braid_api"
    LOCAL_GEMINI = "local_gemini"


class SalonModelDriver:
    """
    Abstract base class for all summarisation model drivers.
    """

    def __init__(self, model_type: SummariseModelType):
        self.model_type = model_type

    def summarise(self, code_to_summarise: str) -> str:
        """
        Abstract method to summarise text.
        """
        raise NotImplementedError("Method 'summarise' is not implemented")

    @staticmethod
    def create(model_type: SummariseModelType) -> 'SalonModelDriver':
        """
        Factory method to create a new SalonModelDriver instance based on the specified model type.
        """
        if model_type == SummariseModelType.BRAID_API:
            return BraidApiModelDriver()
        elif model_type == SummariseModelType.LOCAL_GEMINI:
            return LocalGeminiModelDriver()
        else:
            raise ValueError(f"Unknown model type: {model_type}")


# Configure the base URL for the API.
BASE_URL = 'https://braid-api.azurewebsites.net/api'
# BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']


def summarise_endpoint_url():
    """Construct the full URL for the summary endpoint"""
    return f'{BASE_URL}/Summarize?session=' + SESSION_KEY


class BraidApiModelDriver(SalonModelDriver):
    """
    Concrete implementation of SalonModelDriver for the Braid API.
    """

    def __init__(self):
        super().__init__(SummariseModelType.BRAID_API)

    def summarise(self, code_to_summarise: str) -> str:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        payload = {
            'persona': 'CodeSummariser',
            'text': code_to_summarise,
            'lengthInWords': 100
        }
        wrapped = {
            'request': payload
        }
        response = requests.post(summarise_endpoint_url(),
                                 json=wrapped, headers=headers, timeout=request_timeout)
        if response.status_code == 200:
            data = response.json()
            if 'summary' in data:
                return data['summary']

        return None


class LocalGeminiModelDriver(SalonModelDriver):
    """
    Concrete implementation of SalonModelDriver for local Gemini.
    """

    def __init__(self):
        super().__init__(SummariseModelType.LOCAL_GEMINI)
        genai.configure(api_key=os.environ['GOOGLE_DEVELOPER_API_KEY'])
        self.model = genai.GenerativeModel('gemini-pro')

    def summarise(self, code_to_summarise: str) -> str:

        prompt = f"""You are an AI asistant that summarises code to help explain the code to new developers. 
        Please summarise the following code in 100 words. Make each distinct point a separate paragraph. 
        List the important classes or functions in the module.

        ##CODE##
        {code_to_summarise}"""

        response = self.model.generate_content(prompt)
        if response.text:
            return response.text
        return None
