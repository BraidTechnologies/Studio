''' Tests for the DB API '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging
import uuid
import datetime

from src.chunk_repository_api import ChunkRepository, IStoredChunk, IStoredEmbedding, IStoredTextRendering

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

embedding: IStoredEmbedding = IStoredEmbedding()
embedding.embedding = [1.0, 2.0]
embedding.modelId = 'MadeUpEmbeddingModel'

summary: IStoredTextRendering = IStoredTextRendering()
summary.text = 'Summary text'
summary.modelId = 'MadeUpModel'

title: IStoredTextRendering = IStoredTextRendering()
title.text = 'Title text'
title.modelId = 'MadeUpModel'

master_chunk: IStoredChunk = IStoredChunk()
master_chunk.id = str(uuid.uuid4())
master_chunk.applicationId = 'TestApplication'
master_chunk.contextId = 'TestContext'
master_chunk.functionalSearchKey = 'TestKey' + str(uuid.uuid4())
master_chunk.userId = None
master_chunk.created = utc_time_string
master_chunk.amended = utc_time_string
master_chunk.className = 'madeUpClass'
master_chunk.schemaVersion = '1'
master_chunk.parentChunkId = None
master_chunk.originalText = 'Original test'
master_chunk.storedEmbedding = embedding
master_chunk.storedSummary = summary
master_chunk.storedTitle = title
master_chunk.relatedChunks = [str(uuid.uuid4()), str(uuid.uuid4())]


def test_basic():
    ''' Test construction '''
    repository = ChunkRepository()
    assert repository  # If we get here without exceptions we are ok


def test_does_not_exist():
    ''' Test non-existence '''
    test_path = 'fail_test.html'

    repository = ChunkRepository()
    exists = repository.exists(test_path)

    assert not exists


def test_save():
    ''' Test save '''

    repository = ChunkRepository()
    saved = repository.save(master_chunk)

    assert saved


def test_save_exists():
    ''' Test save & then that it exists '''

    repository = ChunkRepository()
    saved = repository.save(master_chunk)

    exists = False

    if saved:
        exists = repository.exists(master_chunk.functionalSearchKey)

    assert saved
    assert exists


def test_save_find():
    ''' Test save & then that it can be loaded '''

    repository = ChunkRepository()
    saved = repository.save(master_chunk)

    loaded = False

    if saved:
        loaded = repository.find(master_chunk.functionalSearchKey)

    assert saved
    assert loaded
    assert loaded.storedEmbedding.embedding == master_chunk.storedEmbedding.embedding
    assert loaded.storedSummary.text == master_chunk.storedSummary.text
