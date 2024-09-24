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

from src.workflow import PipelineItem
from src.chunker import Chunker
from src.html_file_downloader import HtmlFileDownloader

# Fixture to create a temporary directory for test output
@pytest.fixture
def test_output_dir(tmpdir):
    dir_path = tmpdir.mkdir("test_output")
    logger.info(f"Created temporary test output directory: {dir_path}")
    yield str(dir_path)
    # Clean up after the test
    logger.info(f"Cleaning up test output directory: {dir_path}")
    shutil.rmtree(str(dir_path))

def test_basic (test_output_dir):
    test_output_location = test_output_dir

    sumchunkerariser = Chunker (test_output_location)
    assert sumchunkerariser.output_location == test_output_location 

def test_with_output (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir
    
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path

    downloader = HtmlFileDownloader (test_output_location)
    enriched_text: PipelineItem = downloader.download (pipeline_item) 

    chunker = Chunker (test_output_location)
    chunks : PipelineItem = chunker.chunk (enriched_text, 0)  

    assert len(chunks) == 1

def test_long (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir
    
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path

    downloader = HtmlFileDownloader (test_output_location)
    enriched_text: PipelineItem = downloader.download (pipeline_item) 

    chunker = Chunker (test_output_location)

    max = 15
    i = 0
    long_text = "this is going to be long "
    while i < max:
       long_text = long_text + long_text
       i = i + 1

    enriched_text.text = long_text
    chunks_overlapped : list[PipelineItem] = chunker.chunk (enriched_text, 0)  

    assert len(chunks_overlapped) > 1

def test_long_with_overlap (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir
    
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path

    downloader = HtmlFileDownloader (test_output_location)
    enriched_text: PipelineItem = downloader.download (pipeline_item) 

    chunker = Chunker (test_output_location)

    max = 15
    i = 0
    long_text = "this is going to be long "
    while i < max:
       long_text = long_text + long_text
       i = i + 1

    enriched_text.text = long_text
    chunks : list[PipelineItem] = chunker.chunk (enriched_text, 0, 0)      
    chunks_overlapped : list[PipelineItem] = chunker.chunk (enriched_text, 0, 1024)  

    assert len(chunks_overlapped) > len (chunks)