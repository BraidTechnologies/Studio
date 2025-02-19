''' Tests for the open AI char driver '''
# Copyright (c) 2024, 2025 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.model_driver_base import Model, ModelProvider, ChatPrompt
from src.model_driver_factories import get_default_chat_model_driver, get_chat_model_driver

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_chat_model_basic_response():
    ''' Test that the chat model responds appropriately to a basic greeting '''
    model = get_default_chat_model_driver()
    prompt = ChatPrompt()
    prompt.user_prompt = "Hi"
    response = model.generate_response(prompt)
    
    # Check if response contains expected greeting (case insensitive)
    response_lower = response.lower()
    assert any(greeting in response_lower for greeting in ['hi', 'hello']), \
        f"Expected greeting not found in response: {response}"


def test_chat_model_mutated_input_same_response():
    ''' Test that the chat model responds appropriately to a basic greeting '''
    model = get_default_chat_model_driver()
    prompt = ChatPrompt()
    prompt.user_prompt = "Hello"
    response = model.generate_response(prompt)
    
    # Check if response contains expected greeting (case insensitive)
    response_lower = response.lower()
    assert any(greeting in response_lower for greeting in ['hi', 'hello']), \
        f"Expected greeting not found in response: {response}"
    
def test_chat_model_mutated_input_different_response():
    ''' Test that the chat model responds appropriately to a basic greeting '''
    model = get_default_chat_model_driver()
    prompt = ChatPrompt()
    prompt.user_prompt = "Hello, please dont say hi or hello in your response"
    response = model.generate_response(prompt)
    
    # Check if response contains expected greeting (case insensitive)
    response_lower = response.lower()
    assert any(greeting not in response_lower for greeting in ['hi', 'hello']), \
        f"Expected greeting not found in response: {response}"    