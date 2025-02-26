import pytest
from pathlib import Path
from unittest.mock import MagicMock
from Salon.src.directory_processor.directory_walker import walk_directory
from Salon.src.types.directory_data import DirectoryData

@pytest.fixture
def mock_directory_structure(tmp_path):
    """Creates a temporary directory structure for testing."""
    (tmp_path / "dir1").mkdir()
    (tmp_path / "dir2").mkdir()
    (tmp_path / "dir1" / "file1.txt").write_text("Content 1")
    (tmp_path / "dir2" / "file2.txt").write_text("Content 2")
    (tmp_path / "ReadMe.Salon.md").write_text("ReadMe Content")
    return tmp_path


def test_walk_directory(mock_directory_structure):
    """Test the walk_directory function to ensure it correctly builds DirectoryData."""
    skip_dirs = ["dir2"]
    skip_patterns = ["*.md"]
    source_patterns = ["*.txt"]
    
    result = walk_directory(mock_directory_structure, skip_dirs, skip_patterns, source_patterns)
    
    assert isinstance(result, DirectoryData)
    assert result.has_readme is True
    assert len(result.sub_directories) == 1  # dir2 should be skipped
    assert result.sub_directories[0].path.name == "dir1"
    assert len(result.sub_directories[0].all_files) == 1  # Only file1.txt should be included
    assert result.sub_directories[0].all_files[0].name == "file1.txt"
    assert len(result.sub_directories[0].source_files) == 1  # file1.txt matches source_patterns
