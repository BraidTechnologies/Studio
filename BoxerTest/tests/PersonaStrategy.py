# Copyright (c) 2024 Braid Technologies Ltd

from abc import ABC, abstractmethod
from typing import List, Any
import logging
from openai import AzureOpenAI
import os
import sys

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from common.ApiConfiguration import ApiConfiguration
from common.common_functions import get_embedding
from openai import AzureOpenAI, OpenAIError, BadRequestError, APIConnectionError
from BoxerDataTest_v3 import call_openai_chat, call_gemini_chat


# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants for Persona Prompts
DEVELOPER_PROMPT = "You are a programmer interested in the details of writing applications that use an LLM in Python."
TESTER_PROMPT = "You are a tester who wants to know how to assess and ensure quality in an application that uses LLM technology."
BUSINESS_ANALYST_PROMPT = "You are a business analyst interested in how people can apply LLM technology to solve business problems."

class PersonaStrategy(ABC):
    @abstractmethod
    def generate_questions(self, client: Any, config: ApiConfiguration, num_questions: int, logger: logging.Logger) -> List[str]:
        pass  # This is an abstract method to be implemented by subclasses

    def _generate_questions(self, client: Any, config: ApiConfiguration, prompt: str, num_questions: int, logger: logging.Logger) -> List[str]:
        
        # Conditional logic to switch between Azure and Gemini based on client input
        messages = [
            {"role": "system", "content": prompt},
            {"role": "user", "content": f"Generate {num_questions} questions about this topic."},
        ]
        
        if config.apiType == "Azure":
            logger.info("Generating questions with the following prompt using ChatGPT 4.0 (Azure): %s", prompt)
            response = call_openai_chat(client, messages, config, logger)
        elif config.apiType == "Gemini":
            logger.info("Generating questions with the following prompt using Gemini: %s", prompt)
            response = call_gemini_chat(client, messages, config, logger)
        else:
            raise ValueError("Unknown API type")

        questions = response.split('\n')
        return [q for q in questions if q.strip()]

# Define specific personas
class DeveloperPersonaStrategy(PersonaStrategy):
    def generate_questions(self, client: Any, config: ApiConfiguration, num_questions: int, logger: logging.Logger) -> List[str]:
        return self._generate_questions(client, config, DEVELOPER_PROMPT, num_questions, logger)

class TesterPersonaStrategy(PersonaStrategy):
    def generate_questions(self, client: Any, config: ApiConfiguration, num_questions: int, logger: logging.Logger) -> List[str]:
        return self._generate_questions(client, config, TESTER_PROMPT, num_questions, logger)

class BusinessAnalystPersonaStrategy(PersonaStrategy):
    def generate_questions(self, client: Any, config: ApiConfiguration, num_questions: int, logger: logging.Logger) -> List[str]:
        return self._generate_questions(client, config, BUSINESS_ANALYST_PROMPT, num_questions, logger)

