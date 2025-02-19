''' Tests for the open AI char driver '''
# Copyright (c) 2024, 2025 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.model_driver_factories import get_default_embedding_model_driver
from src.cosine_similarity import cosine_similarity

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

SIMILAR_THRESHOLD = 0.7
DISSIMILAR_THRESHOLD = 0.3

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_chat_model_basic_response():
    ''' Test that the embedding model returns a non-empty vector for a basic input '''
    model = get_default_embedding_model_driver()
    response = model.embed('Airplane')
    
    # Check if response contains a vector
    assert isinstance(response, list) and len(response) > 0, \
        f'Response is empty: {response}'


def test_chat_model_mutated_input_same_response():
    ''' Test that the embedding model generates similar vectors for semantically similar words '''
    model = get_default_embedding_model_driver()
    response1 = model.embed('Aeroplane')
    response2 = model.embed('Airplane')

    # Check if response contains expected greeting (case insensitive)
    similarity = cosine_similarity(response1, response2)
    assert similarity >= SIMILAR_THRESHOLD, \
        f'Similarity is too low {similarity}'
    
def test_chat_model_mutated_input_different_response():
    ''' Test that the embedding model generates different vectors for semantically different words '''
    model = get_default_embedding_model_driver()
    response1 = model.embed('Aeroplane')
    response2 = model.embed('Banana')

    # Check if response contains expected greeting (case insensitive)
    similarity = cosine_similarity(response1, response2)
    assert similarity <= DISSIMILAR_THRESHOLD, \
        f'Similarity is too high {similarity}'  