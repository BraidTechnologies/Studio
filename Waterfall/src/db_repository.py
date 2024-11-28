'''
Module to store data in the Chunk table of the BraidApis
This module takes in data as 'PipelineItem', as used in waterfall.
It converts to Chunk  to pass to the native Chunk API, which is common across multiple applications.

'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import datetime
import uuid

from CommonPy.src.chunk_repository_api_types import (IStoredChunk,
   IStoredEmbedding,
   IStoredTextRendering)
from CommonPy.src.chunk_repository_api import (ChunkRepository,
                                               chunk_class_name,
                                               chunk_schema_version)
from src.make_local_file_path import make_local_file_path
from src.workflow import PipelineItem

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.DEBUG)


class DbRepository:
    '''
    Class providing load, save, and existence check for files in the Braid Cosmos database.
    '''

    def __init__(self, application_id: str, context_id: str):

        self.application_id = application_id
        self.context_id = context_id
        self.chunk_repository = ChunkRepository()

    def save(self, item: PipelineItem) -> bool:
        '''
        Save the provided item to the database.

        Parameters:
           functional_key (str): functionalKey to use for the record
           item (PipelineItem): The content to be saved.
        '''
        functional_key = make_local_file_path(item.path)
        logger.debug('Saving: %s', functional_key)

        utc_time = datetime.datetime.now(datetime.timezone.utc)
        utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')

        summary: IStoredTextRendering = IStoredTextRendering()
        summary.modelId = self.chunk_repository.default_model
        summary.text = item.summary

        embedding: IStoredEmbedding = IStoredEmbedding()
        embedding.modelId = self.chunk_repository.default_embedding_model
        embedding.embedding = item.embedding

        # Create a Chunk from the PipelineItem supplied
        chunk: IStoredChunk = IStoredChunk()
        if item.id:
            chunk.id = item.id
        else:
            chunk.id = str(uuid.uuid4())
        chunk.applicationId = self.application_id
        chunk.contextId = self.context_id
        chunk.userId = None
        chunk.created = utc_time_string
        chunk.amended = chunk.created
        chunk.className = chunk_class_name
        chunk.schemaVersion = chunk_schema_version
        chunk.functionalSearchKey = functional_key
        chunk.parentChunkId = item.parent_id
        chunk.originalText = item.text
        chunk.storedEmbedding = embedding
        chunk.storedSummary = summary
        chunk.storedTitle = None
        chunk.relatedChunks = None
        chunk.url = item.path

        return self.chunk_repository.save(chunk)

    def find(self, path: str) -> PipelineItem:
        '''
        Load content from the database based on the provided context and functional key.
        If the file exists in the output location, its contents are read and returned as a string.
        If the record is not found, return None

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           item (PipelineItem): The loaded content or None
        '''

        functional_key = make_local_file_path(path)

        chunk = self.chunk_repository.find(functional_key)

        if chunk:
            # Map from a Chunk to a PipelineItem
            item = PipelineItem()
            item.id = chunk.id
            item.parent_id = chunk.parentChunkId
            item.path = chunk.url
            item.text = chunk.originalText
            if chunk.storedSummary:
                item.summary = chunk.storedSummary.text
            else:
                item.summary = None
            if chunk.storedEmbedding:
                item.embedding = chunk.storedEmbedding.embedding
            else:
                item.embedding = None
        else:
            item = None

        return item

    def exists(self, path: str) -> bool:
        '''
        Checks if a record with the specified key and context exists in the database

        Parameters:
           functional_key (str): functionalKey to use for the record

        Returns:
           bool: True if the record exists, False otherwise.
        '''

        functional_key = make_local_file_path(path)

        return self.chunk_repository.exists(functional_key)
