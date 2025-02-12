# test_walker.py
import sys
import os
from pathlib import Path
import pytest
from unittest.mock import MagicMock

# Make sure we can import from the `src` directory
TESTS_DIR = Path(__file__).resolve().parent
SRC_DIR = TESTS_DIR.parent / "src"
sys.path.append(str(SRC_DIR))

from DirectoryWalker import walk_directory, add_visitor, clear_visitors
from DirectoryVisitor import DirectoryVisitor, DirectoryData

@pytest.fixture
def mock_visitor():
    """Return a mock visitor that we can attach to the walker."""
    visitor = MagicMock(spec=DirectoryVisitor)
    return visitor

@pytest.fixture
def sample_tree(tmp_path):
    """
    Create a sample directory structure:
    root/
       skipme/
          file3.txt
       keepme/
          file1.py
          file2.txt
    """
    skip_dir = tmp_path / "skipme"
    skip_dir.mkdir()
    (skip_dir / "file3.txt").write_text("Should be skipped")

    keep_dir = tmp_path / "keepme"
    keep_dir.mkdir()
    (keep_dir / "file1.py").write_text("print('Hello Python')")
    (keep_dir / "file2.txt").write_text("Some text file")

    return tmp_path

def test_add_visitor_and_clear(mock_visitor):
    """Test that add_visitor registers a visitor and clear_visitors un-registers it."""
    clear_visitors()
    add_visitor(mock_visitor)
    assert len(mock_visitor.mock_calls) == 0  # Just checking it doesn't blow up
    clear_visitors()

def test_walk_directory_no_skip(sample_tree, mock_visitor):
    """Test walking directory without skipping anything."""
    clear_visitors()
    add_visitor(mock_visitor)

    walk_directory(root_path=sample_tree)
    # Should have visited 2 directories: skipme and keepme
    # Each directory is one call to visitor.visit(...)
    assert mock_visitor.visit.call_count == 2

def test_walk_directory_skip_dir(sample_tree, mock_visitor):
    """Test skipping directories by name."""
    clear_visitors()
    add_visitor(mock_visitor)

    walk_directory(
        root_path=sample_tree, 
        skip_dirs=["skipme"]
    )
    # We skip the 'skipme' directory, so only 1 directory visited
    assert mock_visitor.visit.call_count == 1

def test_walk_directory_skip_pattern(sample_tree, mock_visitor):
    """Test skipping file patterns."""
    clear_visitors()
    add_visitor(mock_visitor)

    walk_directory(
        root_path=sample_tree,
        skip_patterns=["*.txt"]
    )
    # 'file2.txt' and 'file3.txt' should be skipped from all_files
    # We still visit both directories, but each directory_data won't have .txt
    calls = mock_visitor.visit.call_args_list
    assert len(calls) == 2
    # Inspect the directory_data that was passed
    for call in calls:
        directory_data = call.args[0]
        assert all(not f.name.endswith(".txt") for f in directory_data.all_files)

def test_walk_directory_source_pattern(sample_tree, mock_visitor):
    """Test that source_patterns is recognized in directory_data.source_files."""
    clear_visitors()
    add_visitor(mock_visitor)

    walk_directory(
        root_path=sample_tree,
        source_patterns=["*.py"]
    )
    calls = mock_visitor.visit.call_args_list
    assert len(calls) == 2

    visited_source_files = []
    for call in calls:
        directory_data = call.args[0]
        visited_source_files.extend([f.name for f in directory_data.source_files])

    assert "file1.py" in visited_source_files
    assert "file2.txt" not in visited_source_files

def test_walk_directory_empty_dir(tmp_path, mock_visitor):
    """Test walking an empty directory doesn't break."""
    clear_visitors()
    add_visitor(mock_visitor)

    walk_directory(root_path=tmp_path)
    # There's only 1 directory (the root) and no files
    mock_visitor.visit.assert_called_once()
    (args, _) = mock_visitor.visit.call_args
    directory_data = args[0]
    assert directory_data.path == tmp_path
    assert directory_data.all_files == []
    assert directory_data.source_files == []

def test_walk_directory_with_registered_visitor(sample_tree):
    """Integration-like test with a real visitor class that collects visited directories."""
    clear_visitors()
    
    class SimpleCollectorVisitor(DirectoryVisitor):
        def __init__(self):
            self.visited_dirs = []

        def visit(self, directory_data: DirectoryData):
            self.visited_dirs.append(str(directory_data.path))

    visitor = SimpleCollectorVisitor()
    add_visitor(visitor)

    walk_directory(root_path=sample_tree)
    assert len(visitor.visited_dirs) == 2  # skipme and keepme

def test_walk_directory_symlink(tmp_path, mock_visitor):
    """
    Test that symlinks don't cause infinite recursion.
    We'll create a symlink pointing back to root to ensure it doesn't loop.
    """
    clear_visitors()
    add_visitor(mock_visitor)

    # Create subdir and file
    subdir = tmp_path / "subdir"
    subdir.mkdir()
    (subdir / "file.py").write_text("print('Hello from symlink test')")
    # Create symlink inside subdir pointing back to tmp_path
    symlink_path = subdir / "loop"
    symlink_path.symlink_to(tmp_path)

    # This should not loop infinitely
    walk_directory(root_path=tmp_path)

    # The visitor might still see subdir, but it should never revisit tmp_path again
    assert mock_visitor.visit.call_count >= 1
    # We won't go into deeper logic here, as symlink skipping isn't explicitly in your code.
    # But typically, if recursion occurs, the test might never finish.
