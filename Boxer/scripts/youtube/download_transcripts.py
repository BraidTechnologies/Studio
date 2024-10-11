""" This script downloads the transcripts for all the videos in a YouTube playlist. """

# Standard Library Imports
import os
import json
import logging
import time
import threading
import queue

# Third-Party Packages
import googleapiclient.discovery
import googleapiclient.errors
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled, VideoUnavailable
from youtube_transcript_api.formatters import WebVTTFormatter


logger = logging.getLogger(__name__)

GOOGLE_DEVELOPER_API_KEY = os.environ["GOOGLE_DEVELOPER_API_KEY"]

# Initialize the Google developer API client
GOOGLE_API_SERVICE_NAME = "youtube"
GOOGLE_API_VERSION = "v3"

MAX_RESULTS = 50
PROCESSING_THREADS = 1

class Counter:
    """thread safe counter"""

    def __init__(self):
        """initialize the counter"""
        self.value = 0
        self.lock = threading.Lock()

    def increment(self):
        """increment the counter"""
        with self.lock:
            self.value += 1


def gen_metadata(playlist_item, transcriptDestinationDir):
    """Generate metadata for a video"""

    video_id = playlist_item["snippet"]["resourceId"]["videoId"]
    filename = os.path.join(transcriptDestinationDir, video_id + ".json")

    metadata = {}
    metadata["speaker"] = ""
    metadata["title"] = playlist_item["snippet"]["title"]
    metadata["sourceId"] = playlist_item["snippet"]["resourceId"]["videoId"]
    metadata["description"] = playlist_item["snippet"]["description"]
    metadata["hitTrackingId"] = playlist_item["snippet"]["playlistId"]

    # Ensure the directory exists before saving
    os.makedirs(transcriptDestinationDir, exist_ok=True)

    # Save the metadata as a .json file
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=4, ensure_ascii=False)




def get_transcript(playlist_item, counter_id, transcriptDestinationDir, logger):
    """Get the transcript for a video"""

    video_id = playlist_item["snippet"]["resourceId"]["videoId"]
    filename = os.path.join(transcriptDestinationDir, video_id + ".json.vtt")

    # If video transcript already exists, skip it
    if os.path.exists(filename):
        logger.debug("Skipping video %d, %s", counter_id, video_id)
        return False

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        # Remove \n from the text
        for item in transcript:
            item["text"] = item["text"].replace("\n", " ")

        logger.debug("Transcription download completed: %d, %s", counter_id, video_id)

        # Ensure the directory exists before saving
        os.makedirs(transcriptDestinationDir, exist_ok=True)

        # Save the transcript as a .vtt file
        with open(filename, "w", encoding="utf-8") as file:
            json.dump(transcript, file, indent=4, ensure_ascii=False)

    except NoTranscriptFound:
        logger.debug("No transcript found for video: %s", video_id)
        return False
    except TranscriptsDisabled:
        logger.debug("Transcripts are disabled for video: %s", video_id)
        return False
    except VideoUnavailable:
        logger.debug("Video unavailable: %s", video_id)
        return False
    except Exception as exception:
        logger.debug("An error occurred: %s", str(exception))
        logger.debug("Transcription not found for video: %s", video_id)
        return False

    return True



def process_queue(q, counter, transcriptDestinationDir, logger):
    """Process the queue"""
    while not q.empty():
        video = q.get()

        counter.increment()

        if get_transcript(video, counter.value, transcriptDestinationDir, logger):
            gen_metadata(video, transcriptDestinationDir)
        q.task_done()

def download_transcripts (playlistId, transcriptDestinationDir): 
   
   logging.basicConfig(level=logging.INFO)
   logger = logging.getLogger(__name__)

   formatter = WebVTTFormatter()
   q = queue.Queue()


   if not transcriptDestinationDir:
      logger.error("Transcript folder not provided")
      exit(1)

   if not playlistId:
      logger.error("Playlist ID not provided")
      exit(1)

   counter = Counter()   

   logger.debug("Transcription folder: %s", transcriptDestinationDir)

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
        q.put(item)

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

   logger.info("Total transcriptions to be download: %s", q.qsize())

   start_time = time.time()

   # create multiple threads to process the queue
   threads = []
   for i in range(PROCESSING_THREADS):
      t = threading.Thread(
             target=process_queue,
             args=(q, counter, transcriptDestinationDir, logger),
             )
      t.start()
      threads.append(t)

   # wait for all threads to finish
   for t in threads:
      t.join()

   finish_time = time.time()
   logger.debug("Total time taken: %s", finish_time - start_time)

