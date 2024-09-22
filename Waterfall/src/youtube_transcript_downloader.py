''' first step of Waterfall pipeline - search web and generate input list of PipelineItems from a Youtube playlist'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled, VideoUnavailable
#from youtube_transcript_api.formatters import WebVTTFormatter

from workflow import PipelineStep, PipelineItem
from text_repository_facade import TextRespositoryFacade

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


def clean_text(text: str) -> str:
    """clean the text"""
    text = text.replace("\n", " ")  # remove new lines
    text = text.replace("&#39;", "'")
    text = text.replace(">>", "")  # remove '>>'
    text = text.replace("  ", " ")  # remove double spaces
    text = text.replace("[inaudible]", "")  # [inaudible]

    return text



def parse_video_id(value: str) -> str:
    """
    Examples:
    - http://youtu.be/SA2iWivDJiE
    - http://www.youtube.com/watch?v=_oPAwA_Udwc&feature=feedu
    - http://www.youtube.com/embed/SA2iWivDJiE
    - http://www.youtube.com/v/SA2iWivDJiE?version=3&amp;hl=en_US
    """
    query = urlparse(value)
    if query.hostname == 'youtu.be':
        return query.path[1:]
    if query.hostname in ('www.youtube.com', 'youtube.com'):
        if query.path == '/watch':
            p = parse_qs(query.query)
            return p['v'][0]
        if query.path[:7] == '/embed/':
            return query.path.split('/')[2]
        if query.path[:3] == '/v/':
            return query.path.split('/')[2]
    # fail?
    return None

class YouTubeTranscriptDownloader (PipelineStep):
    '''Utility class to download the transcript for a YouTube video

     Args:
         output_location (str): The location to save the text of the downloaded file.
    '''

    def __init__(self, output_location: str):
        '''
        Initializes the YouTubeTranscriptDownloader object with the provided output location.
        '''
        super(YouTubeTranscriptDownloader, self).__init__(output_location) # pylint: disable=useless-parent-delegation

    def download(self, pipeline_item: PipelineItem) -> PipelineItem:
        '''
         Downloads the transcript of the specific video and saves it to the output location.

         Returns:
             PipelineItem: The content of the downloaded Video transcript.
        '''
        path = pipeline_item.path
        repository = TextRespositoryFacade(self.output_location)
        if repository.exists(path):
            text = repository.load(path)
            pipeline_item.summary = text
            return pipeline_item
        
        try:
            full_text = ""
            video_id = parse_video_id(pipeline_item.path)
            if not video_id:
               raise Exception ("Unable to parse video id")
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            # Remove \n from the text
            for item in transcript:
               full_text = full_text + clean_text (item["text"]) 

        except NoTranscriptFound:
            logger.error("No transcript found for video: %s", path)
            return False
        except TranscriptsDisabled:
            logger.error("Transcripts are disabled for video: %s", path)
            return False
        except VideoUnavailable:
            logger.error("Video unavailable: %s", path)
            return False
        except Exception as exception:
            logger.error("An error occurred: %s", str(exception))
            logger.v("Transcription not found for video: %s", path)

        pipeline_item.text = full_text
        repository.save(path, full_text)

        return pipeline_item