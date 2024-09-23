''' Divide the transcript of a Youtube video into chunks '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging

from workflow import PipelineItem

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

class YouTubeTranscriptChunker ():
    '''
    Utility class to chunk a transcript for a YouTube video
    '''

    def __init__():
        '''
        Initializes the YouTubeTranscriptChunker object.
        '''

    def chunk(self, pipeline_item: PipelineItem) -> list[PipelineItem]:
        '''
         Divides the transcript of the specific video into chunks and new PipelineItems.

         Returns:
             list[PipelineItem]: The chunks of the Video transcript.
        '''
        pipeline_items = []

        return pipeline_items