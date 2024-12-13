# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import pytest
import os
import json
import shutil
import sys
import logging

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.WARNING)

# Add the project root and scripts directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
scripts_dir = os.path.join(project_root, 'scripts')
sys.path.extend([project_root, scripts_dir])

# Import necessary modules from the project
from common.ApiConfiguration import ApiConfiguration
from common.Urls import webUrls, countUrlHits
from common.common_functions import ensure_directory_exists
from web.download_html import download_html
from text.enrich_text_chunks import enrich_text_chunks
from text.enrich_text_summaries import enrich_text_summaries
from text.enrich_text_embeddings import enrich_text_embeddings
from text.enrich_lite import enrich_lite


'''

def create_mock_html_files(test_output_dir, source_url):
    """Create mock HTML files for testing."""
    html_dir = os.path.join(test_output_dir, "html")
    os.makedirs(html_dir, exist_ok=True)
    
    # Create three mock HTML files
    for i in range(3):
        filename = f"mock_page_{i}.json.mdd"
        filepath = os.path.join(html_dir, filename)
        content = [{"text": f"This is mock content for chunk {i}", "start": str(i * 100)}]
        with open(filepath, "w") as f:
            json.dump(content, f)
        
        # Create corresponding metadata file
        meta_filename = f"mock_page_{i}.json"
        meta_filepath = os.path.join(html_dir, meta_filename)
        metadata = {
            "speaker": "",
            "title": f"Mock Page {i}",
            "sourceId": f"{source_url}/page{i}",
            "filename": filename,
            "description": f"Mock description for page {i}",
            "hitTrackingId": source_url
        }
        with open(meta_filepath, "w") as f:
            json.dump(metadata, f)

def test_chunk_addition(tmp_path, config: ApiConfiguration):
    logger.info("Starting chunk addition test")

    test_output_dir = os.path.join(str(tmp_path), "test_output")
    os.makedirs(test_output_dir, exist_ok=True)
    logger.info(f"Created test output directory: {test_output_dir}")

    source_url = "http://example.com/test"
    create_mock_html_files(test_output_dir, source_url)

    # Mock the download_html function to avoid actual web requests
    with patch('web.download_html.download_html', return_value=None):
        # Run the enrichment process
        enrich_text_chunks(config, test_output_dir)

    # Check the output
    master_text_path = os.path.join(test_output_dir, "output", "master_text.json")
    assert os.path.exists(master_text_path), f"master_text.json not found at {master_text_path}"

    with open(master_text_path, "r") as f:
        chunks = json.load(f)

    # Verify that we have exactly 3 chunks
    assert len(chunks) == 3, f"Expected 3 chunks, but got {len(chunks)}"

    # Verify that each chunk has the correct structure and content
    for i, chunk in enumerate(chunks):
        assert chunk["sourceId"] == f"{source_url}/page{i}", f"Incorrect sourceId for chunk {i}"
        assert chunk["text"].startswith(f"This is mock content for chunk {i}"), f"Incorrect content for chunk {i}"
        assert chunk["start"] == str(i * 100), f"Incorrect start time for chunk {i}"
        assert "seconds" in chunk, f"Missing 'seconds' field in chunk {i}"
        assert chunk["hitTrackingId"] == source_url, f"Incorrect hitTrackingId for chunk {i}"

    logger.info("Chunk addition test completed successfully")

'''
# Fixture to create a temporary directory for test output
@pytest.fixture
def test_output_dir(tmpdir):
    dir_path = tmpdir.mkdir("test_output")
    logger.info(f"Created temporary test output directory: {dir_path}")
    yield str(dir_path)
    # Clean up after the test
    logger.info(f"Cleaning up test output directory: {dir_path}")
    shutil.rmtree(str(dir_path))

# Fixture to create an instance of ApiConfiguration
@pytest.fixture
def config():
    logger.info("Creating ApiConfiguration instance")
    return ApiConfiguration()

# Function to check if the content from a source URL is present in the specified file
def check_content(file_path, source_url):
    logger.info(f"Checking content for source URL: {source_url}")
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Could not find master_text.json at {file_path}")
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = json.load(f)
        matching_chunks = [chunk for chunk in content if chunk["hitTrackingId"] == source_url]
        logger.info(f"Found {len(matching_chunks)} chunks for source: {source_url}")
        assert matching_chunks, f"Content from source {source_url} not found"
        return matching_chunks
    except Exception as e:
        logger.error(f"Error checking content for {source_url}: {str(e)}")
        raise

# Function to run the entire pipeline of text enrichment processes
def run_pipeline(config, output_dir):
    logger.info(f"Running pipeline for output directory: {output_dir}")
    try:
        enrich_text_chunks(config, output_dir)
        enrich_text_summaries(config, output_dir)
        enrich_text_embeddings(config, output_dir)
        enrich_lite(output_dir)
        logger.info("Pipeline completed successfully")
    except Exception as e:
        logger.error(f"Error running pipeline: {str(e)}")
        raise

# Function to verify the hit counts for the expected number of sources

def verify_hit_counts(output_dir, expected_sources):
    logger.info(f"Verifying hit counts for {expected_sources} expected sources")
    try:
        with open(os.path.join(output_dir, "hit_test_results.json"), "r", encoding="utf-8") as f:
            hit_counts = json.load(f)
        
        assert len(hit_counts) == expected_sources, f"Expected hit counts for {expected_sources} sources, got {len(hit_counts)}"
        
        for i, hit in enumerate(hit_counts):
            logger.info(f"Source {i+1} ({hit['path']}) hit count: {hit['hits']}")
            assert hit['hits'] > 0, f"No hits found for source {hit['path']}. Hit counts: {hit_counts}"
        
        logger.info("Hit count verification completed successfully")
    except Exception as e:
        logger.error(f"Error verifying hit counts: {str(e)}")
        raise

def test_web_pipeline(tmp_path, config: ApiConfiguration):
    logger.info("Starting web pipeline test")

    # Create a new directory for test output
    test_output_dir = os.path.join(str(tmp_path), "test_output")
    os.makedirs(test_output_dir, exist_ok=True)
    logger.info(f"Created test output directory: {test_output_dir}")

    # Clean contents (in case of a failed previous run)
    for item in os.listdir(test_output_dir):
        item_path = os.path.join(test_output_dir, item)
        if os.path.isdir(item_path):
            shutil.rmtree(item_path)
        else:
            os.remove(item_path)
    logger.info("Cleaned test output directory")

    source1 = webUrls[0]  # First source URL
    source2 = webUrls[1]  # Second source URL

    try:
        # Download source 1 and run the whole pipeline
        logger.info(f"Downloading and processing source 1: {source1[1]}")
        download_html(source1[1], source1[2], test_output_dir, config.discardIfBelow)
        run_pipeline(config, test_output_dir)

        # Load JSON output and confirm content from source 1
        master_text_path = os.path.join(test_output_dir, "output", "master_text.json")
        source1_chunks = check_content(master_text_path, source1[1])
        assert source1_chunks, f"No content found for source 1: {source1[1]}"
        logger.info("Confirmed content from source 1")

        # Add source 2 and run the whole pipeline again
        logger.info(f"Downloading and processing source 2: {source2[1]}")
        download_html(source2[1], source2[2], test_output_dir, config.discardIfBelow)
        run_pipeline(config, test_output_dir)

        # Load JSON output and confirm content from both sources
        source1_chunks = check_content(master_text_path, source1[1])
        source2_chunks = check_content(master_text_path, source2[1])
        assert source1_chunks, f"No content found for source 1: {source1[1]}"
        assert source2_chunks, f"No content found for source 2: {source2[1]}"
        logger.info("Confirmed content from both sources")

        # Count URL hits
        test_webUrls = [source1, source2]
        logger.info("Counting URL hits")
        output_dir = os.path.join(test_output_dir, "output")
        countUrlHits(output_dir, test_webUrls, "master_text.json", "hit_test_results.json")

        # Verify the hit counts
        verify_hit_counts(output_dir, 2)  # Expect 2 sources with hits

        logger.info("Web pipeline test completed successfully")

    except Exception as e:
        logger.error(f"Web pipeline test failed: {str(e)}")
        raise

    finally:
        # Clean up by deleting the test output directory and all files
        shutil.rmtree(test_output_dir)
        logger.info(f"Cleaned up test output directory: {test_output_dir}")

    logger.info("Web pipeline test completed")

