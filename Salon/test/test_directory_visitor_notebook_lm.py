import os
import pytest
import tempfile
import shutil
from pathlib import Path
from unittest.mock import Mock, patch
import sys
import os

# Add both src and CommonPy directories to the Python path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root / 'Salon' / 'src'))
sys.path.insert(0, str(project_root))

from directory_visitor_notebook_lm import DirectoryVisitorForNotebookLM
from directory_visitor_base import DirectoryData

@pytest.fixture
def temp_dir():
    """Fixture to create and clean up a temporary directory."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)

@pytest.fixture
def visitor(temp_dir):
    """Fixture to create a DirectoryVisitorForNotebookLM instance."""
    return DirectoryVisitorForNotebookLM(max_words=100, output_dir=temp_dir)

@pytest.fixture
def sample_files(temp_dir):
    """Fixture to create sample test files in temporary directory."""
    # Create a regular file
    file1_path = temp_dir / "test1.txt"
    file1_path.write_text("This is test file 1.")
    
    # Create a file in common_dir
    common_dir = temp_dir / "common_dir"
    common_dir.mkdir()
    file2_path = common_dir / "common.txt"
    file2_path.write_text("This is a common file.")
    
    # Create a binary file
    bin_file_path = temp_dir / "binary.bin"
    with open(bin_file_path, 'wb') as f:
        f.write(b'\x00\x01\x02\x03')
    
    return temp_dir

def test_init_default_values():
    """Test initialization with default values."""
    visitor = DirectoryVisitorForNotebookLM()
    assert visitor.max_words == 200000
    assert visitor.output_dir == Path('.')
    assert visitor.content == ""
    assert visitor.current_word_count == 0
    assert visitor.file_counter == 1
    assert visitor.common_files == set()

def test_init_custom_values(temp_dir):
    """Test initialization with custom values."""
    visitor = DirectoryVisitorForNotebookLM(max_words=1000, output_dir=temp_dir, priority=5)
    assert visitor.max_words == 1000
    assert visitor.output_dir == temp_dir
    assert visitor.priority == 5

def test_count_words():
    """Test word counting functionality."""
    visitor = DirectoryVisitorForNotebookLM()
    text = "This is a test sentence with exactly eight words."
    # NLTK tokenizes punctuation separately, so "words." becomes ["words", "."]
    assert visitor.count_words(text) == 10

def test_save_current_content(visitor, temp_dir):
    """Test saving content to file."""
    visitor.content = "Test content\nwith multiple lines"
    visitor.current_word_count = 5
    visitor.save_current_content()
    
    output_file = temp_dir / "repo_content_1.txt"
    assert output_file.exists()
    assert output_file.read_text().strip() == "Test content\nwith multiple lines"
    assert visitor.file_counter == 2
    assert visitor.content == ""
    assert visitor.current_word_count == 0

def test_save_empty_content(visitor):
    """Test attempting to save empty content."""
    initial_counter = visitor.file_counter
    visitor.content = "   \n  "
    visitor.save_current_content()
    
    assert visitor.file_counter == initial_counter  # Counter shouldn't increment
    assert not list(visitor.output_dir.glob("repo_content_*.txt"))  # No file should be created

def test_add_file_block(visitor):
    """Test adding a file block with content."""
    visitor.add_file_block("test.py", "def test():\n    pass")
    
    assert "test.py" in visitor.content
    assert "def test():" in visitor.content
    assert visitor.current_word_count > 0

def test_add_file_block_exceeding_limit(visitor):
    """Test adding a file block that exceeds the word limit."""
    # First block
    visitor.add_file_block("test1.py", "Short content")
    content1 = visitor.content
    
    # Second block that should trigger save
    long_content = " ".join(["word"] * 100)  # Will exceed max_words
    visitor.add_file_block("test2.py", long_content)
    
    # Check that first block was saved and new content contains only second block
    assert visitor.content != content1
    assert "test2.py" in visitor.content
    assert "test1.py" not in visitor.content


def test_visit_duplicate_common_files(visitor, sample_files):
    """Test handling of duplicate files in common_dir."""
    # Create duplicate file in another common_dir
    another_common_dir = sample_files / "another_common_dir"
    another_common_dir.mkdir()
    duplicate_file = another_common_dir / "common.txt"
    duplicate_file.write_text("This is a duplicate common file.")
    
    # Create DirectoryData and populate all_files with files from all subdirectories
    directory_data = DirectoryData(sample_files)
    directory_data.all_files = [
        sample_files / "test1.txt",
        sample_files / "binary.bin",
        sample_files / "common_dir" / "common.txt",
        sample_files / "another_common_dir" / "common.txt"
    ]
    
    visitor.visit(directory_data)
    
    # Verify only one instance of common.txt was processed
    assert len(visitor.common_files) == 1
    assert "common.txt" in visitor.common_files

@pytest.mark.parametrize("file_content,expected_words", [
    ("Simple three word text", 4),  # NLTK counts 'text' as a separate token
    ("", 0),
    ("Complex-hyphenated-word text", 2),  # NLTK keeps hyphenated words together
    ("Multiple\nline\ntext\nblock", 4),
])
def test_word_counting_variations(visitor, file_content, expected_words):
    """Test word counting with various text patterns."""
    assert visitor.count_words(file_content) == expected_words

def test_error_handling_invalid_files(visitor, temp_dir):
    """Test handling of files with invalid encoding."""
    # Create a file with invalid UTF-8 encoding
    invalid_file = temp_dir / "invalid.txt"
    with open(invalid_file, 'wb') as f:
        f.write(b'\xFF\xFE\xFF\xFE')  # Invalid UTF-8
    
    directory_data = DirectoryData(temp_dir)
    visitor.visit(directory_data)  # Should not raise exception
    
    # Verify processing continued despite error
    assert visitor.file_counter == 1  # Counter shouldn't increment for failed files
