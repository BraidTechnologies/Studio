""" This script downloads the transcripts for all the markdown files in a GitHub repo. """
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import json
import logging
import time
import threading
import queue
import pathlib
from pathlib import Path

# Third-Party Packages
from markdown import markdown
from bs4 import BeautifulSoup

class Counter:
    """Thread-safe counter"""

    def __init__(self):
        """Initialize the counter"""
        self.value = 0
        self.lock = threading.Lock()

    def increment(self):
        """Increment the counter"""
        with self.lock:
            self.value += 1


counter = Counter()

def makeSourceId(repoSourceDir, repoName, filePath):
    """Constructs sourceId from repoSourceDir, repoName, and filePath"""
    relPath = os.path.relpath(filePath, repoSourceDir)
    composite = repoName + '/' + relPath
    unix = Path(composite).as_posix()
    return unix

def md_to_plain_text(md):
    """Converts Markdown content into plain text"""
    html = markdown(md)
    soup = BeautifulSoup(html, features='html.parser')
    fullText = soup.get_text()
    nolineFeeds = fullText.replace("\n", " ")
    return nolineFeeds
    
def get_markdown(fileName, counter_id, repoSourceDir, repoName, markdownDestinationDir, logger):
    """Reads Markdown content from a file and writes out as plain text"""

    sourceId = makeSourceId(repoSourceDir, repoName, fileName)
    fakeName = Path(fileName).name.replace("\\", "_")
    contentOutputFileName = os.path.join(markdownDestinationDir, fakeName + ".json.mdd")
    metaOutputFilename = os.path.join(markdownDestinationDir, fakeName + ".json")

    # if markdown file already exists, skip it
    if os.path.exists(contentOutputFileName):
        logger.debug("Skipping file %d, %s", counter_id, fileName)
        return False    
    
    markdown_content = Path(fileName).read_text(encoding="utf-8")
    plainText = md_to_plain_text(markdown_content) 

    jsonSeg = {"text": plainText, "start": "0"}
    jsonArr = [jsonSeg]
         
    # save the plain text content as a .json.mdd file
    with open(contentOutputFileName, "w", encoding="utf-8") as file:
        json.dump(jsonArr, file, indent=4, ensure_ascii=False)

    metadata = {
        "speaker": "",
        "title": Path(fileName).name,
        "sourceId": sourceId,
        "filename": os.path.basename(contentOutputFileName),
        "description": Path(fileName).name,
        "hitTrackingId": repoName
    }

    # save the metadata as a .json file
    with open(metaOutputFilename, "w", encoding="utf-8") as file:
        json.dump(metadata, file, indent=4, ensure_ascii=False)
    
    logger.debug("Markdown download completed: %d, %s", counter_id, fileName)
    return True

def process_queue(q, repoSourceDir, repoName, markdownDestinationDir, logger):
    """Processes the queue"""
    while not q.empty():
        file = q.get()

        counter.increment()
        get_markdown(file, counter.value, repoSourceDir, repoName, markdownDestinationDir, logger)
        q.task_done()

def download_markdown(repoSourceDir, repoName, markdownDestinationDir): 
    """Main function to download Markdown files"""

    logging.basicConfig(level=logging.WARNING)
    logger = logging.getLogger(__name__)

    MAX_RESULTS = 100
    PROCESSING_THREADS = 1

    q = queue.Queue()

    if not markdownDestinationDir:
        logger.error("Markdown folder not provided")
        exit(1)

    if not repoSourceDir:
        logger.error("Repo name not provided")
        exit(1)

    cwd = os.getcwd()
    logger.debug("Current directory: %s", cwd)
    logger.debug("Repo folder: %s", repoSourceDir)
    logger.debug("Markdown folder: %s", markdownDestinationDir)

    directory_path = Path(repoSourceDir)

    # Use rglob() to recursively search for all files
    searchPath = directory_path.rglob("*.md")
    markdown_files = list(searchPath)

    # Build a queue of Markdown filenames
    for file in markdown_files:
        q.put(str(file))

    logger.info("Total markdown files to be downloaded: %s", q.qsize())

    start_time = time.time()

    # Create multiple threads to process the queue
    threads = []
    for i in range(PROCESSING_THREADS):
        t = threading.Thread(target=process_queue, args=(q, repoSourceDir, repoName, markdownDestinationDir, logger))
        t.start()
        threads.append(t)

    # Wait for all threads to finish
    for t in threads:
        t.join()

    finish_time = time.time()
    logger.debug("Total time taken: %s", finish_time - start_time)

