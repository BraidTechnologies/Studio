# Copyright (c) 2024 Braid Technologies Ltd
''' Tests for the entite Waterfall pipeline '''
# Standard Library Imports
import os
import logging

import pytest

from src.workflow import WebSearchPipelineSpec, FileDirectedPipelineSpec
from src.waterfall_pipeline import WaterfallDataPipeline, PipelineSpec
from src.web_searcher import (AI_SUPPLY_STACK_SEARCH_ENGINE_ID,
                              AI_DEMAND_STACK_SEARCH_ENGINE_ID,
                              AI_TELECOM_SEARCH_ENGINE_ID,
                              AI_NATIONWIDE_SEARCH_ENGINE_ID,
                              AI_BNY_SEARCH_ENGINE_ID,
                              AI_VODAFONE_SEARCH_ENGINE_ID)

test_root = os.path.dirname(__file__)

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
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
    pipeline_spec.clusters = 3
    pipeline_spec.clusters_in_summary = 2
    pipeline_spec.description = "GenAI Supply Side"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'supply_cluster.html'
    pipeline_spec.output_data_name = "supply_cluster_output.json"

    links = pipeline.search_dynamic (pipeline_spec)
    assert len(links) >= 1

@pytest.mark.timeout(9000)
def test_with_search_demand ():
    os.chdir (test_root)
    test_output_location = 'demand_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_DEMAND_STACK_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 3
    pipeline_spec.clusters_in_summary = 2
    pipeline_spec.description = "GenAI Demand Side"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'demand_cluster.html'
    pipeline_spec.output_data_name = "demand_cluster_output.json"

    links = pipeline.search_dynamic (pipeline_spec)
    assert len(links) >= 1

@pytest.mark.timeout(9000)
def test_with_search_telecom ():
    os.chdir (test_root)
    test_output_location = 'vodafone_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_VODAFONE_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 2
    pipeline_spec.clusters_in_summary = 2
    pipeline_spec.description = "Vodafone GenAI"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'vodafone_cluster.html'
    pipeline_spec.output_data_name = "vodafone_cluster_output.json"
    pipeline_spec.query_additions = "Vodafone"

    links = pipeline.search_dynamic (pipeline_spec)
    assert len(links) >= 1

@pytest.mark.timeout(9000)
def test_with_search_nationwide ():
    os.chdir (test_root)
    test_output_location = 'nationwide_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_NATIONWIDE_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 3
    pipeline_spec.clusters_in_summary = 2
    pipeline_spec.description = "GenAI Nationwide"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'nationwide_cluster.html'
    pipeline_spec.output_data_name = "nationwide_cluster_output.json"

    links = pipeline.search_dynamic (pipeline_spec)
    assert len(links) >= 1

@pytest.mark.timeout(15000)
def test_with_search_bny ():
    os.chdir (test_root)
    test_output_location = 'bny_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = WebSearchPipelineSpec()
    pipeline_spec.search_key = AI_BNY_SEARCH_ENGINE_ID
    pipeline_spec.pages = 1
    pipeline_spec.clusters = 3
    pipeline_spec.clusters_in_summary = 2
    pipeline_spec.description = "GenAI BNY"
    pipeline_spec.mail_to = "jon@braidtech.ai"
    pipeline_spec.output_chart_name = 'bny_cluster.html'
    pipeline_spec.output_data_name = "bny_cluster_output.json"

    links = pipeline.search_dynamic (pipeline_spec)
    assert len(links) >= 1

def test_with_search_vf_survey_01 ():
    os.chdir (test_root)
    test_output_location = 'vf_survey_01_output'

    pipeline = WaterfallDataPipeline (test_output_location)

    pipeline_spec = PipelineSpec()
    pipeline_spec.clusters = 3
    pipeline_spec.clusters_in_summary = 3
    pipeline_spec.description = "Vodafone Cohort 1 Survey 1"
    pipeline_spec.output_chart_name = 'vf_survey_01.html'
    pipeline_spec.output_data_name = "vf_survey_01_output.json"

    file_spec = FileDirectedPipelineSpec()
    file_spec.files = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "11"]

    links = pipeline.search_static (pipeline_spec, file_spec)
    assert len(links) >= 1
