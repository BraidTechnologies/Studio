# gemini.py

"""
Module for handling Gemini model interactions with abstracted content generation.
"""

import os
import time
from typing import Optional
from google import genai
from .base import AIModel

class GeminiModel(AIModel):
    """
    Class for interacting with the local Gemini model, with abstracted content generation.
    """

    def __init__(self) -> None:
        # Attempt to configure generative AI
        dev_key = os.environ.get('GOOGLE_DEVELOPER_API_KEY', None)
        if dev_key:
            self.client = genai.Client(api_key=dev_key)
        else:
            print("Warning: GOOGLE_DEVELOPER_API_KEY is not set. Local Gemini calls may fail.")
        
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
        prompt = (
            f"{persona_intro}\n\n"
            f"Target length: ~{length_in_words} words.\n\n"
            f"---\n{text}\n---"
        )

        for attempt in range(1, max_retries + 1):
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                if response and response.text:
                    return response.text

                # If there's no response or empty text, treat it as a failure to trigger a retry
                if attempt < max_retries:
                    print(f"GeminiModel: Attempt {attempt} returned no content. "
                          f"Retrying in {retry_delay_seconds}s...")
                    time.sleep(retry_delay_seconds)
                else:
                    print("Max retries reached for GeminiModel. Returning None.")
                    return None
            except Exception as e:
                if attempt < max_retries:
                    print(f"GeminiModel error on attempt {attempt}: {e}")
                    print(f"Retrying in {retry_delay_seconds}s...")
                    time.sleep(retry_delay_seconds)
                else:
                    print(f"Error after {max_retries} attempts in GeminiModel. "
                          f"Last error: {e}")
                    return None
        return None