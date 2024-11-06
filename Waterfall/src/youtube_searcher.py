''' first step of Waterfall pipeline - generate input list of PipelineItems from a Youtube playlist'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import datetime

import googleapiclient.discovery
import googleapiclient.errors

from workflow import PipelineItem, YouTubePipelineSpec
from boxer_sources import youtube_playlists

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


def parseVideoDurationMins(duration: str) -> int:
    """Parse the duration of a video in minutes.

    Args:
        duration (str): The duration of the video in ISO 8601 format.

    Returns:
        int: The duration of the video in minutes.

    Derived from : https://stackoverflow.com/questions/73495868/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-python3
    But WARNING - that saple has incorrect logic for minutes- corrected below. 
    """
    new_string = duration.split('T')[1]

    if 'H' in new_string and 'M' in new_string and 'S' in new_string:
        dt = datetime.datetime.strptime(new_string, '%HH%MM%SS')
        time_sec = int(dt.hour) * 3600 + int(dt.minute) * 60 + int(dt.second)

    elif 'M' in new_string and 'S' in new_string:
        dt = datetime.datetime.strptime(new_string, '%MM%SS')
        time_sec = int(dt.minute) * 60 + int(dt.second)

    elif 'H' in new_string and 'M' in new_string:
        dt = datetime.datetime.strptime(new_string, '%HH%MM')
        time_sec = int(dt.hour) * 3600 + int(dt.minute) * 60

    elif 'H' in new_string and 'S' in new_string:
        dt = datetime.datetime.strptime(new_string, '%HH%SS')
        time_sec = int(dt.hour) * 3600 + int(dt.second)

    elif 'H' in new_string:
        dt = datetime.datetime.strptime(new_string, '%HH')
        time_sec = int(dt.hour) * 3600

    elif 'M' in new_string:
        dt = datetime.datetime.strptime(new_string, '%MM')
        time_sec = int(dt.minute) * 60

    else:
        dt = datetime.datetime.strptime(new_string, '%SS')
        time_sec = int(dt.second)

    return time_sec / 60


class YoutubePlaylistSearcher:
    '''Processes a set of playlists and creates a list of PipelineItem objects representing the videos found in the playlists'''

    def __init__(self, output_location: str):
        '''
        Initialize the class with the specified output location.

        Parameters:
        - output_location (str): The location where the output will be stored.
        '''
        self.output_location = output_location
        return

    def search(self, pipeline: YouTubePipelineSpec) -> list[PipelineItem]:
        '''
        Search for videos in the specified playlists and generate a list of PipelineItems.

        Parameters:
            pipeline (YouTubePipelineSpec): The pipeline specification containing playlists to search.

        Returns:
            list[PipelineItem]: A list of PipelineItem objects representing the videos found in the playlists.
        '''

        pipeline_items = []

        youtube = googleapiclient.discovery.build(
            GOOGLE_API_SERVICE_NAME, GOOGLE_API_VERSION, developerKey=GOOGLE_DEVELOPER_API_KEY
        )

        for playlist in pipeline.playlists:
            # Create a request object with the playlist ID and the max results
            playlist_request = youtube.playlistItems().list(
                part="snippet", playlistId=playlist, maxResults=MAX_RESULTS
            )

            # Loop through the pages of results until there is no next page token
            while playlist_request:
                # Execute the request and get the response
                playlist_response = playlist_request.execute()

                # Iterate over the items in the response and append the video IDs to the list
                for item in playlist_response["items"]:
                    video_id = item["snippet"]["resourceId"]["videoId"]

                    # Create a request object with the Video ID
                    # Note - to optimise, should really batch request this for all videos in the page returned
                    video_request = youtube.videos().list(
                        id=video_id,
                        part="contentDetails"
                    )
                    video_response = video_request.execute()
                    duration = video_response["items"][0]["contentDetails"]["duration"]

                    minutes = parseVideoDurationMins(duration)

                    pipeline_item = PipelineItem()
                    pipeline_item.length_minutes = int(minutes)
                    pipeline_item.path = "https://www.youtube.com/watch?v=" + \
                        str(video_id)
                    pipeline_items.append(pipeline_item)

                # Get the next page token from the response and create a new request object
                next_page_token = playlist_response.get("nextPageToken")
                if next_page_token:
                    playlist_request = youtube.playlistItems().list(
                        part="snippet",
                        playlistId=playlist,
                        maxResults=MAX_RESULTS,
                        pageToken=next_page_token,
                    )
                else:
                    playlist_request = None

        return pipeline_items
