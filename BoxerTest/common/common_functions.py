# Copyright (c) 2024 Braid Technologies Ltd
# Standard Library Imports
import logging
import os
import json
import sys
from logging import Logger
from typing import List, Dict, Any
import numpy as np
from numpy.linalg import norm
import datetime
import google.generativeai as genai
from google.generativeai import types  # For generation config, etc.

# Third-Party Packages
from openai import AzureOpenAI, OpenAIError, BadRequestError, APIConnectionError
from tenacity import retry, wait_random_exponential, stop_after_attempt, retry_if_not_exception_type

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Local Modules
from common.ApiConfiguration import ApiConfiguration

# Constants
SIMILARITY_THRESHOLD = 0.8
MAX_RETRIES = 15
NUM_QUESTIONS = 100

OPENAI_PERSONA_PROMPT =  "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'."
ENRICHMENT_PROMPT = "You will be provided with a question about building applications that use generative AI technology. Write a 50 word summary of an article that would be a great answer to the question. Consider enriching the question with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n"
FOLLOW_UP_PROMPT =  "You will be provided with a summary of an article about building applications that use generative AI technology. Write a question of no more than 10 words that a reader might ask as a follow up to reading the article."

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from common.ApiConfiguration import ApiConfiguration

config = ApiConfiguration()

def ensure_directory_exists(directory):
    """
    Checks if the directory at the given destination exists.
    If it does not exist, creates the directory.

    Parameters:
    directory (str): The path to the directory.
    """
    # Use os.path.join() to handle path construction across different platforms
    if not os.path.exists(directory):
        os.makedirs(directory)
        #print(f"Directory '{directory}' created.")  #  can remove or comment out this print statement for production
    else:
        # print(f"Directory '{directory}' already exists.")
        pass

# Construct the path using os.path.join() for cross-platform compatibility
HTML_DESTINATION_DIR = os.path.join("data", "web")
ensure_directory_exists(HTML_DESTINATION_DIR)

def get_embedding(text : str, client : AzureOpenAI, config : ApiConfiguration):

   text = text.replace("\n", " ")
   response = client.embeddings.create(input = [text], 
                                   model=config.azureEmbedDeploymentName,
                                   timeout=config.openAiRequestTimeout)
   
   return response.data[0].embedding

# Function to call the OpenAI API with retry logic
@retry(wait=wait_random_exponential(min=5, max=15), stop=stop_after_attempt(MAX_RETRIES), retry=retry_if_not_exception_type(BadRequestError))
def call_openai_chat(client: AzureOpenAI, messages: List[Dict[str, str]], config: ApiConfiguration, logger: logging.Logger) -> str:
    """
    Retries the OpenAI chat API call with exponential backoff and retry logic.

    :param client: An instance of the AzureOpenAI class.
    :type client: AzureOpenAI
    :param messages: A list of dictionaries representing the messages to be sent to the API.
    :type messages: List[Dict[str, str]]
    :param config: An instance of the ApiConfiguration class.
    :type config: ApiConfiguration
    :param logger: An instance of the logging.Logger class.
    :type logger: logging.Logger
    :return: The content of the first choice in the API response.
    :rtype: str
    :raises RuntimeError: If the finish reason in the API response is not 'stop', 'length', or an empty string.
    :raises OpenAIError: If there is an error with the OpenAI API.
    :raises APIConnectionError: If there is an error with the API connection.
    """
    try:
        response = client.chat.completions.create(
            model=config.azureDeploymentName,
            messages=messages,
            temperature=0.7,
            max_tokens=config.maxTokens,
            top_p=0.0,
            frequency_penalty=0,
            presence_penalty=0,
            timeout=config.openAiRequestTimeout,
        )
        content = response.choices[0].message.content
        finish_reason = response.choices[0].finish_reason

        if finish_reason not in {"stop", "length", ""}:
            logger.warning("Unexpected stop reason: %s", finish_reason)
            logger.warning("Content: %s", content)
            logger.warning("Consider increasing max tokens and retrying.")
            raise RuntimeError("Unexpected finish reason in API response.")

        return content

    except (OpenAIError, APIConnectionError) as e:
        logger.error(f"Error: {e}")
        raise

def call_gemini_chat(client: genai.GenerativeModel, messages: List[Dict], config: ApiConfiguration, logger: logging.Logger) -> str:
    """
    Calls the Gemini API for chat completion.

    Args:
        client (GenerativeModel): The Gemini client instance.
        messages (List[Dict]): The messages to be sent to the chat.
        config (ApiConfiguration): The API configuration instance.
        logger (Logger): The logger instance.

    Returns:
        str: The response content from the Gemini API.

    Raises:
        Exception: If there is any error with the Gemini API.
    """
    try:
        # Initialize chat conversation if it's the first message
        history = [{"role": msg['role'], "parts": msg['content']} for msg in messages]

        chat = client.start_chat(history=history)
        last_message = messages[-1]['content']
        response = chat.send_message(last_message)

        logger.info(f"Gemini response: {response.text}")
        return response.text

    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        raise

