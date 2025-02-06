# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.workflow import YouTubePipelineSpec

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

from src.youtube_searcher import YoutubePlaylistSearcher
from src.youtube_transcript_downloader import YouTubeTranscriptDownloader
from src.boxer_sources import youtube_playlists

def test_basic ():
    test_output_location = 'test_output'
    searcher = YoutubePlaylistSearcher (test_output_location)
    assert searcher.output_location == test_output_location 

def test_with_search ():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'test_output'

    searcher = YoutubePlaylistSearcher (test_output_location)
    pipeline = YouTubePipelineSpec()
    pipeline.playlists = youtube_playlists
    pipeline_items = searcher.search (pipeline)    
    assert len(pipeline_items) >= 1   

def test_download():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_output_location = 'test_output'

    searcher = YoutubePlaylistSearcher (test_output_location)
    downloader = YouTubeTranscriptDownloader (test_output_location)
    pipeline = YouTubePipelineSpec()

    pipeline.playlists = []
    pipeline.playlists.append (youtube_playlists[0])
    pipeline_items = searcher.search (pipeline)  

    for item in pipeline_items:
       item = downloader.download (item)
       assert len(item.text) >= 1 

    assert len(pipeline_items) >= 1   
