# test_visitor.py
import sys
import os
from pathlib import Path
import pytest
from unittest.mock import patch, MagicMock, mock_open

# Make sure we can import from the `src` directory
TESTS_DIR = Path(__file__).resolve().parent
SRC_DIR = TESTS_DIR.parent / "src"
sys.path.append(str(SRC_DIR))

from DirectoryVisitor import (
    DirectoryVisitorForNotebookLM,
    DirectoryVisitorForReadme,
    DirectoryData,
    SUMMARY_FILENAME,
    BASE_URL,
    SESSION_KEY
)

@pytest.fixture
def directory_data(tmp_path):
    """Provide a DirectoryData object for testing."""
    d_data = DirectoryData(tmp_path)
    return d_data

# -------------------- Tests for DirectoryVisitorForNotebookLM --------------------

def test_init_visitor_notebooklm():
    """Test initializing DirectoryVisitorForNotebookLM with defaults."""
    visitor = DirectoryVisitorForNotebookLM()
    assert visitor.max_words == 200000
    assert str(visitor.output_dir) == "."

def test_add_file_block(tmp_path):
    """Test adding a file block and verifying word count increments."""
    visitor = DirectoryVisitorForNotebookLM(max_words=50, output_dir=tmp_path)
    dummy_content = "Hello world " * 5  # 10 words
    visitor.add_file_block("test.py", dummy_content)
    assert visitor.current_word_count > 0
    assert "test.py" in visitor.content

def test_save_current_content(tmp_path):
    """Test that save_current_content writes to a file and resets counters."""
    visitor = DirectoryVisitorForNotebookLM(max_words=50, output_dir=tmp_path)
    visitor.content = "Some content"
    visitor.current_word_count = 10
    visitor.file_counter = 1
    visitor.save_current_content()
    output_file = tmp_path / "repo_content_1.txt"
    assert output_file.exists()
    assert visitor.content == ""
    assert visitor.current_word_count == 0
    assert visitor.file_counter == 2

def test_skip_duplicate_common_file(tmp_path):
    """
    Test that if a file is from 'common_dir' and the name has been seen,
    the visitor logs a skip (or prints) and doesn't add the block again.
    """
    visitor = DirectoryVisitorForNotebookLM(max_words=50, output_dir=tmp_path)
    common_path = tmp_path / "common_dir"
    common_path.mkdir()
    (common_path / "common_file.py").write_text("Duplicate content?")

    class FakeDirectoryData:
        path = tmp_path
        all_files = [
            common_path / "common_file.py",
            common_path / "common_file.py"  # same file, repeated
        ]

    with patch("builtins.open", mock_open(read_data="Duplicate content?")):
        with patch("sys.stdout", new_callable=lambda: None):  # suppress prints
            visitor.visit(FakeDirectoryData())
    # We only add the file once
    assert visitor.file_counter == 1  # no new file saved yet
    assert visitor.current_word_count > 0  # the first block was added
    # The second was skipped

def test_notebooklm_visit_valid_file(directory_data, tmp_path):
    """
    Test the `visit` method reading a real file.
    """
    (tmp_path / "file.py").write_text("print('Hello')")
    directory_data.all_files.append(tmp_path / "file.py")

    visitor = DirectoryVisitorForNotebookLM(max_words=100, output_dir=tmp_path)
    visitor.visit(directory_data)

    # Content was added but not saved yet (since not over max_words).
    assert visitor.current_word_count > 0
    assert "file.py" in visitor.content

# -------------------- Tests for DirectoryVisitorForReadme --------------------

def test_init_visitor_readme():
    """Test we can initialize DirectoryVisitorForReadme without error."""
    visitor = DirectoryVisitorForReadme()
    assert visitor is not None

@patch.dict(os.environ, {}, clear=True)
def test_summarise_code_no_session_key():
    """
    Test summarise_code when no session key is set in environment.
    We expect a fallback message.
    """
    visitor = DirectoryVisitorForReadme()
    summary = visitor.summarise_code("some code text")
    assert "No session key set" in summary

@patch("DirectoryVisitor.requests.post")
def test_summarise_code_success(mock_post):
    """Test summarise_code returns text when the mock request is successful."""
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"summary": "This is a summary."}

    # Must have a session key for the code to call requests
    with patch.dict(os.environ, {"BRAID_SESSION_KEY": "testkey"}):
        visitor = DirectoryVisitorForReadme()
        result = visitor.summarise_code("def foo(): pass")
        assert result == "This is a summary."

def test_visit_recreate_readme(tmp_path):
    """
    Test that readme is (re)created if source files are newer or missing a readme.
    We'll mock out the actual summarise_code method to just return something.
    """
    visitor = DirectoryVisitorForReadme()

    # Create a source file
    src_file = tmp_path / "source.py"
    src_file.write_text("print('hello')")

    # DirectoryData
    d_data = DirectoryData(tmp_path)
    d_data.source_files.append(src_file)

    # The readme doesn't exist
    assert not (tmp_path / SUMMARY_FILENAME).exists()

    with patch.object(visitor, "summarise_code", return_value="Summarized code"):
        visitor.visit(d_data)
    
    # Now we expect a readme was written
    readme_path = tmp_path / SUMMARY_FILENAME
    assert readme_path.exists()
    content = readme_path.read_text()
    assert "Summarized code" in content
