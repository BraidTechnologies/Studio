''' Tests for the DB API '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging
import uuid

from src.page_repository_api import (
    PageRepository, make_page_from_file)

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

page = make_page_from_file('TestApplication', 
                           'TestContext', 
                           'TestKey' + str(uuid.uuid4()), 
                           'madeUpClass', 
                           '1', 
                           str(uuid.uuid4()),
                           test_root, 
                           'page_test.html')

def test_basic():
    ''' Test construction '''
    repository = PageRepository()
    assert repository  # If we get here without exceptions we are ok


def test_does_not_exist():
    ''' Test non-existence '''
    test_path = 'fail_test.html'

    repository = PageRepository()
    exists = repository.load(test_path)

    assert not exists


def test_save():
    ''' Test save '''

    repository = PageRepository()
    saved = repository.save(page)

    assert saved


def test_save_load():
    ''' Test save & then that it can be loaded '''

    repository = PageRepository()
    saved = repository.save(page)

    loaded = False

    if saved:
        loaded = repository.load(page.id)

    assert saved
    assert loaded
