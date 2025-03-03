# gemini.py

"""
Module for handling Gemini model interactions with abstracted content generation.
"""

import os
import time
from typing import Optional
from google import genai
from .base import AIModel
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
import logging

# Configure logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class GeminiModel(AIModel):
    """
    Class for interacting with the local Gemini model, with abstracted content generation.
    """

    def __init__(self) -> None:
        # Attempt to configure generative AI
        dev_key = os.environ.get('GOOGLE_DEVELOPER_API_KEY', None)
        proxy = os.environ.get('HTTPS_PROXY', None)  # Get proxy from environment variable
        
        if dev_key:
            # Configure client with proxy if available
            client_options = {}
            if proxy:
                client_options['transport'] = 'rest'  # Use REST transport for proxy support
                client_options['proxy'] = proxy
            
            self.client = genai.Client(
                api_key=dev_key,
                **client_options
            )
        else:
            logger.error("GOOGLE_DEVELOPER_API_KEY is not set. Local Gemini calls may fail.")
            raise ValueError("GOOGLE_DEVELOPER_API_KEY not found in environment variables.")
        
        self.model_name = 'gemini-1.5-pro'

    def generate_content(
            self,
            text: str,
            persona: str,
            persona_intro: str = "",
            length_in_words: int = 100,
            max_retries: int = 3,
            retry_delay_seconds: int = 2
    ) -> Optional[str]:
        """
        Generate content using the Gemini model with a caller-defined persona and prompt.
        """
        # Configure retry strategy
        retry_strategy = Retry(
            total=max_retries,
            backoff_factor=retry_delay_seconds,
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"],  # Explicitly allow POST retries
            respect_retry_after_header=True  # Honor server's retry-after header
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session = requests.Session()
        session.mount("https://", adapter)

        prompt = (
            f"{persona_intro}\n\n"
            f"Target length: ~{length_in_words} words.\n\n"
            f"---\n{text}\n---"
        )

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            if response and response.text:
                return response.text
            else:
                logger.error("Gemini API returned no content")
                return None

        except Exception as e:
            logger.error(f"Error during Gemini API call: {e}")
            return None