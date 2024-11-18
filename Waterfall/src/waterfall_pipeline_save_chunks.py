''' Send a final Waterfall report to the DB as Chunks '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import uuid
import datetime
from CommonPy.src.chunk_repository_api import (IStoredChunk,
                                               IStoredTextRendering,
                                               ChunkRepository,
                                               chunk_class_name,
                                               chunk_schema_version,
                                               waterfall_application_name)
from src.workflow import PipelineItem, Theme, WebSearchPipelineSpec
from src.waterfall_pipeline_report_common import write_chart
from src.db_repository import DbRepository

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.ERROR,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.ERROR)


def save_chunks(output_location: str,
                items: list[PipelineItem],
                themes: list[Theme],
                spec: WebSearchPipelineSpec) ->None:
    '''
    Generates a report based on the provided PipelineItems, Themes, and PipelineSpec.

        Parameters:
        - output_location - directory to store file output        
        - items (list[PipelineItem]): A list of PipelineItem objects to generate the report from.
        - themes (list[Theme]): A list of Theme objects associated with the PipelineItems.
        - spec (PipelineSpec): The PipelineSpec object containing specifications for the report.
        '''

    write_chart (output_location, items, themes, spec)

    logger.debug('Writing chunk tree to DB')
    db_repository = DbRepository (waterfall_application_name, spec.description)
    chunk_repository = ChunkRepository ()
    
    utc_time = datetime.datetime.now(datetime.timezone.utc)
    utc_time_string = utc_time.strftime('%Y-%m-%d %H:%M:%S %Z')
        
    for theme in themes:
        new_id = str(uuid.uuid4())
        
        existing_theme = chunk_repository.find (theme.short_description)
        if existing_theme:
            theme_to_save = existing_theme
            theme_to_save.amended = utc_time_string            
        else:
            theme_to_save = IStoredChunk()
            theme_to_save.created = utc_time_string
            theme_to_save.amended = utc_time_string                        

        summary: IStoredTextRendering = IStoredTextRendering()
        summary.text = theme.long_description
        summary.modelId = chunk_repository.default_model
        theme_to_save.storedSummary = summary

        title: IStoredTextRendering = IStoredTextRendering()
        title.text = theme.short_description
        summary.modelId = chunk_repository.default_model

        theme_to_save.applicationId = waterfall_application_name
        theme_to_save.contextId = spec.description
        theme_to_save.className = chunk_class_name

        theme_to_save.id = new_id
        theme_to_save.storedTitle = summary

        theme_to_save.userId = None
        theme_to_save.className = chunk_class_name
        theme_to_save.schemaVersion = chunk_schema_version
        theme_to_save.functionalSearchKey = theme.short_description
        theme_to_save.parentChunkId = None
        theme_to_save.originalText = None
        theme_to_save.storedEmbedding = None
        theme_to_save.storedSummary = summary
        theme_to_save.storedTitle = title
        theme_to_save.relatedChunks = None
       
        # Save all the member items
        for item in theme.member_pipeline_items:
            loaded_item = db_repository.find (item.path)
            if loaded_item is None:
                loaded_item = PipelineItem()                
            loaded_item.parent_id = new_id
            loaded_item.embedding = item.embedding
            loaded_item.summary = item.summary
            loaded_item.text = item.text
            db_repository.save (item)
            
            # Accumulate the related items in the parent Theme
            if theme_to_save.relatedChunks is None:
               theme_to_save.relatedChunks = []
            theme_to_save.relatedChunks.append (item.id)

        # Save the Theme
        chunk_repository.save (theme_to_save)

    # TODO Set parent chunk of each Theme to be the summary,
    # TODO Save the sumary, related links to the Theme Chunk IDs, URL points to the chart HTML

    return
