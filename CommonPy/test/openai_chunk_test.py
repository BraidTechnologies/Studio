''' Tests for the open AI char driver '''
# Copyright (c) 2024, 2025 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.model_driver_factories import (
    get_text_chunker,
    Model,
    ModelProvider
)

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


def test_chunk_small_text():
    '''Test chunking of small text fits in default chunk'''
    model = get_text_chunker(Model.SMALL, ModelProvider.OPEN_AI)
    text = 'small text'

    assert model.fits_in_default_chunk(text)


def test_chunk_large_text():
    '''Test chunking of large text does not fit in default chunk'''
    model = get_text_chunker(Model.SMALL, ModelProvider.OPEN_AI)

    text = 'small text'
    for _ in range(12):
        text = text + text

    assert not model.fits_in_default_chunk(text)


def test_chunk_small_text_single_chunk():
    '''Test that small text produces single chunk'''
    model = get_text_chunker(Model.SMALL, ModelProvider.OPEN_AI)
    text = 'small text'

    assert len(model.chunk_text(text, None, None)) == 1


def test_chunk_large_text_multiple_chunks():
    '''Test that large text produces multiple chunks'''
    model = get_text_chunker(Model.SMALL, ModelProvider.OPEN_AI)

    text = 'small text '
    for _ in range(12):
        text = text + text

    assert len(model.chunk_text(text, None, None)) > 1


def test_chunk_large_text_with_overlaps():
    '''Test that overlapped chunking produces more chunks than base chunking'''
    model = get_text_chunker(Model.SMALL, ModelProvider.OPEN_AI)

    text = 'small text '
    for _ in range(12):
        text = text + text

    base_length = len(model.chunk_text(text, None, None))
    overlapped_length = len(model.chunk_text(text, None, 2048))

    assert overlapped_length > base_length
