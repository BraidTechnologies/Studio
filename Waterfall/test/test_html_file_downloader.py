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
logger.setLevel(logging.ERROR)

from src.workflow import PipelineItem
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
    downloader = HtmlFileDownloader (test_output_location)
    assert downloader.output_location == test_output_location   


def test_with_output (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir

    downloader = HtmlFileDownloader (test_output_location)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path

    enriched : PipelineItem = downloader.download (pipeline_item)    

    assert len(enriched.text) > 0


def test_connected (test_output_dir):
    test_path = 'https://openai.com/'
    test_output_location = test_output_dir

    downloader = HtmlFileDownloader (test_output_location)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path

    enriched : PipelineItem = downloader.download (pipeline_item) 
      
    assert len(enriched.text) > 0
