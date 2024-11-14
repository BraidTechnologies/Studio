'''driver for the entire Boxer data generation pipeline '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json

from src.workflow import YouTubePipelineSpec, HtmlDirectedPipelineSpec, PipelineItem, PipelineFileSpec
from src.youtube_searcher import YoutubePlaylistSearcher
from src.youtube_transcript_downloader import YouTubeTranscriptDownloader
from src.youtube_transcript_chunker import YouTubeTranscriptChunker
from src.html_link_crawler import HtmlLinkCrawler
from src.html_file_downloader import HtmlFileDownloader
from src.summariser import Summariser
from src.embedder import Embedder

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
               html_spec: HtmlDirectedPipelineSpec,
               file_spec: PipelineFileSpec) -> list[PipelineItem]:
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

        all_chunks = []
        all_enriched_chunks = []

        for html_url in html_spec.urls:
            chunk = PipelineItem()
            chunk.path = html_url
            html_items = html_crawler.crawl(chunk)

            for html_item in html_items:
                downloaded = None
                summarised = None
                embedded = None

                downloaded = html_downloader.download(html_item)
                if downloaded:
                    summarised = summariser.summarise(downloaded)
                if summarised:
                    embedded = embedder.embed(summarised)
                if embedded:
                    all_enriched_chunks.append(embedded)

        youtube_items = youtube_searcher.search(youtube_spec)

        for chunk in youtube_items:
            chunk = youtube_downloader.download(chunk)
            chunks = youtube_chunker.chunk(
                chunk, youtube_spec.max_words, youtube_spec.overlap_words)
            if chunks:
                all_chunks.extend(chunks)

        for chunk in all_chunks:
            summarised = None
            embedded = None
            logger.info('Processing: %s', chunk.path)
            if chunk.text:
                summarised = summariser.summarise(chunk)
            if summarised:
                embedded = embedder.embed(summarised)
            if embedded:
                all_enriched_chunks.append(embedded)

        output_results = []
        for chunk in all_enriched_chunks:
            output_item = dict()
            output_item['summary'] = chunk.summary
            output_item['embedding'] = chunk.embedding
            output_item['url'] = chunk.path
            output_results.append(output_item)

        # save the test results to a json file
        output_file = os.path.join(
            self.output_location, file_spec.output_data_name)
        with open(output_file, 'w+', encoding='utf-8') as f:
            json.dump(output_results, f)

        return all_enriched_chunks
