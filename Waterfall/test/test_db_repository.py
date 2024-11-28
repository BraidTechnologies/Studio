''' Tests for the DB API '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.workflow import PipelineItem
from src.db_repository import DbRepository

test_root = os.path.dirname(__file__)
parent = os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)


def test_basic():
    ''' Test construction '''
    application_id = "TestApplication"
    test_context = 'TestContext'
    repository = DbRepository(application_id, test_context)
    assert repository.context_id == test_context


def test_does_not_exist():
    ''' Test non-existence '''
    test_path = 'fail_test.html'

    application_id = "TestApplication"
    test_context = 'TestContext'
    repository = DbRepository(application_id, test_context)
    exists = repository.exists(test_path)

    assert not exists


def test_save():
    ''' Test save '''
    item = PipelineItem()
    item.path = 'https://microsoft.com'
    item.summary = 'Summary'
    item.embedding = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]

    application_id = "TestApplication"
    test_context = 'TestContext'
    repository = DbRepository(application_id, test_context)
    saved = repository.save(item)

    assert saved


def test_save_exists():
    ''' Test save & then that it exists '''

    item = PipelineItem()
    item.path = 'https://microsoft.com'
    item.summary = 'Summary'
    item.embedding = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]

    application_id = "TestApplication"
    test_context = 'TestContext'
    repository = DbRepository(application_id, test_context)
    saved = repository.save(item)

    exists = False

    if saved:
        exists = repository.exists(item.path)

    assert saved
    assert exists


def test_save_load():
    ''' Test save & then that it can be loaded '''

    item = PipelineItem()
    item.path = 'https://microsoft.com'
    item.summary = 'Summary'
    item.embedding = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]

    application_id = "TestApplication"
    test_context = 'TestContext'
    repository = DbRepository(application_id, test_context)
    saved = repository.save(item)

    loaded = False

    if saved:
        loaded = repository.find(item.path)

    assert saved
    assert loaded
    assert loaded.path == item.path
    assert loaded.embedding == item.embedding
    assert loaded.summary == item.summary
