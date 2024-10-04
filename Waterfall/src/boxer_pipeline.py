'''driver for the entire pipeline '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json

from workflow import YouTubePipelineSpec, HtmlDirectedPipelineSpec, PipelineItem
from youtube_searcher import YoutubePlaylistSearcher
from youtube_transcript_downloader import YouTubeTranscriptDownloader
from youtube_transcript_chunker import YouTubeTranscriptChunker
from html_link_crawler import HtmlLinkCrawler
from html_file_downloader import HtmlFileDownloader
from summariser import Summariser
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

    def search(self,
               youtube_spec: YouTubePipelineSpec,
               html_spec: HtmlDirectedPipelineSpec) -> list[PipelineItem]:
        '''
        Searches for HTML & YouTube content from a list of links.

        Returns:
            A list with all the donloaded pipline items
        '''
        youtube_searcher = YoutubePlaylistSearcher(self.output_location)
        youtube_downloader = YouTubeTranscriptDownloader(self.output_location)
        youtube_chunker = YouTubeTranscriptChunker(self.output_location)

        html_crawler = HtmlLinkCrawler(self.output_location)
        html_downloader = HtmlFileDownloader(self.output_location)

        summariser = Summariser(self.output_location)
        embedder = Embedder(self.output_location)

        youtube_items = youtube_searcher.search(youtube_spec)

        all_chunks = []
        all_enriched_chunks = []
    
        for html_url in html_spec.urls:
            item = PipelineItem()
            item.path = html_url           
            html_items = html_crawler.crawl(item)

            for html_item in html_items:
                downloaded = None
                summarised = None
                embedded = None
                  
                downloaded = html_downloader.download (html_item)
                if (downloaded):
                   summarised = summariser.summarise(downloaded)
                if (summarised):
                   embedded = embedder.embed(summarised)
                if (embedded):
                   all_enriched_chunks.append(embedded)  

        for item in youtube_items:           
            item = youtube_downloader.download(item)
            chunks = youtube_chunker.chunk(
                item, youtube_spec.max_words, youtube_spec.overlap_words)
            all_chunks.append(chunks)

        for chunk in all_chunks:
            print(chunk.path)
            summarised = summariser.summarise(chunk)
            embedded = embedder.embed(summarised)
            all_enriched_chunks.append(embedded)
              

        return all_enriched_chunks
