# Copyright (c) 2024 Braid Technologies Ltd
import os

# Local Modules
from common.ApiConfiguration import ApiConfiguration
from common.Urls import gitHubUrls, countUrlHits
from common.common_functions import ensure_directory_exists
from github.download_markdown import download_markdown
from text.enrich_text_chunks import enrich_text_chunks
from text.enrich_text_summaries import enrich_text_summaries
from text.enrich_text_embeddings import enrich_text_embeddings
from text.enrich_lite import enrich_lite

MARKDOWN_DESTINATION_DIR = os.path.join("data", "github")
ensure_directory_exists(MARKDOWN_DESTINATION_DIR)

config = ApiConfiguration()

for item in gitHubUrls:
   download_markdown (item[2], item[1], MARKDOWN_DESTINATION_DIR)

enrich_text_chunks(config,MARKDOWN_DESTINATION_DIR) 
enrich_text_summaries(config, MARKDOWN_DESTINATION_DIR)
enrich_text_embeddings(config, MARKDOWN_DESTINATION_DIR)
enrich_lite(MARKDOWN_DESTINATION_DIR)

output_dir = os.path.join(MARKDOWN_DESTINATION_DIR, "output") 
countUrlHits (output_dir, gitHubUrls, "master_text.json", "hit_test_results.json")