import pytest
import os
import sys
from pathlib import Path
from unittest.mock import Mock, patch
from typing import List

# Add both src and CommonPy directories to the Python path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root / 'Salon' / 'src'))
sys.path.insert(0, str(project_root))  # For CommonPy module

from directory_walker import (
    add_visitor,
    clear_visitors,
    walk_directory,
    _visitors,
    DirectoryVisitor,
    DirectoryData,
)

@pytest.fixture
def mock_visitor():
    """Fixture providing a mock DirectoryVisitor"""
    visitor = Mock(spec=DirectoryVisitor)
    return visitor

@pytest.fixture
def temp_directory_structure(tmp_path):
    """
    Creates a temporary directory structure for testing:
    root/
    ├── .git/
    ├── dir1/
    │   ├── file1.py
    │   ├── file2.txt
    │   └── ReadMe.Salon.md
    ├── dir2/
    │   ├── subdir/
    │   │   └── file3.py
    │   └── file4.txt
    └── skip_me/
        └── file5.py
    """
    # Create main directories
    dir1 = tmp_path / "dir1"
    dir2 = tmp_path / "dir2"
    dir2_subdir = dir2 / "subdir"
    skip_dir = tmp_path / "skip_me"
    git_dir = tmp_path / ".git"
    
    for d in [dir1, dir2, dir2_subdir, skip_dir, git_dir]:
        d.mkdir(parents=True)
    
    # Create files
    (dir1 / "file1.py").touch()
    (dir1 / "file2.txt").touch()
    (dir1 / "ReadMe.Salon.md").touch()
    (dir2 / "file4.txt").touch()
    (dir2_subdir / "file3.py").touch()
    (skip_dir / "file5.py").touch()
    (git_dir / "config").touch()
    
    return tmp_path

@pytest.fixture(autouse=True)
def cleanup_visitors():
    """Automatically clear visitors before and after each test"""
    clear_visitors()
    yield
    clear_visitors()

def test_add_visitor(mock_visitor):
    """Test adding a visitor"""
    add_visitor(mock_visitor)
    assert len(_visitors) == 1
    assert _visitors[0] == mock_visitor

def test_clear_visitors(mock_visitor):
    """Test clearing visitors"""
    add_visitor(mock_visitor)
    add_visitor(Mock(spec=DirectoryVisitor))
    assert len(_visitors) == 2
    
    clear_visitors()
    assert len(_visitors) == 0

def test_walk_directory_basic(temp_directory_structure, mock_visitor):
    """Test basic directory walking functionality"""
    add_visitor(mock_visitor)
    walk_directory(temp_directory_structure)
    
    # Visitor should be called for root and each non-git directory
    assert mock_visitor.visit.call_count == 4  # root, dir1, dir2, dir2/subdir
    
    # Verify DirectoryData for dir1
    dir1_call = [call for call in mock_visitor.visit.call_args_list 
                 if call.args[0].path.name == "dir1"][0]
    dir1_data: DirectoryData = dir1_call.args[0]
    
    assert dir1_data.has_readme is True
    assert len(dir1_data.all_files) == 3
    assert any(f.name == "file1.py" for f in dir1_data.all_files)

@pytest.mark.parametrize("skip_dirs,expected_visits", [
    (["skip_me"], 4),  # Should skip 'skip_me' directory
    (["dir1", "skip_me"], 3),  # Should skip both 'dir1' and 'skip_me'
    ([], 4),  # Should visit all non-git directories
])
def test_walk_directory_skip_dirs(temp_directory_structure, mock_visitor, 
                                skip_dirs, expected_visits):
    """Test directory skipping functionality"""
    add_visitor(mock_visitor)
    walk_directory(temp_directory_structure, skip_dirs=skip_dirs)
    assert mock_visitor.visit.call_count == expected_visits

@pytest.mark.parametrize("skip_patterns,expected_file_count", [
    (["*.txt"], 1),  # Should skip .txt files, leaving only .py
    (["*.py"], 1),   # Should skip .py files, leaving only .txt
    (["file*"], 0),  # Should skip all files starting with 'file'
    ([], 2),         # Should include all files except ReadMe.Salon.md
])
def test_walk_directory_skip_patterns(temp_directory_structure, mock_visitor,
                                    skip_patterns, expected_file_count):
    """Test file pattern skipping functionality"""
    add_visitor(mock_visitor)
    walk_directory(temp_directory_structure, skip_patterns=skip_patterns)
    
    # Check dir1's files
    dir1_call = [call for call in mock_visitor.visit.call_args_list 
                 if call.args[0].path.name == "dir1"][0]
    dir1_data: DirectoryData = dir1_call.args[0]
    
    # Count files excluding ReadMe.Salon.md
    actual_count = len([f for f in dir1_data.all_files 
                       if f.name != "ReadMe.Salon.md"])
    assert actual_count == expected_file_count



def test_walk_directory_with_multiple_visitors(temp_directory_structure):
    """Test walking with multiple visitors"""
    visitor1 = Mock(spec=DirectoryVisitor)
    visitor2 = Mock(spec=DirectoryVisitor)
    
    add_visitor(visitor1)
    add_visitor(visitor2)
    
    walk_directory(temp_directory_structure)
    
    assert visitor1.visit.call_count == visitor2.visit.call_count
    assert visitor1.visit.call_count == 4  # root, dir1, dir2, dir2/subdir

def test_walk_directory_nonexistent_path():
    """Test handling of nonexistent directory"""
    mock_visitor = Mock(spec=DirectoryVisitor)
    add_visitor(mock_visitor)
    
    with pytest.raises(FileNotFoundError):
        walk_directory(Path("nonexistent_directory"))
    
    assert mock_visitor.visit.call_count == 0

def test_walk_directory_empty_directory(tmp_path):
    """Test walking an empty directory"""
    mock_visitor = Mock(spec=DirectoryVisitor)
    add_visitor(mock_visitor)
    
    walk_directory(tmp_path)
    
    assert mock_visitor.visit.call_count == 1
    dir_data = mock_visitor.visit.call_args[0][0]
    assert len(dir_data.all_files) == 0
    assert len(dir_data.source_files) == 0
    assert dir_data.has_readme is False
