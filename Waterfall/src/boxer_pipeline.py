'''driver for the entire pipeline '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json

from workflow import YouTubePipelineSpec
from youtube_searcher import YoutubePlaylistSearcher
from youtube_transcript_downloader import YouTubeTranscriptDownloader
from youtube_transcript_chunker import YouTubeTranscriptChunker
from html_file_downloader import HtmlFileDownloader
from summariser import Summariser
from summarise_fail_suppressor import SummariseFailSuppressor
from embedder import Embedder

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

class BoxerDataPipeline:
    '''
    Searches for HTML & YouTube  from a list of links.

    Returns:
       list[str]: A list of HTML content downloaded from the specified links.
    '''

    def __init__(self, output_location: str):
        '''
        Initializes a BoxerDataPipeline object with the specified output location.

        Parameters:
            output_location (str): The location where the output will be stored.

        Returns:
            None
        '''
        self.output_location = output_location
        return

    def search(self, spec: YouTubePipelineSpec) -> None:
        '''
        Searches for HTML & YouTube content from a list of links.

        Returns:
            Nothing
        '''
        searcher = YoutubePlaylistSearcher (self.output_location)
        downloader = YouTubeTranscriptDownloader (self.output_location)
        chunker = YouTubeTranscriptChunker (self.output_location)

        items = searcher.search (spec)

        all_chunks = []
        for item in items:
            item = downloader.download (item)
            chunks = chunker.chunk (item, spec.max_words, spec.overlap_words)
            all_chunks.extend (chunks)
            


        return 

    