import pytest
from pathlib import Path
from unittest.mock import patch, mock_open
from Salon.src.core.file_handler import FileHandler

@pytest.fixture
def file_handler():
    return FileHandler()

def test_read_file_success(file_handler):
    mock_content = "Sample file content."
    with patch("builtins.open", mock_open(read_data=mock_content)):
        result = file_handler.read_file(Path("test.txt"))
        assert result == mock_content

def test_read_file_failure(file_handler):
    with patch("builtins.open", side_effect=IOError("File not found")):
        result = file_handler.read_file(Path("nonexistent.txt"))
        assert result is None

def test_write_file_version_new(file_handler, tmp_path):
    file_name = "test.md"
    content = "Sample content."
    result = file_handler.write_file_version(tmp_path, file_name, content)
    assert result.exists()
    assert result.read_text() == content

def test_write_file_version_existing(file_handler, tmp_path):
    file_name = "test.md"
    content1 = "First version."
    content2 = "Second version."
    
    file1 = file_handler.write_file_version(tmp_path, file_name, content1)
    file2 = file_handler.write_file_version(tmp_path, file_name, content2)
    
    assert file1.exists()
    assert file2.exists()
    assert file1.read_text() == content1
    assert file2.read_text() == content2
    assert "_v1" in file2.stem
