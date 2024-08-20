# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import pytest
import os
import shutil
import sys
import logging

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

from src.embedding_finder import EmbeddingFinder
from src.html_file_downloader import HtmlFileDownloader
from src.summariser import Summariser
from src.embedder import Embedder

# Fixture to create a temporary directory for test output
@pytest.fixture
def test_output_dir(tmpdir):
    dir_path = tmpdir.mkdir("test_output")
    logger.info(f"Created temporary test output directory: {dir_path}")
    yield str(dir_path)
    # Clean up after the test
    logger.info(f"Cleaning up test output directory: {dir_path}")
    shutil.rmtree(str(dir_path))

def test_basic ():

    embeddings = []
    proxy_embedding = 0.0 * 10
    embeddings.append (proxy_embedding)
        
    finder = EmbeddingFinder (embeddings)

    assert finder.embeddings == embeddings  

def test_with_output (test_output_dir):
    
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_paths = ['cluster_test_1.html', 'cluster_test_2.html', 'cluster_test_3.html', 'cluster_test_4.html', 'cluster_test_5.html']
    test_output_location = test_output_dir

    embeddings_as_float = []

    for test_path in test_paths:
       downloader = HtmlFileDownloader (test_path, test_output_location)
       text = downloader.download () 

       summariser = Summariser (test_path, text, test_output_location)   
       summary = summariser.summarise () 

       embedder = Embedder (test_path, summary, test_output_location)
       embedding = embedder.embed ()   
       embedding_as_float = Embedder.textToFloat (embedding)

       embeddings_as_float.append (embedding_as_float)

    embedding_finder = EmbeddingFinder (embeddings_as_float) 
    found = embedding_finder.find_nearest (embeddings_as_float[0])

    assert found == embeddings_as_float[0]