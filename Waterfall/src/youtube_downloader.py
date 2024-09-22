''' first step of Waterfall pipeline - search web and generate input list of PipelineItems from a Youtube playlist'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os

import googleapiclient.discovery
import googleapiclient.errors
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled, VideoUnavailable
from youtube_transcript_api.formatters import WebVTTFormatter

from workflow import PipelineItem, PipelineSpec

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

# get the API KEY here: https://developers.google.com/custom-search/v1/overview
GOOGLE_DEVELOPER_API_KEY = os.environ['GOOGLE_DEVELOPER_API_KEY']
GOOGLE_API_SERVICE_NAME = "youtube"
GOOGLE_API_VERSION = "v3"
MAX_RESULTS = 100

AI_SUPPLY_STACK_SEARCH_ENGINE_ID = '00d305498d8da42e1'
youTubePlaylists = [  
#"Stanford CS229: Machine Learning Full Course taught by Andrew Ng | Autumn 2018 - YouTube", 
 "PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU",
#"Stanford CS224N: Natural Language Processing with Deep Learning | Winter 2021 - YouTube", 
 "PLoROMvodv4rOSH4v6133s9LFPRHjEmbmJ",
#"Braid AI Canon", 
 "PL9LkXkIUrSoxIlFSKcyB21XFFLCCYfPGv",
#"Braid - Additional Content", 
 "PL9LkXkIUrSozgkPNepSMzidqtAGR0b1F_",
#"Augmented Language Models (LLM Bootcamp) (youtube.com)", 
 "PL1T8fO7ArWleyIqOy37OVXsP4hFXymdOZ"
]

class YoutubeDownloader:

    def __init__(self, output_location: str):
        self.output_location = output_location
        return

    def search(self, pipeline: PipelineSpec) -> list[PipelineItem]:

        # TODO - have a search spec that includes a list of playlists
        playlistId = youTubePlaylists[0]

        pipeline_items = []

        youtube = googleapiclient.discovery.build(
            GOOGLE_API_SERVICE_NAME, GOOGLE_API_VERSION, developerKey=GOOGLE_DEVELOPER_API_KEY
        )

        # Create a request object with the playlist ID and the max results
        request = youtube.playlistItems().list(
            part="snippet", playlistId=playlistId, maxResults=MAX_RESULTS
        )

        # Loop through the pages of results until there is no next page token
        while request:
            # Execute the request and get the response
            response = request.execute()

            # Iterate over the items in the response and append the video IDs to the list
            for item in response["items"]:
                video_id = item["snippet"]["resourceId"]["videoId"]
                pipeline_item = PipelineItem()
                pipeline_item.path = "https://www.youtube.com/watch?v=" + str(video_id)
                pipeline_items.append(pipeline_item)

            # Get the next page token from the response and create a new request object
            next_page_token = response.get("nextPageToken")
            if next_page_token:
                request = youtube.playlistItems().list(
                    part="snippet",
                    playlistId=playlistId,
                    maxResults=MAX_RESULTS,
                    pageToken=next_page_token,
                )
            else:
                request = None

        return pipeline_items
