'''PipelineStep to crawl a web page and generate sub-links '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
from workflow import PipelineItem, PipelineStep
import logging
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin, urlparse

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
    'Accept-Encoding': 'none',
    'Accept-Language': 'en-US,en;q=0.8',
    'Connection': 'keep-alive'
}


class HtmlLinkCrawler (PipelineStep):
    '''PipelineStep to crawl a web page and generate sub-links '''

    def __init__(self, output_location: str, max_depth: int = 10):
        '''Initialize the HtmlLinkCrawler with the specified output location and maximum depth.

        Parameters:
           output_location (str): The location where the output will be stored.
           max_depth (int): The maximum depth for crawling links, default is 10.
        '''
        super(HtmlLinkCrawler, self).__init__(
            output_location)  # pylint: disable=useless-parent-delegation
        self.max_depth = max_depth

    def crawl(self, pipeline_item: PipelineItem) -> list[PipelineItem]:

        # recurse using strings for URLs as logic is simpler
        links: list[str] = []
        self.crawl_links_recursively(
            pipeline_item.path, links, 0)

        # Then make a pipeline
        pipleline_items = []
        for link in links:
            item = PipelineItem()
            item.path = link
            pipleline_items.append(item)

        return pipleline_items

    def crawl_links_recursively(self, path: str, current_items: list[str], current_depth: int):
        '''
        Recursively crawl links on an HTML page to build a full tree for file search within the same site.

        Args:
           path (str): The URL path to crawl.
           pipeline_items (list[PipelineItem]): List of links crawled so far.
           current_depth (int): The current depth of recursion.

        Returns:
           None
        '''
        logger.debug('Crawling: %s', path)

        # Bail if the link is a mailto
        if path.find('mailto:') != -1:
            return

        # Bail if we hit maximum depth
        current_depth = current_depth + 1
        if current_depth > self.max_depth:
            logger.debug('Depth exceeded: %s', path)
            return

        session = requests.Session()
        if path.find('http') != -1:
            # Add headers in case the website expects cookies and/or JavaScript
            html_content = session.get(path, headers=headers).text
        else:
            with open(path, 'r', encoding='utf-8') as file:
                html_content = file.read()

        soup = BeautifulSoup(html_content, 'html.parser')

        # Add current link to the pipeline
        current_items.append(path)

        sub_links = soup.find_all('a')
        sub_urls = []
        for link in sub_links:
            href = link.get('href')
            if href is not None:
                url = str(href)
                parsed = urlparse(url, "", False)
                parsed_domain = parsed.netloc
                parsed_path = parsed.path
                joined = urljoin('https://' + parsed_domain, parsed_path)
                if not parsed_path.startswith('#') and not find_matching_entry(current_items, joined):
                    sub_urls.append(url)

        full = add_prefix(path, sub_urls)
        deduped = deduplicate(current_items, full)
        trimmed = remove_exits(path, deduped)

        # Recurse where we have not already crawled it
        for link in trimmed:
            if not find_matching_entry(current_items, link):
                self.crawl_links_recursively(
                    link, current_items, current_depth + 1)


def find_matching_entry(array: list[any], target: any):
    '''
   Find a matching entry in the given array.

   Parameters:
   - array (list): The list to search for a matching entry.
   - target (any): The target element to find in the array.

   Returns:
   - any: The matching entry if found, otherwise None.
   '''
    for entry in array:
        if entry == target:
            return entry
    return None


# remove duplicates
def deduplicate(current_links: list[PipelineItem], new_links: list[str]) -> list[str]:
    '''Remove duplicates from a list of new links by comparing them with the current links list.

    Args:
       currentLinks (list): List of current links.
       newLinks (list): List of new links to be checked for duplicates.

    Returns:
       list: A list of new links without any duplicates.
    '''
    deduped = []

    for item in new_links:
        if (find_matching_entry(current_links, item) == None) and find_matching_entry(deduped, item) == None:
            deduped.append(item)

    return deduped


# remove links that point outside the main site being searched
# We keep the argument bcs might need it for more sophisticate checking of URLs leaving the current page
# pylint: disable-next=unused-argument 
def remove_exits(source_url: str, links: list[str]) -> list[str]:
    # we also remove links starting with #as they are just the same page
    '''Remove links that point outside the main site being searched.

    Args:
        source_url (str): The URL of the main site being searched.
        links (list): List of links to be filtered.

    Returns:
        list: Filtered list of links that do not point outside the main site.
    '''

    trimmed = []

    parsed_target = urlparse(source_url)
    target_domain = parsed_target.netloc
    target_path = parsed_target.path

    for item in links:
        # No fragments as we dont want a part within a page
        parsed_item = urlparse(item, "", False)
        item_domain = parsed_item.netloc
        item_path = parsed_item.path
        item_joined = urljoin('https://' + item_domain, item_path)
        if (item_domain == target_domain) and (item_domain == '' or item_path.startswith(target_path)):
            if (not (find_matching_entry(trimmed, item_joined))) and (len (item_path.split('#')) == 1):
                trimmed .append(item)

    return trimmed


def add_prefix(source_url: str, links: str) -> str:
    '''Add prefixes to relative URLs

    Args:
        sourceUrl (str): The base URL to resolve relative links from.
        links (list): List of relative URLs to be prefixed.

    Returns:
        list: List of fully qualified URLs after adding prefixes.
    '''
    full = []

    for item in links:
        new_url = make_fully_qualified_path(source_url, item)
        full.append(new_url)

    return full


def make_fully_qualified_path(base: str, rel: str) -> str:
    return urljoin(base, rel)
