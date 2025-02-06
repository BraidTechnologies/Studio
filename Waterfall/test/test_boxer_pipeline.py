"""Test module for the Boxer Pipeline implementation."""

# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.workflow import YouTubePipelineSpec, HtmlDirectedPipelineSpec, PipelineFileSpec
from src.boxer_sources import youtube_playlists, html_pages
from src.boxer_pipeline import BoxerDataPipeline

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(
    level=logging.WARNING,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_youtube_boxer_pipeline():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'boxer_output'

    pipeline = BoxerDataPipeline (test_output_location)

    file_spec = PipelineFileSpec()
    file_spec.output_data_name = "test_youtube_only.json"
    file_spec.description = "Boxer Pipeline"

    html_spec = HtmlDirectedPipelineSpec()
    html_spec.urls = []

    # make a short playlist from first entry
    youtube_spec = YouTubePipelineSpec()
    youtube_spec.playlists = []
    youtube_spec.playlists.append (youtube_playlists[0])

    pipeline_items = pipeline.search (youtube_spec, html_spec, file_spec)

    assert len(pipeline_items) >= 1

def test_html_boxer_pipeline():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'boxer_output'

    pipeline = BoxerDataPipeline (test_output_location)

    file_spec = PipelineFileSpec()
    file_spec.output_data_name = "test_html_only.json"
    file_spec.description = "Boxer Pipeline"

    youtube_spec = YouTubePipelineSpec()

    # make a short playlist from first entry
    html_spec = HtmlDirectedPipelineSpec()
    html_spec.urls = []
    html_spec.urls.append (html_pages[0])
    html_spec.urls.append (html_pages[1])
    html_spec.urls.append (html_pages[2])
    html_spec.urls.append (html_pages[3])
    html_spec.urls.append (html_pages[4])
    html_spec.urls.append (html_pages[5])
    html_spec.urls.append (html_pages[6])

    pipeline_items = pipeline.search (youtube_spec, html_spec, file_spec)

    assert len(pipeline_items) >= 1

def test_full_boxer_pipeline():

    # Normally we return immediately - only comment out when you want to do a full production build
    return

    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'boxer_output'

    pipeline = BoxerDataPipeline (test_output_location)

    file_spec = PipelineFileSpec()
    file_spec.output_data_name = "api_embeddings_lite.json"
    file_spec.description = "Boxer Pipeline"

    youtube_spec = YouTubePipelineSpec()
    youtube_spec.playlists = youtube_playlists

    html_spec = HtmlDirectedPipelineSpec()
    html_spec.urls = html_pages

    pipeline_items = pipeline.search (youtube_spec, html_spec, file_spec)

    assert len(pipeline_items) >= 1 