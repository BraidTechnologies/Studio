''' Send a final Waterfall report to the DB as Chunks '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import uuid
import datetime

from CommonPy.src.chunk_repository_api import (ChunkRepository,
                                               chunk_class_name,
                                               chunk_schema_version,
                                               waterfall_application_name,
                                               boxer_application_name)
from CommonPy.src.chunk_repository_api_types import (IStoredChunk, create_text_rendering, create_embedding)

from CommonPy.src.page_repository_api import (PageRepository,
                                              page_class_name,
                                              page_schema_version,
                                              make_page_from_file)
from CommonPy.src.page_repository_api_types import (IStoredPage)

from src.workflow import PipelineItem, Theme, WebSearchPipelineSpec, PipelineFileSpec
from src.waterfall_pipeline_report_common import write_chart
from src.db_repository import DbRepository
from src.embedder import Embedder


# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.ERROR,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.ERROR)

def set_timestamps (chunk: IStoredChunk, existing: bool) -> None:
    ''' Set timestamps on Chunk depending it it is new or amended '''
    utc_time = datetime.datetime.now(datetime.timezone.utc)
    utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')
    if existing:
        chunk.amended = utc_time_string
    else:
        chunk.created = utc_time_string
        chunk.amended = utc_time_string

def create_theme_chunk (short_description: str,
                        context: str,
                        long_description : str,
                        output_location: str,
                        chunk_repository: ChunkRepository) -> IStoredChunk:
    ''' Utility function to create a chunk from Theme attributes '''
    existing_theme = chunk_repository.find (short_description)
    if existing_theme:
        theme_to_save = existing_theme
    else:
        theme_to_save = IStoredChunk()

    embedder = Embedder(output_location)

    set_timestamps (theme_to_save, existing_theme is not None)

    embedding = embedder.embed_text (long_description)

    theme_to_save.storedSummary = create_text_rendering (long_description,
                                                         chunk_repository.default_model)
    theme_to_save.storedTitle = create_text_rendering (short_description,
                                                       chunk_repository.default_model)
    theme_to_save.storedEmbedding = create_embedding (embedding,
                                                      chunk_repository.default_embedding_model)

    theme_to_save.applicationId = waterfall_application_name
    theme_to_save.contextId = context
    theme_to_save.className = chunk_class_name
    theme_to_save.schemaVersion = chunk_schema_version
    theme_to_save.functionalSearchKey = short_description

    theme_to_save.userId = None
    theme_to_save.originalText = long_description
    theme_to_save.relatedChunks = None

    return theme_to_save

def save_chunks (items: list[PipelineItem],
                 spec: PipelineFileSpec) -> None:
     
    db_repository = DbRepository(boxer_application_name, spec.description)
    for item in items:
        loaded_item = db_repository.find(item.path)
        if loaded_item is None:
            loaded_item = PipelineItem()
            loaded_item.id = str(uuid.uuid4())
        loaded_item.parent_id = None
        loaded_item.path = item.path
        loaded_item.embedding = item.embedding
        loaded_item.summary = item.summary
        loaded_item.text = item.text
        db_repository.save(loaded_item)

def save_chunk_tree(output_location: str,
                items: list[PipelineItem],
                themes: list[Theme],
                spec: WebSearchPipelineSpec) ->None:
    '''
    saves chunks in a tree based on the provided PipelineItems, Themes, and PipelineSpec. 
    There is one root chunk, then one per Theme, then one per Item. 

        Parameters:
        - output_location - directory to store file output
        - items (list[PipelineItem]): A list of PipelineItem objects to generate the report from.
        - themes (list[Theme]): A list of Theme objects associated with the PipelineItems.
        - spec (PipelineSpec): The PipelineSpec object containing specifications for the report.
        '''

    write_chart (output_location, items, themes, spec)

    logger.debug('Writing chunk tree to DB')
    embedder = Embedder(output_location)
    db_repository = DbRepository (waterfall_application_name, spec.description)
    chunk_repository = ChunkRepository ()

    # First we either load the master theme if it exists, or create a new one
    loaded_master_theme = chunk_repository.find (spec.description)
    if loaded_master_theme is None:
        master_id = str(uuid.uuid4())
        master_theme = create_theme_chunk (spec.description,
                                           spec.description,
                                           '',
                                           output_location,
                                           chunk_repository)
        master_theme.id = master_id
        master_theme.parentChunkId = None
    else:
        master_id = loaded_master_theme.id
        master_theme = loaded_master_theme
        master_theme.relatedChunks = None
        master_theme.storedSummary = None
        master_theme.storedTitle = None
        master_theme.originalText = None     
        master_theme.storedEmbedding = None

    for theme in themes:

        loaded_theme = chunk_repository.find (theme.short_description)
        if loaded_theme is None:
            theme_id = str(uuid.uuid4())            
        else:
            theme_id = loaded_theme.id

        theme_to_save = create_theme_chunk (theme.short_description,
                                            spec.description,
                                            theme.long_description,
                                            output_location,
                                            chunk_repository)
        theme_to_save.id = theme_id
        theme_to_save.parentChunkId = master_id       

        # Save all the member items
        for item in theme.member_pipeline_items:
            loaded_item = db_repository.find (item.path)
            if loaded_item is None:
                loaded_item = PipelineItem()
                loaded_item.id = str(uuid.uuid4())
            loaded_item.parent_id = theme_id
            loaded_item.path = item.path
            loaded_item.embedding = item.embedding
            loaded_item.summary = item.summary
            loaded_item.text = item.text
            db_repository.save (loaded_item)

            # Accumulate the related items in the parent Theme
            if theme_to_save.relatedChunks is None:
                theme_to_save.relatedChunks = []
            theme_to_save.relatedChunks.append (loaded_item.id)

        # Save the Theme
        chunk_repository.save (theme_to_save)

        # Save the Theme as a related item to the master theme
        if master_theme.relatedChunks is None:
            master_theme.relatedChunks = []
        master_theme.relatedChunks.append (theme_id)

        # Build up summary text on the main entry
        if master_theme.originalText is None:
            master_theme.originalText = theme.long_description
        else:
            master_theme.originalText = master_theme.originalText + '\n\n' + theme.long_description

    # Save the Theme
    master_theme.url = "https://braid-api.azurewebsites.net/api/GetPage?id=" + str(master_theme.id)

    master_theme_embedding = embedder.embed_text (master_theme.originalText)
    master_theme.storedEmbedding = create_embedding (master_theme_embedding, chunk_repository.default_embedding_model)
    master_theme.storedSummary = create_text_rendering (master_theme.originalText, chunk_repository.default_model)
    master_theme.storedTitle = create_text_rendering (spec.description, chunk_repository.default_model)    

    chunk_repository.save (master_theme)

    # Save the Page - use functional search key and id from the parent theme
    page_repository = PageRepository()

    page : IStoredPage= make_page_from_file (waterfall_application_name,
                                spec.description,
                                master_theme.functionalSearchKey,
                                page_class_name,
                                page_schema_version,
                                master_theme.id,
                                output_location,
                                spec.output_chart_name)
    page_repository.save (page)
