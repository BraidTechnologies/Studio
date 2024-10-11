""" This script removes the text from the enriched transcript and saves it as a new json file."""
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import json
import os
import logging

def remove_text(segments):
    """This function removes the text from each dictionary in the list."""
    return [
        {k: v for k, v in seg.items() if k != "text" and k != "description"}
        for seg in segments
    ]

def enrich_lite(destinationDir): 
    """Remove text from enriched transcript and save as a new JSON file."""
    
    logging.basicConfig(level=logging.WARNING)
    logger = logging.getLogger(__name__)

    if not destinationDir:
        logger.error("Output folder not provided")
        exit(1)

    # Load source list from JSON file
    input_file = os.path.join(destinationDir, "output", "master_enriched.json")
    with open(input_file, "r", encoding="utf-8") as f:
        segments = json.load(f)

    total_segments = len(segments)

    # Create a lambda function to remove the text from each dictionary in the list
    lite = remove_text(segments)

    # Save the embeddings to a JSON file
    output_file = os.path.join(destinationDir, "output", "master_enriched_lite.json")
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(lite, f)

    logger.debug("Total segments processed: %s", total_segments)