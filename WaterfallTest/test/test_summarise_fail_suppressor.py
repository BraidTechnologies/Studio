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
from src.summarise_fail_suppressor import SummariseFailSuppressor
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

    summariser = SummariseFailSuppressor (test_output_location)
    assert summariser.output_location == test_output_location 

def test_with_no_suppression ():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir
    
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path 
    pipeline_item.summary = "This article explains how generative AI can drive customer value growth in various areas such as product development, marketing, and customer service. It discusses the challenges of implementing generative AI and mentions that Accenture is using AI to transform its operations."

    summariser = SummariseFailSuppressor (test_output_location)
    enriched : PipelineItem = summariser.should_suppress (pipeline_item)  

    assert enriched 

def test_with_suppression (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir
    
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path 
    pipeline_item.summary = "Im sorry, but it seems that the text you provided is not the main body of the text but rather website navigation and cookie preferences. Therefore, I cannot provide a summary."

    summariser = SummariseFailSuppressor (test_output_location)
    enriched : PipelineItem = summariser.should_suppress (pipeline_item)  

    assert enriched is None    