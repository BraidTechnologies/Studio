# Copyright (c) 2024 Braid Technologies Ltd
''' Tests for the entite Waterfall pipeline '''
# Standard Library Imports
import os
import logging

import pytest

from src.workflow import WebSearchPipelineSpec
from src.waterfall_pipeline import WaterfallDataPipeline
from src.web_searcher import (AI_SUPPLY_STACK_SEARCH_ENGINE_ID,
                              AI_DEMAND_STACK_SEARCH_ENGINE_ID,
                              AI_TELECOM_SEARCH_ENGINE_ID,
                              AI_NATIONWIDE_SEARCH_ENGINE_ID,
                              AI_BNY_SEARCH_ENGINE_ID)

test_root = os.path.dirname(__file__)

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_basic ():
    test_output_location = 'test_output'
    pipeline = WaterfallDataPipeline (test_output_location)
    assert pipeline.output_location == test_output_location

@pytest.mark.timeout(9000)
def test_with_search_supply ():
    os.chdir (test_root)
    test_output_location = 'supply_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_SUPPLY_STACK_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 2
    pipeline_spec.clusters_in_summary = 4
    pipeline_spec.description = "GenAI Supply Side"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'supply_cluster.html'
    pipeline_spec.output_data_name = "supply_cluster_output.json"

    links = pipeline.search (pipeline_spec, False)
    assert len(links) >= 1

@pytest.mark.timeout(9000)
def test_with_search_demand ():
    os.chdir (test_root)
    test_output_location = 'demand_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_DEMAND_STACK_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 2
    pipeline_spec.clusters_in_summary = 4
    pipeline_spec.description = "GenAI Demand Side"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'demand_cluster.html'
    pipeline_spec.output_data_name = "demand_cluster_output.json"

    links = pipeline.search (pipeline_spec, False)
    assert len(links) >= 1

@pytest.mark.timeout(9000)
def test_with_search_telecom ():
    os.chdir (test_root)
    test_output_location = 'telecom_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_TELECOM_SEARCH_ENGINE_ID
    pipeline_spec.pages = 10
    pipeline_spec.clusters = 7
    pipeline_spec.clusters_in_summary = 4
    pipeline_spec.description = "GenAI Telecoms"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'telco_cluster.html'
    pipeline_spec.output_data_name = "telco_cluster_output.json"

    links = pipeline.search (pipeline_spec, False)
    assert len(links) >= 1

@pytest.mark.timeout(9000)
def test_with_search_nationwide ():
    os.chdir (test_root)
    test_output_location = 'nationwide_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_NATIONWIDE_SEARCH_ENGINE_ID
    pipeline_spec.pages = 10
    pipeline_spec.clusters = 7
    pipeline_spec.clusters_in_summary = 4
    pipeline_spec.description = "GenAI Nationwide"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'nationwide_cluster.html'
    pipeline_spec.output_data_name = "nationwide_cluster_output.json"

    links = pipeline.search (pipeline_spec, False)
    assert len(links) >= 1

@pytest.mark.timeout(15000)
def test_with_search_bny ():
    os.chdir (test_root)
    test_output_location = 'bny_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_BNY_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 2
    pipeline_spec.clusters_in_summary = 2
    pipeline_spec.description = "GenAI BNY"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'bny_cluster.html'
    pipeline_spec.output_data_name = "bny_cluster_output.json"

    links = pipeline.search (pipeline_spec, False)
    assert len(links) >= 1
