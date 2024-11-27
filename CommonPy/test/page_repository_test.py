''' Tests for the DB API '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging
import uuid
import datetime

from src.page_repository_api import PageRepository, IStoredPage, compress_string

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

utc_time = datetime.datetime.now(datetime.timezone.utc)
utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')

page: IStoredPage = IStoredPage()
page.id = str(uuid.uuid4())
page.applicationId = 'TestApplication'
page.contextId = 'TestContext'
page.functionalSearchKey = 'TestKey' + str(uuid.uuid4())
page.userId = None
page.created = utc_time_string
page.amended = utc_time_string
page.className = 'madeUpClass'
page.schemaVersion = '1'
page.html = compress_string('<html></html>')


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
