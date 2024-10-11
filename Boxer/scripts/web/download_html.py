""" This script downloads the text content for all sub pages of a URL. """
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import json
import logging
import time
import threading
import queue
from pathlib import Path
from urllib.parse import urlsplit, urljoin

# Third-Party Packages
from bs4 import BeautifulSoup
import requests


MAX_LINKS_PERPAGE=256 #Max number of links we keep from a single page
MAX_PAGE_DEPTH=1     #Max depth we search in a website
AVERAGE_CHARACTERS_PER_TOKEN=6

headers = {
   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
   'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
   'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
   'Accept-Encoding': 'none',
   'Accept-Language': 'en-US,en;q=0.8',
   'Connection': 'keep-alive'       
}  

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


counter = Counter()

def makePathOnly (url):
    split_url = urlsplit(url)
    # split_url.scheme   "http"
    # split_url.netloc   "127.0.0.1" 
    # split_url.path     "/asdf/login.php"
    # Use all the path 
    clean_path = str(split_url.netloc) + split_url.path
    return clean_path

def makeFullyQualified (base, rel):
    return urljoin(base,rel)
    
def get_html(url, counter_id, siteUrl, htmlDesitinationDir, logger, minimumPageTokenCount):
    """Read in HTML content and write out as plain text """

    sourceId = makePathOnly (url)
    fakeName = sourceId.replace("//", "_").replace("/", "_")
    contentOutputFileName = os.path.join(htmlDesitinationDir, f"{fakeName}.json.mdd")
    metaOutputFilename = os.path.join(htmlDesitinationDir, f"{fakeName}.json")

    # if markdown file already exists, skip it
    if os.path.exists(contentOutputFileName):
        logger.debug("Skipping : %s", url)
        return False    
    
    # In case the web site expect cookies and/or javascript
    session = requests.Session()     
    page = session.get(url, headers=headers)
    soup = BeautifulSoup(page.content, "html.parser") 
    fullText = soup.get_text()
    nolineFeeds = fullText.replace("\n", " ")
    # dont add very short pages
    if len(nolineFeeds) < minimumPageTokenCount * AVERAGE_CHARACTERS_PER_TOKEN:
       logger.debug("Skipping : %s", url)
       return    

    jsonSeg = dict()
    jsonSeg["text"] = nolineFeeds
    jsonSeg["start"] = "0"
    jsonArr = [""]
    jsonArr[0] = jsonSeg
         
    # save the plain text content as a .json.mdd file
    with open(contentOutputFileName, "w", encoding="utf-8") as file:
        json.dump(jsonArr, file, indent=4, ensure_ascii=False)

    metadata = {}
    metadata["speaker"] = ""
    metadata["title"] = Path(url).name
    metadata["sourceId"] = sourceId
    metadata["filename"] = os.path.basename(contentOutputFileName)   
    metadata["description"] = Path(url).name
    metadata["hitTrackingId"] = siteUrl    

    # save the metadata as a .json file
    json.dump(metadata, open(metaOutputFilename, "w", encoding="utf-8"))
    
    logger.debug("Html download completed: %d, %s", counter_id, url)

    return True


def process_queue(q, sourceUrl, htmlDestinationDir, logger, minimumPageTokenCount):
    """process the queue"""
    while not q.empty():
        file = q.get()

        counter.increment()

        get_html(file, counter.value, sourceUrl, htmlDestinationDir, logger, minimumPageTokenCount)
        q.task_done()


def deduplicate(currentLinks, newLinks): # remove duplicates 

    deduped = []

    for item in newLinks:
        if not item in currentLinks:
           deduped.append(item)
    
    return deduped

def remove_exits(sourceUrl, links): # remove links that point outside the main site being searched
                                    # we also remove links starting with #as they are just the same page
    """ Remove links that point outside the main site being searched """
    trimmed = []

    for item in links:
        match = (item.startswith(sourceUrl) 
                 and (not '#' in item))
        if match :
            trimmed .append(item)        

    return trimmed

def add_prefix(sourceUrl, links):
    """ Add prefixes to relative URLs """

    full = []

    for item in links:
        newUrl = makeFullyQualified(sourceUrl, item)
        full.append(newUrl)

    return full


def recurse_page_list(startUrl, processedLinks, depth, logger, recurse):
    """ Recursively crawl through pages starting from startUrl """

    # Bail if we hit maximum depth
    if depth > MAX_PAGE_DEPTH:
        logger.debug("Depth exceeded: %s", startUrl)
        return

    # In case the website expects cookies and/or JavaScript
    session = requests.Session()
    page = session.get(startUrl, headers=headers)
    soup = BeautifulSoup(page.text, "html.parser")

    logger.debug("Processing: %s", startUrl)
    processedLinks.append(startUrl)

    if not recurse:
        return

    subLinks = soup.find_all('a')
    subUrls = []

    for link in subLinks:
        url = str(link.get('href'))
        subUrls.append(url)

    full = add_prefix(startUrl, subUrls)
    deduped = deduplicate(processedLinks, full)
    trimmed = remove_exits(startUrl, deduped)

    for link in trimmed:
        if link not in processedLinks:
            recurse_page_list(link, processedLinks, depth + 1, logger, recurse)

         
def build_page_list(sourceUrl, q, minimumPageTokenCount, logger, recurse):
    """ Build a list of pages starting from sourceUrl """

    links = []

    recurse_page_list(sourceUrl, links, 0, logger, recurse)

    for url in links:
        q.put(url)
    
def download_html (sourceUrl, recurse, htmlDesitinationDir, minimumPageTokenCount): 
   
   logging.basicConfig(level=logging.WARNING)
   logger = logging.getLogger(__name__)

   PROCESSING_THREADS = 1

   q = queue.Queue()

   if not htmlDesitinationDir:
      logger.error("Html folder not provided")
      exit(1)

   if not sourceUrl:
      logger.error("Source url not provided")
      exit(1)

   logger.debug("Source URL: %s", sourceUrl)
   logger.debug("Html folder: %s", htmlDesitinationDir)

   # Recursively search for all html files  
   build_page_list (sourceUrl, q, minimumPageTokenCount, logger, recurse)
   
   logger.info("Total HTML files to be downloaded: %s", q.qsize())

   start_time = time.time()

   # create multiple threads to process the queue
   threads = []
   for i in range(PROCESSING_THREADS):
      t = threading.Thread(
         target=process_queue,
                args=(q, sourceUrl, htmlDesitinationDir, logger, minimumPageTokenCount),
         )
      t.start()
   threads.append(t)

   # wait for all threads to finish
   for t in threads:
      t.join()

   finish_time = time.time()
   logger.debug("Total time taken: %s", finish_time - start_time)
