# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.workflow import YouTubePipelineSpec, HtmlDirectedPipelineSpec

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

from src.boxer_sources import youtube_playlists, html_pages
from src.boxer_pipeline import BoxerDataPipeline

def test_youtube_boxer_pipeline():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'boxer_output'

    pipeline = BoxerDataPipeline (test_output_location)

    html_spec = HtmlDirectedPipelineSpec()
    html_spec.urls = []

    # make a short playlist from first entry
    youtube_spec = YouTubePipelineSpec()
    youtube_spec.playlists = []
    youtube_spec.playlists.append (youtube_playlists[0])

    pipeline_items = pipeline.search (youtube_spec, html_spec)  

    assert len(pipeline_items) >= 1 

def test_html_boxer_pipeline():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'boxer_output'

    pipeline = BoxerDataPipeline (test_output_location)

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

    pipeline_items = pipeline.search (youtube_spec, html_spec)  

    assert len(pipeline_items) >= 1 

def test_full_boxer_pipeline():
    
    # Normally we leave this commented out - only uncomment when you want to do a full production build
    #assert (True)
    #return
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'boxer_output'

    pipeline = BoxerDataPipeline (test_output_location)

    youtube_spec = YouTubePipelineSpec() 
    youtube_spec.playlists = youtube_playlists
                                       
    html_spec = HtmlDirectedPipelineSpec()              
    html_spec.urls = html_pages

    pipeline_items = pipeline.search (youtube_spec, html_spec)  

    assert len(pipeline_items) >= 1 