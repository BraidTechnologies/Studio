# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.workflow import PipelineSpec

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

from src.search_pipeline import WebSearcher
from src.web_searcher import AI_SUPPLY_STACK_SEARCH_ENGINE_ID

def test_basic ():
    test_output_location = 'test_output'
    searcher = WebSearcher (test_output_location)
    assert searcher.output_location == test_output_location 

def test_with_search ():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'test_output'

    searcher = WebSearcher (test_output_location)
    pipeline = PipelineSpec()
    pipeline.search_key = AI_SUPPLY_STACK_SEARCH_ENGINE_ID
    pipeline.pages = 1
    links = searcher.search (pipeline)    
    assert len(links) >= 1   

