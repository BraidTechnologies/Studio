import pytest
import os
import sys
import json
from unittest.mock import MagicMock, patch, mock_open
from pathlib import Path
from collections import namedtuple

# Add the parent directory of the test file to the Python path for importing modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from scripts.text.enrich_text_chunks import (
    append_text_to_previous_chunk,
    add_new_chunk,
    parse_json_mdd_transcript,
    enrich_text_chunks
)
from scripts.web.download_html import download_html

# Constants for testing, used for calculating chunk sizes and overlaps
PERCENTAGE_OVERLAP = 0.05
AVERAGE_WORDS_PER_MINUTE = 100
AVERAGE_CHARACTERS_PER_TOKEN = 4
AVERAGE_TOKENS_PER_WORD = 1.33

# Mock configuration for the chunking process
Config = namedtuple('Config', ['chunkDurationMins', 'discardIfBelow', 'maxTokens'])
mock_config = Config(chunkDurationMins=1, discardIfBelow=10, maxTokens=15)  # Adjust maxTokens to ensure chunking

# Mock metadata for chunks, used in the tests
mock_metadata = {
    "speaker": "",
    "title": "Test Title",
    "sourceId": "test-source",
    "filename": "test_file.json.mdd",
    "description": "Test description",
    "hitTrackingId": "https://test.com",
    "start": "0",
    "seconds": 145,
    "text": "This is a test text content."
}

def calculate_exact_text_length(config):
    """
    Calculate the exact number of characters required to generate a specified number of chunks.

    Args:
        config: The configuration object with chunk duration and max tokens.

    Returns:
        int: The total number of characters required for the desired number of chunks.
    """
    tokens_per_chunk = config.maxTokens - int(config.maxTokens * PERCENTAGE_OVERLAP)
    characters_per_chunk = tokens_per_chunk * AVERAGE_CHARACTERS_PER_TOKEN
    total_characters_required = characters_per_chunk * 3  # For 3 chunks
    return total_characters_required

def generate_mock_mdd_content(total_characters_required):
    """
    Generate mock content for an MDD file with three parts, based on the total required characters.

    Args:
        total_characters_required: The total number of characters required.

    Returns:
        str: The JSON string representing the mock MDD content.
    """
    sample_text = "This is a paragraph of text. " * (total_characters_required // len("This is a paragraph of text. ") + 1)
    sample_text = sample_text[:total_characters_required]

    return json.dumps([
        {"text": sample_text[:total_characters_required // 3], "start": "0", "duration": "60"},
        {"text": sample_text[total_characters_required // 3: 2 * total_characters_required // 3], "start": "60", "duration": "60"},
        {"text": sample_text[2 * total_characters_required // 3:], "start": "120", "duration": "60"}
    ])

def create_tokenizer_mock():
    """
    Create a mock tokenizer that simulates realistic token encoding behavior.

    Returns:
        MagicMock: A mock tokenizer with customized encoding behavior.
    """
    tokenizer = MagicMock()
    tokenizer.encode = MagicMock(side_effect=lambda text, disallowed_special=None: list(range(len(text.split()))))
    return tokenizer

@patch('scripts.web.download_html.requests.Session')
@patch('builtins.open', new_callable=mock_open)
@patch('json.dump')
def test_download_html(mock_json_dump, mock_file, mock_session):
    """
    Test the download_html function for downloading and processing HTML content.

    Args:
        mock_json_dump: Mock for the json.dump function.
        mock_file: Mock for the open function.
        mock_session: Mock for the requests.Session class.
    """
    # Mock HTML content
    mock_html = "<html><body><p>This is a test paragraph.</p></body></html>"
    mock_response = mock_session.return_value.get.return_value
    mock_response.content = mock_html.encode('utf-8')
    mock_response.text = mock_html

    # Mock BeautifulSoup
    with patch('scripts.web.download_html.BeautifulSoup') as mock_bs:
        mock_bs.return_value.get_text.return_value = "This is a test paragraph."

        # Run the download_html function
        download_html('http://example.com', False, '/tmp/html', 1)

    # Adjusted expected file path for content
    expected_content_file_path = os.path.normpath('/tmp/html/example.com.json.mdd')
    expected_metadata_file_path = os.path.normpath('/tmp/html/example.com.json')

    # Normalize the actual file paths called with
    actual_content_file_path = os.path.normpath(mock_file.call_args_list[0][0][0])
    actual_metadata_file_path = os.path.normpath(mock_file.call_args_list[1][0][0])

    # Check that the files were opened with the correct paths
    assert actual_content_file_path == expected_content_file_path
    assert actual_metadata_file_path == expected_metadata_file_path

    # Check if json.dump was called with correct content data
    expected_content = [{"text": "This is a test paragraph.", "start": "0"}]
    mock_json_dump.assert_any_call(expected_content, mock_file(), indent=4, ensure_ascii=False)

def test_append_text_to_previous_chunk():
    """
    Test the append_text_to_previous_chunk function to verify text is correctly appended with overlap.
    """
    chunks = [{"text": "Hello world "}]
    text = "This is a test sentence."

    append_text_to_previous_chunk(text, chunks)

    words = text.split(" ")
    expected_overlap_length = int(len(words) * PERCENTAGE_OVERLAP)
    expected_overlap = " ".join(words[:expected_overlap_length])
    assert chunks[-1]["text"].endswith(expected_overlap)

def test_add_new_chunk():
    """
    Test the add_new_chunk function to ensure new chunks are correctly added.
    """
    metadata = {"title": "Test Title", "description": "Test description", "start": "0"}
    text = "This is a test sentence."
    chunk_begin_tokens = 0
    chunks = []
    minimumSegmentTokenCount = 3

    add_new_chunk(metadata, text, chunk_begin_tokens, chunks, minimumSegmentTokenCount)

    assert len(chunks) == 1
    assert chunks[0]["text"] == text
    assert chunks[0]["start"] == str(chunk_begin_tokens)

    characters_per_minute = AVERAGE_WORDS_PER_MINUTE * AVERAGE_CHARACTERS_PER_TOKEN
    expected_seconds = int(len(text) / (characters_per_minute / 60))
    assert chunks[0]["seconds"] == expected_seconds

def test_parse_json_mdd_transcript(tmp_path):
    """
    Test the parse_json_mdd_transcript function with a manually created MDD file.

    Args:
        tmp_path: A pytest fixture providing a temporary directory.
    """
    config = MagicMock()
    config.chunkDurationMins = 1
    config.discardIfBelow = 1
    config.maxTokens = 15  # Adjust maxTokens to force chunking

    metadata = {
        "title": "Test Title",
        "description": "Test description",
        "filename": "test_mdd.json.mdd",
        "start": "0",
        "seconds": 180
    }

    total_characters_required = calculate_exact_text_length(config)
    tokenizer = create_tokenizer_mock()

    # Write the mock MDD content to a temporary file
    mock_mdd_content = generate_mock_mdd_content(total_characters_required)
    mdd_path = tmp_path / "test_mdd.json.mdd"
    mdd_path.write_text(mock_mdd_content)

    chunks = []
    parse_json_mdd_transcript(config, str(mdd_path), metadata, tokenizer, chunks)

    assert len(chunks) == 3

@pytest.fixture
def mock_file_system(tmp_path):
    """
    A pytest fixture to create a mock file system structure for testing.

    Args:
        tmp_path: A pytest fixture providing a temporary directory.

    Returns:
        str: The path to the mock file system.
    """
    # Create a temporary directory structure
    markdown_dir = tmp_path / "markdown"
    markdown_dir.mkdir()

    total_characters_required = calculate_exact_text_length(mock_config)
    sample_text = "This is a paragraph of text. " * (total_characters_required // len("This is a paragraph of text. ") + 1)
    sample_text = sample_text[:total_characters_required]

    # Ensure the mock MDD content has the exact length for 3 chunks
    sample_mdd_content = json.dumps([
        {"text": sample_text[:total_characters_required // 3], "start": "0", "duration": "60"},
        {"text": sample_text[total_characters_required // 3: 2 * total_characters_required // 3], "start": "60", "duration": "60"},
        {"text": sample_text[2 * total_characters_required // 3:], "start": "120", "duration": "60"}
    ])

    (markdown_dir / "test_file.json").write_text(json.dumps(mock_metadata))
    (markdown_dir / "test_file.json.mdd").write_text(sample_mdd_content)
    return str(markdown_dir)

@patch('tiktoken.encoding_for_model')
def test_enrich_text_chunks(mock_tokenizer, mock_file_system):
    """
    Test the enrich_text_chunks function to ensure text chunking and file output are correctly handled.

    Args:
        mock_tokenizer: Mock for the tokenizer.
        mock_file_system: Mock file system structure provided by the fixture.
    """
    # Mock the tokenizer
    mock_tokenizer.return_value.encode.side_effect = lambda text, **kwargs: list(range(len(text.split())))

    # Adjust config to force multiple chunks
    mock_config = Config(chunkDurationMins=1, discardIfBelow=1, maxTokens=15)  # Adjust maxTokens to a small number

    # Run the function
    enrich_text_chunks(mock_config, mock_file_system)

    # Check if the output file was created
    output_file = Path(mock_file_system) / "output" / "master_text.json"
    assert output_file.exists()

    # Read the output file and check its content
    with open(output_file, 'r') as f:
        output_content = json.load(f)

    # Assert the structure and content of the output
    assert isinstance(output_content, list)
    assert len(output_content) == 3
    print(output_content )
if __name__ == "__main__":
    pytest.main()
