# test_count_tokens.py

import pytest
import tiktoken
import argparse
from unittest.mock import patch, mock_open
from Salon.src.helpers.count_tokens import count_tokens, main


@pytest.fixture
def mock_tokenizer():
    """Fixture to return a mocked tokenizer."""
    tokenizer = tiktoken.get_encoding("cl100k_base")
    tokenizer.encode = lambda text: text.split()  # Simulate token counting
    return tokenizer


def test_count_tokens(mock_tokenizer):
    """Test that count_tokens correctly counts tokens."""
    text = "Hello world! This is a test."
    token_count = count_tokens(text, mock_tokenizer)
    assert token_count == len(text.split())


@patch("builtins.open", new_callable=mock_open, read_data="Hello world! This is a test.")
@patch("tiktoken.get_encoding")
@patch("sys.argv", ["count_tokens.py", "--f", "test.txt"])
def test_main_basic(mock_get_encoding, mock_open_file):
    """Test main function with only the required file argument."""
    mock_tokenizer = mock_get_encoding.return_value
    mock_tokenizer.encode = lambda text: text.split()  # Simulated tokenization

    with patch("sys.stdout") as mock_stdout:
        main()
    
    output = mock_stdout.write.call_args_list
    assert any("Number of tokens in the file: 5" in str(call) for call in output)


@patch("builtins.open", new_callable=mock_open, read_data="Hello world! This is a test.")
@patch("tiktoken.get_encoding")
@patch("sys.argv", ["count_tokens.py", "--f", "test.txt", "--v"])
def test_main_with_v_option(mock_get_encoding, mock_open_file):
    """Test main function with the --v flag for context window calculation."""
    mock_tokenizer = mock_get_encoding.return_value
    mock_tokenizer.encode = lambda text: text.split()  # Simulated tokenization

    with patch("sys.stdout") as mock_stdout:
        main()

    output = mock_stdout.write.call_args_list
    assert any("Number of tokens in the file: 5" in str(call) for call in output)
    assert any("Number of copies that fit into a 65536 token context window: 13107" in str(call) for call in output)


@patch("sys.argv", ["count_tokens.py", "--f", "nonexistent.txt"])
def test_main_file_not_found():
    """Test that the script exits when the file is not found."""
    with patch("sys.exit") as mock_exit, patch("builtins.print") as mock_print:
        main()
    
    mock_exit.assert_called_once_with(1)
    mock_print.assert_called_with("File not found: nonexistent.txt")


@patch("sys.argv", ["count_tokens.py", "--f", "test.txt"])
@patch("builtins.open", new_callable=mock_open)
@patch("tiktoken.get_encoding", side_effect=Exception("Tokenizer error"))
def test_main_tokenizer_error(mock_get_encoding, mock_open_file):
    """Test that the script exits if the tokenizer initialization fails."""
    with patch("sys.exit") as mock_exit, patch("builtins.print") as mock_print:
        main()

    mock_exit.assert_called_once_with(1)
    mock_print.assert_called_with("Error initializing tokenizer: Tokenizer error")
