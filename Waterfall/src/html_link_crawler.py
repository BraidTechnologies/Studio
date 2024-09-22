'''PipelineStep to crawl a web page and generate sub-links '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
from workflow import PipelineItem, PipelineStep
import logging
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin

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
        super(HtmlLinkCrawler, self).__init__(output_location) # pylint: disable=useless-parent-delegation
        self.max_depth = max_depth

    def crawl(self, pipeline_item: PipelineItem) -> list[PipelineItem]:
        links: list[PipelineItem] = []
        self.crawl_links_recursively(
            pipeline_item.path, self.output_location, links, 0)
        return links

    def crawl_links_recursively(self, path: str, output_location: str, pipeline_items: list[PipelineItem], current_depth: int):
        '''
        Recursively crawl links on an HTML page to build a full tree for file search within the same site.

        Args:
           path (str): The URL path to crawl.
           output_location (str): The location to store the crawled links.
           pipeline_items (list[PipelineItem]): List of links crawled so far.
           current_depth (int): The current depth of recursion.

        Returns:
           None
        '''
        logger.debug('Crawling: %s', path)

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

        pipeline_item = PipelineItem()
        pipeline_item.path = path
        pipeline_items.append(pipeline_item)

        sub_links = soup.find_all('a')
        sub_urls = []
        for link in sub_links:
            url = str(link.get('href'))
            sub_urls.append(url)

        full = add_prefix(path, sub_urls)
        deduped = deduplicate(pipeline_items, full)
        trimmed = remove_exits(path, deduped)

        for link in trimmed:
            if link not in pipeline_items:
                self.crawl_links_recursively(
                    link, output_location, pipeline_items, current_depth + 1)


# remove duplicates
def deduplicate(current_links: list[str], new_links: list[str]) -> list[str]:
    '''Remove duplicates from a list of new links by comparing them with the current links list.

    Args:
       currentLinks (list): List of current links.
       newLinks (list): List of new links to be checked for duplicates.

    Returns:
       list: A list of new links without any duplicates.
    '''
    deduped = []

    for item in new_links:
        if not item in current_links:
            deduped.append(item)

    return deduped


# remove links that point outside the main site being searched
# pylint: disable-next=unused-argument we keep the argument bcs might need it for more sophisticate checking of URLs leaving the current page
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

    for item in links:
        match = ((not 'http' in item)
                 and (not '#' in item))
        if match:
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
