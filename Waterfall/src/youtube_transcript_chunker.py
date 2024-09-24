''' Divide the transcript of a Youtube video into chunks '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging

from workflow import PipelineItem, PipelineStep
from chunker import Chunker

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

class YouTubeTranscriptChunker (PipelineStep):
    '''
    Utility class to chunk a transcript for a YouTube video
    '''

    def __init__(self, output_location: str):
        '''
        Initializes the YouTubeTranscriptChunker object.
        '''
        # pylint: disable-next=useless-parent-delegation 
        super(YouTubeTranscriptChunker, self).__init__(output_location)  
        self.chunker = Chunker (output_location)              

    def chunk(self, pipeline_item: PipelineItem, max_words: int, overlap_words: int) -> list[PipelineItem]:
        '''
         Divides the transcript of the specific video into chunks and new PipelineItems.

         Parameters:
            pipeline_item: PipelineItem - The item to be chunked.
            max_words - maximum words per chunk. If 0, use the models context window size. 
            overlap_words - how many words to use to overlap chunks. 0 = no overlap.
         Returns:
             list[PipelineItem]: The chunks of the Video transcript.
        '''
        pipeline_items = []

        chunks = self.chunker.chunk (pipeline_item, max_words, overlap_words)

        return chunks