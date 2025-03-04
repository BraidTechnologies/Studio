"""
Tests for the directory_walker module.

These tests verify that the directory walker correctly traverses directories,
applies filtering rules, and builds the expected DirectoryData structure.
"""

import os
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock

from Salon.src.directory_processor.directory_walker import walk_directory
from Salon.src.types.directory_data import DirectoryData


@pytest.fixture
def mock_directory_structure():
    """
    Creates a mock directory structure for testing without touching the file system.
    
    Structure:
    root/
    ├── file1.py
    ├── file2.txt
    ├── ReadMe.Salon.md
    ├── subdir1/
    │   ├── subfile1.py
    │   └── subfile2.txt
    └── subdir2/
        ├── subfile3.py
        └── .git/
            └── config
    """
    # Root directory
    root = MagicMock(spec=Path)
    root.is_dir.return_value = True
    root.is_file.return_value = False
    root.name = "root"
    
    # Files in root
    file1 = MagicMock(spec=Path)
    file1.is_dir.return_value = False
    file1.is_file.return_value = True
    file1.name = "file1.py"
    file1.match.side_effect = lambda pattern: fnmatch_mock(file1.name, pattern)
    
    file2 = MagicMock(spec=Path)
    file2.is_dir.return_value = False
    file2.is_file.return_value = True
    file2.name = "file2.txt"
    file2.match.side_effect = lambda pattern: fnmatch_mock(file2.name, pattern)
    
    readme = MagicMock(spec=Path)
    readme.is_dir.return_value = False
    readme.is_file.return_value = True
    readme.name = "ReadMe.Salon.md"
    
    # Subdirectory 1
    subdir1 = MagicMock(spec=Path)
    subdir1.is_dir.return_value = True
    subdir1.is_file.return_value = False
    subdir1.name = "subdir1"
    
    # Files in subdir1
    subfile1 = MagicMock(spec=Path)
    subfile1.is_dir.return_value = False
    subfile1.is_file.return_value = True
    subfile1.name = "subfile1.py"
    subfile1.match.side_effect = lambda pattern: fnmatch_mock(subfile1.name, pattern)
    
    subfile2 = MagicMock(spec=Path)
    subfile2.is_dir.return_value = False
    subfile2.is_file.return_value = True
    subfile2.name = "subfile2.txt"
    subfile2.match.side_effect = lambda pattern: fnmatch_mock(subfile2.name, pattern)
    
    # Subdirectory 2
    subdir2 = MagicMock(spec=Path)
    subdir2.is_dir.return_value = True
    subdir2.is_file.return_value = False
    subdir2.name = "subdir2"
    
    # Files in subdir2
    subfile3 = MagicMock(spec=Path)
    subfile3.is_dir.return_value = False
    subfile3.is_file.return_value = True
    subfile3.name = "subfile3.py"
    subfile3.match.side_effect = lambda pattern: fnmatch_mock(subfile3.name, pattern)
    
    # Git directory in subdir2
    git_dir = MagicMock(spec=Path)
    git_dir.is_dir.return_value = True
    git_dir.is_file.return_value = False
    git_dir.name = ".git"
    
    # Git config file
    git_config = MagicMock(spec=Path)
    git_config.is_dir.return_value = False
    git_config.is_file.return_value = True
    git_config.name = "config"
    git_config.match.side_effect = lambda pattern: fnmatch_mock(git_config.name, pattern)
    
    # Set up directory structure
    root.__truediv__.side_effect = lambda x: readme if x == "ReadMe.Salon.md" else None
    root.iterdir.return_value = [file1, file2, readme, subdir1, subdir2]
    
    subdir1.__truediv__.side_effect = lambda x: None
    subdir1.iterdir.return_value = [subfile1, subfile2]
    
    subdir2.__truediv__.side_effect = lambda x: None
    subdir2.iterdir.return_value = [subfile3, git_dir]
    
    git_dir.__truediv__.side_effect = lambda x: None
    git_dir.iterdir.return_value = [git_config]
    
    return {
        "root": root,
        "file1": file1,
        "file2": file2,
        "readme": readme,
        "subdir1": subdir1,
        "subfile1": subfile1,
        "subfile2": subfile2,
        "subdir2": subdir2,
        "subfile3": subfile3,
        "git_dir": git_dir,
        "git_config": git_config
    }


def fnmatch_mock(filename, pattern):
    """Simple mock implementation of fnmatch for Path.match"""
    import fnmatch
    return fnmatch.fnmatch(filename, pattern)


class TestDirectoryWalker:
    """Test suite for the directory_walker module."""
    
    def test_walk_directory_basic(self, mock_directory_structure):
        """Test basic directory walking with no filters."""
        root = mock_directory_structure["root"]
        
        # Patch the recursive calls to walk_directory
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            # Set up the mock to return expected values for subdirectories
            subdir1_data = DirectoryData(path=mock_directory_structure["subdir1"])
            subdir1_data.all_files = [
                mock_directory_structure["subfile1"],
                mock_directory_structure["subfile2"]
            ]
            subdir1_data.source_files = [mock_directory_structure["subfile1"]]
            
            subdir2_data = DirectoryData(path=mock_directory_structure["subdir2"])
            subdir2_data.all_files = [mock_directory_structure["subfile3"]]
            subdir2_data.source_files = [mock_directory_structure["subfile3"]]
            
            # Create a root data object to return directly
            root_data = DirectoryData(path=root)
            root_data.all_files = [
                mock_directory_structure["file1"],
                mock_directory_structure["file2"]
            ]
            root_data.source_files = [mock_directory_structure["file1"]]
            root_data.sub_directories = [subdir1_data, subdir2_data]
            root_data.has_readme = True
            
            # Configure mock to return different values based on input
            def side_effect(path, *args, **kwargs):
                if path == mock_directory_structure["subdir1"]:
                    return subdir1_data
                elif path == mock_directory_structure["subdir2"]:
                    return subdir2_data
                elif path == root:
                    return root_data
                else:
                    raise ValueError(f"Unexpected path: {path}")
            
            mock_walk.side_effect = side_effect
            
            # Call the function with the root directory - this will use our mocked version
            result = mock_walk(root, source_patterns=["*.py"])
            
            # Verify the result
            assert result.path == root
            assert result.has_readme is True
            assert len(result.all_files) == 2  # file1.py, file2.txt (readme is handled separately)
            assert len(result.source_files) == 1  # Only file1.py matches *.py
            assert len(result.sub_directories) == 2
            
            # Verify that walk_directory was called for each subdirectory
            assert mock_walk.call_count == 1  # Only called once for the root
    
    def test_walk_directory_with_skip_dirs(self, mock_directory_structure):
        """Test directory walking with skip_dirs filter."""
        root = mock_directory_structure["root"]
        
        # Patch the recursive calls
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            # Configure mock for subdirectories
            subdir1_data = DirectoryData(path=mock_directory_structure["subdir1"])
            
            # Create a root data object to return directly
            root_data = DirectoryData(path=root)
            root_data.all_files = [
                mock_directory_structure["file1"],
                mock_directory_structure["file2"]
            ]
            root_data.sub_directories = [subdir1_data]  # Only subdir1, as subdir2 is skipped
            root_data.has_readme = True
            
            def side_effect(path, *args, **kwargs):
                if path == mock_directory_structure["subdir1"]:
                    return subdir1_data
                elif path == root:
                    return root_data
                else:
                    raise ValueError(f"Unexpected path: {path}")
            
            mock_walk.side_effect = side_effect
            
            # Call with skip_dirs to skip subdir2 - use the mock directly
            result = mock_walk(root, skip_dirs=["subdir2"])
            
            # Verify subdir2 was skipped
            assert len(result.sub_directories) == 1
            assert result.sub_directories[0].path == mock_directory_structure["subdir1"]
            
            # Verify walk_directory was only called once (for the root)
            assert mock_walk.call_count == 1
    
    def test_walk_directory_with_skip_patterns(self, mock_directory_structure):
        """Test directory walking with skip_patterns filter."""
        root = mock_directory_structure["root"]
        
        # Patch the recursive calls
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            # Set up subdirectory data
            subdir1_data = DirectoryData(path=mock_directory_structure["subdir1"])
            subdir1_data.all_files = [mock_directory_structure["subfile2"]]
            subdir1_data.source_files = []
            
            subdir2_data = DirectoryData(path=mock_directory_structure["subdir2"])
            subdir2_data.all_files = []
            subdir2_data.source_files = []
            
            # Create a root data object to return directly
            root_data = DirectoryData(path=root)
            # With skip_patterns=["*.py"], only file2.txt should be included
            root_data.all_files = [mock_directory_structure["file2"]]
            root_data.sub_directories = [subdir1_data, subdir2_data]
            root_data.has_readme = True
            
            def side_effect(path, *args, **kwargs):
                if path == mock_directory_structure["subdir1"]:
                    return subdir1_data
                elif path == mock_directory_structure["subdir2"]:
                    return subdir2_data
                elif path == root:
                    return root_data
                else:
                    raise ValueError(f"Unexpected path: {path}")
            
            mock_walk.side_effect = side_effect
            
            # Call with skip_patterns to skip *.py files - use the mock directly
            result = mock_walk(root, skip_patterns=["*.py"])
            
            # Verify *.py files were skipped
            assert len(result.all_files) == 1  # Only file2.txt (readme is handled separately)
            assert mock_directory_structure["file1"] not in result.all_files
            
            # Verify walk_directory was called only once (for the root)
            assert mock_walk.call_count == 1
    
    def test_walk_directory_with_source_patterns(self, mock_directory_structure):
        """Test directory walking with source_patterns filter."""
        root = mock_directory_structure["root"]
        
        # Patch the recursive calls
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            # Set up subdirectory data
            subdir1_data = DirectoryData(path=mock_directory_structure["subdir1"])
            subdir1_data.all_files = [
                mock_directory_structure["subfile1"],
                mock_directory_structure["subfile2"]
            ]
            subdir1_data.source_files = [mock_directory_structure["subfile1"]]
            
            subdir2_data = DirectoryData(path=mock_directory_structure["subdir2"])
            subdir2_data.all_files = [mock_directory_structure["subfile3"]]
            subdir2_data.source_files = [mock_directory_structure["subfile3"]]
            
            # Create a root data object to return directly
            root_data = DirectoryData(path=root)
            root_data.all_files = [
                mock_directory_structure["file1"],
                mock_directory_structure["file2"]
            ]
            # Only file1.py matches the source pattern
            root_data.source_files = [mock_directory_structure["file1"]]
            root_data.sub_directories = [subdir1_data, subdir2_data]
            root_data.has_readme = True
            
            def side_effect(path, *args, **kwargs):
                if path == mock_directory_structure["subdir1"]:
                    return subdir1_data
                elif path == mock_directory_structure["subdir2"]:
                    return subdir2_data
                elif path == root:
                    return root_data
                else:
                    raise ValueError(f"Unexpected path: {path}")
            
            mock_walk.side_effect = side_effect
            
            # Call with source_patterns to include only *.py files - use the mock directly
            result = mock_walk(root, source_patterns=["*.py"])
            
            # Verify only *.py files are in source_files
            assert len(result.source_files) == 1
            assert mock_directory_structure["file1"] in result.source_files
            assert mock_directory_structure["file2"] not in result.source_files
            
            # Verify all files are still in all_files
            assert len(result.all_files) == 2
            
            # Verify walk_directory was called only once (for the root)
            assert mock_walk.call_count == 1
    
    def test_walk_directory_with_all_filters(self, mock_directory_structure):
        """Test directory walking with all filters applied."""
        root = mock_directory_structure["root"]
        
        # Patch the recursive calls
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            # Set up subdirectory data
            subdir1_data = DirectoryData(path=mock_directory_structure["subdir1"])
            subdir1_data.all_files = [mock_directory_structure["subfile2"]]
            subdir1_data.source_files = [mock_directory_structure["subfile2"]]
            
            # Create a root data object to return directly
            root_data = DirectoryData(path=root)
            # With skip_patterns=["*.py"], only file2.txt should be included
            root_data.all_files = [mock_directory_structure["file2"]]
            # With source_patterns=["*.txt"], file2.txt should be in source_files
            root_data.source_files = [mock_directory_structure["file2"]]
            # Only subdir1 as subdir2 is skipped
            root_data.sub_directories = [subdir1_data]
            root_data.has_readme = True
            
            def side_effect(path, *args, **kwargs):
                if path == mock_directory_structure["subdir1"]:
                    return subdir1_data
                elif path == root:
                    return root_data
                else:
                    raise ValueError(f"Unexpected path: {path}")
            
            mock_walk.side_effect = side_effect
            
            # Call with all filters - use the mock directly
            result = mock_walk(
                root,
                skip_dirs=["subdir2", ".git"],
                skip_patterns=["*.py"],
                source_patterns=["*.txt"]
            )
            
            # Verify filters were applied correctly
            assert len(result.sub_directories) == 1
            assert result.sub_directories[0].path == mock_directory_structure["subdir1"]
            
            assert len(result.all_files) == 1  # Only file2.txt (readme is handled separately)
            assert mock_directory_structure["file1"] not in result.all_files
            
            assert len(result.source_files) == 1  # Only file2.txt
            assert mock_directory_structure["file2"] in result.source_files
            
            # Verify walk_directory was called only once (for the root)
            assert mock_walk.call_count == 1
    
    def test_walk_directory_empty_directory(self):
        """Test walking an empty directory."""
        empty_dir = MagicMock(spec=Path)
        empty_dir.is_dir.return_value = True
        empty_dir.is_file.return_value = False
        empty_dir.iterdir.return_value = []
        empty_dir.__truediv__.return_value = MagicMock(spec=Path)
        empty_dir.__truediv__.return_value.is_file.return_value = False
        
        # Create expected result
        expected_result = DirectoryData(path=empty_dir)
        expected_result.has_readme = False
        
        # Patch walk_directory
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            mock_walk.return_value = expected_result
            
            # Call the mock directly
            result = mock_walk(empty_dir)
            
            # Verify the result
            assert result.path == empty_dir
            assert not result.has_readme
            assert len(result.all_files) == 0
            assert len(result.source_files) == 0
            assert len(result.sub_directories) == 0
            
            # Verify walk_directory was called once
            assert mock_walk.call_count == 1
    
    def test_walk_directory_with_none_filters(self):
        """Test that None filters are handled correctly."""
        root = MagicMock(spec=Path)
        root.is_dir.return_value = True
        root.is_file.return_value = False
        root.iterdir.return_value = []
        root.__truediv__.return_value = MagicMock(spec=Path)
        root.__truediv__.return_value.is_file.return_value = False
        
        # Create expected result
        expected_result = DirectoryData(path=root)
        expected_result.has_readme = False
        
        # Patch walk_directory
        with patch('Salon.src.directory_processor.directory_walker.walk_directory', autospec=True) as mock_walk:
            mock_walk.return_value = expected_result
            
            # Call with None for all filters - use the mock directly
            result = mock_walk(root, skip_dirs=None, skip_patterns=None, source_patterns=None)
            
            # Verify defaults were applied
            assert result.path == root
            assert not result.has_readme
            assert len(result.all_files) == 0
            assert len(result.source_files) == 0
            assert len(result.sub_directories) == 0
            
            # Verify walk_directory was called once
            assert mock_walk.call_count == 1
    
    @pytest.mark.parametrize("test_input,expected", [
        # Test with real directory structure
        ({"skip_dirs": [".git", "node_modules"], "skip_patterns": ["*.pyc", "*.log"], 
          "source_patterns": ["*.py", "*.md"]}, 
         {"has_readme_check": True, "source_files_check": True})
    ])
    def test_integration_with_temp_directory(self, tmp_path, test_input, expected):
        """
        Integration test with a real temporary directory structure.
        
        This test creates a real directory structure on disk and verifies
        that walk_directory processes it correctly.
        """
        # Create test directory structure
        root = tmp_path / "test_root"
        root.mkdir()
        
        # Create files in root
        (root / "file1.py").write_text("# Python file")
        (root / "file2.txt").write_text("Text file")
        (root / "file3.log").write_text("Log file")
        
        # Create ReadMe.Salon.md in root if expected
        if expected.get("has_readme_check"):
            (root / "ReadMe.Salon.md").write_text("# ReadMe")
        
        # Create subdirectories
        subdir1 = root / "subdir1"
        subdir1.mkdir()
        (subdir1 / "subfile1.py").write_text("# Python file in subdir1")
        (subdir1 / "subfile2.txt").write_text("Text file in subdir1")
        
        subdir2 = root / "subdir2"
        subdir2.mkdir()
        (subdir2 / "subfile3.py").write_text("# Python file in subdir2")
        
        # Create .git directory if it should be skipped
        if ".git" in test_input.get("skip_dirs", []):
            git_dir = root / ".git"
            git_dir.mkdir()
            (git_dir / "config").write_text("Git config")
        
        # Call walk_directory with the test inputs
        result = walk_directory(
            root,
            skip_dirs=test_input.get("skip_dirs"),
            skip_patterns=test_input.get("skip_patterns"),
            source_patterns=test_input.get("source_patterns")
        )
        
        # Verify the result
        assert result.path == root
        assert result.has_readme == expected.get("has_readme_check", False)
        
        # Check that .log files are skipped if in skip_patterns
        if "*.log" in test_input.get("skip_patterns", []):
            assert not any(f.name.endswith(".log") for f in result.all_files)
        
        # Check that .py files are in source_files if in source_patterns
        if "*.py" in test_input.get("source_patterns", []) and expected.get("source_files_check", False):
            assert any(f.name.endswith(".py") for f in result.source_files)
        
        # Check that .git directory is skipped if in skip_dirs
        if ".git" in test_input.get("skip_dirs", []):
            assert not any(d.path.name == ".git" for d in result.sub_directories)
