# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os

# Local Modules
from common.ApiConfiguration import ApiConfiguration
from common.Urls import webUrls, countUrlHits
from web.download_html import download_html
from common.common_functions import ensure_directory_exists
from text.enrich_text_chunks import enrich_text_chunks
from text.enrich_text_summaries import enrich_text_summaries
from text.enrich_text_embeddings import enrich_text_embeddings
from text.enrich_lite import enrich_lite


# Set HTML destination directory
HTML_DESTINATION_DIR = os.path.join("data", "web")
ensure_directory_exists(HTML_DESTINATION_DIR)

config = ApiConfiguration()

# For debugging purposes, you might want to comment/uncomment the following block
# Uncomment to download all URLs
for item in webUrls:
    download_html(item[1], item[2], HTML_DESTINATION_DIR, config.discardIfBelow)

# Keep this comment as example of how to just process one file for debugging
#download_html("https://www.interaction-design.org/literature/topics/design-thinking", 
#              True, HTML_DESTINATION_DIR, 150)

# Enrich the text chunks, summaries, embeddings, and run lite enrichment
enrich_text_chunks(config, HTML_DESTINATION_DIR) 
enrich_text_summaries(config, HTML_DESTINATION_DIR)
enrich_text_embeddings(config, HTML_DESTINATION_DIR)
enrich_lite(HTML_DESTINATION_DIR)

ENRICHMENT_OUTPUT_DIR = os.path.join(HTML_DESTINATION_DIR, "output")

# Count URL hits 
countUrlHits(ENRICHMENT_OUTPUT_DIR, webUrls, "master_text.json", "hit_test_results_web.json")