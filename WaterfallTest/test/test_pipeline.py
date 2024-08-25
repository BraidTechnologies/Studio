# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import pytest
import os
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

from src.workflow import PipelineSpec
from src.search_pipeline import WaterfallDataPipeline
from src.web_searcher import AI_SUPPLY_STACK_SEARCH_ENGINE_ID

@pytest.fixture
def place_holder_fixture():
    yield str("place_holder")
    # Clean up after the test
    logger.info(f"Cleaning up: {place_holder_fixture}")

def test_basic ():
    test_output_location = 'test_output'
    pipeline = WaterfallDataPipeline (test_output_location)
    assert pipeline.output_location == test_output_location 

@pytest.mark.timeout(3000)
def test_with_search ():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'test_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = PipelineSpec()
    pipeline_spec.search_key = AI_SUPPLY_STACK_SEARCH_ENGINE_ID
    pipeline_spec.pages = 10  
    pipeline_spec.clusters = 7 
    pipeline_spec.output_chart_name = 'supply_cluster.html'
    pipeline_spec.output_data_name = "supply_cluster_output.json"

    links = pipeline.search (pipeline_spec)    
    assert len(links) >= 1   

