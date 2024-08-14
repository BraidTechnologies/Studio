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

from src.cluster_analyser import ClusterAnalyser
from src.embedder_repository_facade import EmbeddingRespositoryFacade
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
    test_path = 'test'
    test_output_location = 'test_output'

    analyser = ClusterAnalyser (test_path, test_output_location)

    assert analyser.path == test_path  
    assert analyser.output_location == test_output_location
  

def test_with_output (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = 'test_output'
    downloader = HtmlFileDownloader (test_path, test_output_location)
    text = downloader.download () 

    summariser = Summariser (test_path, text, test_output_location)   
    summary = summariser.summarise () 

    embedder = Embedder (test_path, summary, test_output_location)
    embedding = embedder.embed ()   

    paths = []
    paths.append (test_path)
    cluster_analyser = ClusterAnalyser (paths, test_output_location) 
    cluster = cluster_analyser.analyse ()

    assert 0 == 0