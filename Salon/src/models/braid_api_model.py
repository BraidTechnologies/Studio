# braid_api_model.py
import os
import logging
from openai import OpenAI
from .base import AIModel
import requests
from typing import Optional
import time
from CommonPy.src.request_utilities import request_timeout
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Global OpenAI client
client = OpenAI()

api_key = os.environ.get("OPENAI_API_KEY")
BASE_URL = os.environ.get("BRAID_BASE_URL",  'https://braid-api.azurewebsites.net/api')
SESSION_KEY = os.environ.get('BRAID_SESSION_KEY', '')

def summarise_endpoint_url() -> str:
    """
    Construct the full URL for the summary endpoint
    """
    return f"{BASE_URL}/Summarize?session={SESSION_KEY}"

class BraidApiModel(AIModel):
    """
    Class for interacting with the OpenAI model.
    """
    def __init__(self):
        """
        Initializes the OpenAI client with API key from environment variables.
        """
        if not api_key:
            logger.error("OPENAI_API_KEY not found in environment variables.")
            raise ValueError("OPENAI_API_KEY not found in environment variables.")
        self.client = OpenAI(api_key=api_key)
       
        if not SESSION_KEY:
            print("No BRAID_SESSION_KEY found in environment; cannot BraidApiModel.")
            return None
       
        if not BASE_URL:
            print("No BRAID_BASE_URL found in environment; cannot call BraidApiModel.")
            return None
    
    def generate_content(
            self,
            text: str,
            persona: str,
            persona_intro: str = "",
            length_in_words: int = 100,
            max_retries: int = 3,
            retry_delay_seconds: int = 2
    ) -> Optional[str]:
        
        # Configure retry strategy
        retry_strategy = Retry(
            total=5,
            backoff_factor=2,  
            status_forcelist=[429, 500, 502, 503, 504],
            allowed_methods=["POST"],  # Explicitly allow POST retries
            respect_retry_after_header=True  # Honor server's retry-after header
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        session = requests.Session()
        session.mount("https://", adapter)

        headers = {
            'User-Agent': 'Mozilla/5.0',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        prompt = (
            f"{persona_intro}\n\n"
            f"---\n{text}\n---"
        )

        payload = {
            'persona': persona,
            'text': prompt,
            'lengthInWords': length_in_words
        }
        wrapped = {'request': payload}

        try:
            response = session.post(
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
                    logger.error("Response JSON did not contain 'summary'.")
                    return None
            else:
                logger.error(f"Braid API returned status code: {response.status_code}")
                return None

        except Exception as e:
            logger.error(f"Error during API call: {e}")
            return None
    
    def generate_code(self, prompt: str, instructions: str) -> str:
        """
        Generates code using the OpenAI model.

        Args:
            prompt (str): The API data snippet in JSON or YAML format.
            instructions (str): Baseline instructions for the OpenAI assistant.

        Returns:
            str: The generated code.
        """
        try:
            assistant = self.client.beta.assistants.create(
                name="API Test Code Generator",
                instructions=instructions,
                tools=[{"type": "code_interpreter"}],
                model="gpt-4o",
            )

            thread = self.client.beta.threads.create()

            self.client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=prompt
            )

            run = self.client.beta.threads.runs.create_and_poll(
                thread_id=thread.id,
                assistant_id=assistant.id,
                instructions="Return only the complete Python code in triple backticks, no additional commentary."
            )

            messages = self.client.beta.threads.messages.list(thread_id=thread.id).data

            generated_content = "\n".join(
                text_block.text.value
                for msg in messages
                if msg.role == "assistant" and hasattr(msg, "content")
                for text_block in msg.content
                if hasattr(text_block, "text") and text_block.text.value
            )

            return generated_content

        except Exception as e:
            logger.error(f"Error during code generation: {e}")
            return None