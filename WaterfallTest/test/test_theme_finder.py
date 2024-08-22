# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)

from src.theme_finder import ThemeFinder
from src.summariser import Summariser
from src.html_file_downloader import HtmlFileDownloader

def test_basic ():
    test_text = "This is some text"

    summariser = ThemeFinder  (test_text)
    assert summariser.text == test_text 

def test_with_output ():
    test_root = os.path.dirname(__file__)
    os.chdir (test_root)
    test_paths = ['cluster_test_4.html','cluster_test_5.html']
    test_output_location = 'test_output'

    accumulated_summary = ""
    for test_path in test_paths:
       downloader = HtmlFileDownloader (test_path, test_output_location)
       text = downloader.download () 

       summariser = Summariser (test_path, test_output_location)
       summary = summariser.summarise (text)    

       accumulated_summary = accumulated_summary + "\n\n" + summary

    theme_finder = ThemeFinder ()
    theme = theme_finder.find_theme (accumulated_summary, 15)    
    assert len(theme) > 0