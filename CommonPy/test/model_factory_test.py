''' Tests for the model factory '''
# Copyright (c) 2024, 2025 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.model_driver_base import Model, ModelProvider
from src.model_driver_factories import get_default_chat_model_driver, get_chat_model_driver, get_default_embedding_model_driver, get_embedding_model_driver

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_default_chat_model():
    ''' Test that the default chat model is OpenAI '''
    model = get_default_chat_model_driver()
    assert model.provider  == ModelProvider.OPEN_AI
    assert model.model == Model.LARGE

def test_chat_model_driver():
    ''' Test that the chat model driver is OpenAI '''
    model = get_chat_model_driver(Model.LARGE, ModelProvider.OPEN_AI)
    assert model.provider == ModelProvider.OPEN_AI
    assert model.model == Model.LARGE

def test_default_embedding_model():
    ''' Test that the default embedding model is OpenAI '''
    model = get_default_embedding_model_driver()
    assert model.provider == ModelProvider.OPEN_AI
    assert model.model == Model.LARGE


def test_embedding_model_driver():
    ''' Test that the embedding model driver is OpenAI '''
    model = get_embedding_model_driver(Model.LARGE, ModelProvider.OPEN_AI)
    assert model.provider == ModelProvider.OPEN_AI
    assert model.model == Model.LARGE

