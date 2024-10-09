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
from src.html_link_crawler import HtmlLinkCrawler

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
    test_path = 'test'
    test_output_location = test_output_dir
    crawler = HtmlLinkCrawler (test_output_location, 5)
    assert crawler.output_location == test_output_location
    assert crawler.max_depth == 5    

def test_with_output (test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'simple_test.html'
    test_output_location = test_output_dir

    crawler = HtmlLinkCrawler (test_output_location, 5)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path
    links = crawler.crawl (pipeline_item)    
    assert len(links) == 1


def test_with_one_recursion(test_output_dir):
    test_root = os.path.dirname(__file__)
    test_path = os.path.join (test_root, 'two.html')    
    os.chdir (test_root)

    test_output_location = test_output_dir

    crawler = HtmlLinkCrawler (test_output_location, 5)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path
    links = crawler.crawl (pipeline_item)     
    assert len(links) == 2

def test_with_two_recursions(test_output_dir):
    test_root = os.path.dirname(__file__)
    test_path = os.path.join (test_root, 'three.html')        
    os.chdir (test_root)

    test_output_location = test_output_dir

    crawler = HtmlLinkCrawler (test_output_location, 5)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path
    links = crawler.crawl (pipeline_item)   
    assert len(links) == 3

def test_many_sublinks(test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'https://course.fast.ai/'  
    test_output_location = test_output_dir

    crawler = HtmlLinkCrawler (test_output_location, 5)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path
    links = crawler.crawl (pipeline_item)   
    assert len(links) > 5


def test_mad_page(test_output_dir):
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_path = 'https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/'  
    test_output_location = test_output_dir

    crawler = HtmlLinkCrawler (test_output_location, 5)
    pipeline_item = PipelineItem()
    pipeline_item.path = test_path
    links = crawler.crawl (pipeline_item)   
    assert len(links) == 1   