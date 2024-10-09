''' Divide the transcript of a Youtube video into chunks '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import math
import logging
import datetime

from workflow import PipelineItem, PipelineStep
from chunker import Chunker

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

def make_start_time_offset (minutes: int) -> str: 
    
    hours = math.floor (minutes / 60)
    minutes_left = minutes - (hours * 60)

    time_marker = datetime.time (int (hours), int (minutes_left))
    if hours > 0:
       return '&t=' + time_marker.strftime("%Hh%Mm")
    return '&t=' + time_marker.strftime("%Mm")

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

    def chunk(self, pipeline_item: PipelineItem, chunk_size_words: int, overlap_words: int) -> list[PipelineItem]:
        '''
         Divides the transcript of the specific video into chunks and new PipelineItems.

         Parameters:
            pipeline_item: PipelineItem - The item to be chunked.
            chunk_size_words - maximum words per chunk. If 0, use the models context window size. 
            overlap_words - how many words to use to overlap chunks. 0 = no overlap.
         Returns:
             list[PipelineItem]: The chunks of the Video transcript.
        '''
        chunks = self.chunker.chunk (pipeline_item, chunk_size_words, overlap_words)

        # special case if we only have one chunk
        number_of_chunks = len(chunks)
        if number_of_chunks == 1:
            return pipeline_item

        if number_of_chunks == 0:
           return None
        
        # linear interpolation by chunk size after correction for overlap
        # this assumes text is evenly spread throughout the video, but this seems ok for lectures / presentations
        original_length = len (pipeline_item.text)
        chunked_length = 0
        for chunk in chunks:
            chunked_length = chunked_length + len(chunk.text)

        overlap_length = (chunked_length - original_length) / number_of_chunks

        start_minutes = 0
        number_of_overlaps = 1 # irat chunk has only one overlap. So does last but we dont use that for the start point calulation

        for chunk in chunks:
            base_url = chunk.path
            time_marker = make_start_time_offset (start_minutes)
            chunk.path = base_url + time_marker
            chunk_minutes = ((len(chunk.text) - (number_of_overlaps * overlap_length)) * pipeline_item.length_minutes / original_length)
            number_of_overlaps = 2            
            start_minutes = start_minutes + chunk_minutes

        return chunks