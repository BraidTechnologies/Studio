# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
from src.workflow import WebSearchPipelineSpec, PipelineItem, Theme
import os
import sys
import logging

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


def test_pipeline_item():
    item = PipelineItem()
    item.path = "https://microsoft.com"
    item.summary = "Summary"
    item.embedding = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]

    caught = False
    try:
        item.wont_work = ""
    except TypeError:
        caught = True

    assert caught == True


def test_theme():
    item = PipelineItem()
    items = [item]

    theme = Theme()
    theme.short_description = "Short"
    theme.long_description = "Long long long"
    theme.example_pipeline_items = items

    caught = False
    try:
        theme.wont_work = ""
    except TypeError:
        caught = True
    assert len(theme.example_pipeline_items) == 1
    assert caught == True


def test_pipeline():
    pipeline = WebSearchPipelineSpec()
    items = [pipeline]

    theme = Theme()
    theme.short_description = "Short"
    theme.long_description = "Long long long"
    theme.example_pipeline_items = items
    themes = [theme]

    pipeline = WebSearchPipelineSpec()
    pipeline.search_key = "1234"
    pipeline.description = "Description"
    pipeline.themes = themes
    pipeline.output_chart_name = "test.html"

    caught = False
    try:
        pipeline.wont_work = ""
    except TypeError:
        caught = True

    assert len(pipeline.themes) == 1
    assert caught == True
