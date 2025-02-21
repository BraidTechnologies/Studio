# chat_model_driver.py
"""
Factory module for creating chat model drivers based on specified model types.
Supports different model implementations like Braid API and Local Gemini.
"""

from enum import Enum
import os
import requests
from typing import Optional
import time

import google.generativeai as genai
from CommonPy.src.request_utilities import request_timeout

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

    def __init__(self, model_type: SummariseModelType) -> None:
        self.model_type: SummariseModelType = model_type

    def summarise(
        self,
        text_to_summarise: str,
        persona: str = "CodeSummariser",
        length_in_words: int = 100
    ) -> Optional[str]:
        """
        Summarise text with a given persona and approximate desired length.
        Subclasses should implement this.
        """
        raise NotImplementedError("Method 'summarise' is not implemented")

    @staticmethod
    def create(model_type: SummariseModelType) -> 'SalonModelDriver':
        """
        Factory method to create a new SalonModelDriver instance
        based on the specified model type.
        """
        if model_type == SummariseModelType.BRAID_API:
            return BraidApiModelDriver()
        elif model_type == SummariseModelType.LOCAL_GEMINI:
            return LocalGeminiModelDriver()
        else:
            raise ValueError(f"Unknown model type: {model_type}")


# Configure the base URL for the Braid API
BASE_URL = 'https://braid-api.azurewebsites.net/api'

# Session key from environment (for Braid API)
SESSION_KEY = os.environ.get('BRAID_SESSION_KEY', '')

def summarise_endpoint_url() -> str:
    """
    Construct the full URL for the summary endpoint
    """
    return f"{BASE_URL}/Summarize?session={SESSION_KEY}"

class BraidApiModelDriver(SalonModelDriver):
    """
    Concrete implementation of SalonModelDriver for the Braid API.
    """

    def __init__(self) -> None:
        super().__init__(SummariseModelType.BRAID_API)

    def summarise(
        self,
        text_to_summarise: str,
        persona: str = "CodeSummariser",
        length_in_words: int = 100
    ) -> Optional[str]:
        """
        Summarise text using the Braid API with the specified persona
        (e.g. CodeSummariser, C4Diagrammer).
        """
        if not SESSION_KEY:
            print("No BRAID_SESSION_KEY found in environment; cannot call summarise endpoint.")
            return None

        headers = {
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        payload = {
            'persona': persona,
            'text': text_to_summarise,
            'lengthInWords': length_in_words
        }
        wrapped = {'request': payload}

        max_retries = 3
        retry_delay_seconds = 2  # Simple retry delay

        for attempt in range(1, max_retries + 1):
            try:
                response = requests.post(
                    summarise_endpoint_url(),
                    json=wrapped,
                    headers=headers,
                    timeout=request_timeout
                )

                if response.status_code == 200:
                    data = response.json()
                    if 'summary' in data:
                        return data['summary']
                    else:
                        print("Response JSON did not contain 'summary'.")
                else:
                    print(f"Braid API returned status code: {response.status_code}")

                # If we didn't explicitly return by now, let's break or retry.
                # In case of a 4xx or unexpected status code, you might decide not to retry.
                # But here, we do a generic retry if status != 200:
                if attempt < max_retries:
                    print(f"Attempt {attempt} failed. Retrying in {retry_delay_seconds}s...")
                    time.sleep(retry_delay_seconds)
                else:
                    print("Max retries reached. Returning None.")
                    return None

            except Exception as e:
                if attempt < max_retries:
                    print(f"Error while calling Braid API on attempt {attempt}: {e}")
                    print(f"Retrying in {retry_delay_seconds}s...")
                    time.sleep(retry_delay_seconds)
                else:
                    print(f"Error after {max_retries} attempts. Returning None. Last error: {e}")
                    return None

        return None


class LocalGeminiModelDriver(SalonModelDriver):
    """
    Concrete implementation of SalonModelDriver for local Gemini (PaLM).
    """

    def __init__(self) -> None:
        super().__init__(SummariseModelType.LOCAL_GEMINI)

        # Attempt to configure generative AI
        dev_key = os.environ.get('GOOGLE_DEVELOPER_API_KEY', None)
        if dev_key:
            genai.configure(api_key=dev_key)
        else:
            print("Warning: GOOGLE_DEVELOPER_API_KEY is not set. Local Gemini calls may fail.")

        # Model name (for example, 'gemini-pro')
        self.model = genai.GenerativeModel('gemini-pro')

    def summarise(
        self,
        text_to_summarise: str,
        persona: str = "CodeSummariser",
        length_in_words: int = 100
    ) -> Optional[str]:
        """
        Summarise text using the local Gemini model.
        Persona instructions are embedded in the prompt as needed
        (e.g. 'C4Diagrammer' if generating a diagram).
        """
        if persona.lower() == "c4diagrammer":
            persona_intro = (
                "You are an AI assistant that generates C4 diagrams (in mermaid syntax) "
                "from software descriptions."
            )
        else:
            persona_intro = (
                "You are an AI assistant that summarises code to help explain it to new developers."
            )

        prompt = (
            f"{persona_intro}\n\n"
            f"Please summarise or transform the following text. "
            f"Target length: ~{length_in_words} words.\n\n"
            f"---\n{text_to_summarise}\n---"
        )

        max_retries = 3
        retry_delay_seconds = 2

        for attempt in range(1, max_retries + 1):
            try:
                response = self.model.generate_content(prompt)
                if response and response.text:
                    return response.text

                # If there's no response or empty text, treat it as a failure to trigger a retry
                if attempt < max_retries:
                    print(f"LocalGeminiModelDriver: Attempt {attempt} returned no content. "
                          f"Retrying in {retry_delay_seconds}s...")
                    time.sleep(retry_delay_seconds)
                else:
                    print("Max retries reached for LocalGeminiModelDriver. Returning None.")
                    return None

            except Exception as e:
                if attempt < max_retries:
                    print(f"LocalGeminiModelDriver error on attempt {attempt}: {e}")
                    print(f"Retrying in {retry_delay_seconds}s...")
                    time.sleep(retry_delay_seconds)
                else:
                    print(f"Error after {max_retries} attempts in LocalGeminiModelDriver. "
                          f"Last error: {e}")
                    return None

        return None
