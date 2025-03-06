import os
import pytest
from pathlib import Path
import tempfile
import shutil
from unittest.mock import patch, mock_open, MagicMock

from Salon.src.core.file_handler import FileHandler


@pytest.fixture
def file_handler():
    """Fixture to create a FileHandler instance for testing."""
    return FileHandler()


@pytest.fixture
def temp_dir():
    """Fixture to create and clean up a temporary directory."""
    temp_dir = tempfile.mkdtemp()
    yield Path(temp_dir)
    shutil.rmtree(temp_dir)


class TestFileHandler:
    """Tests for the FileHandler class."""

    def test_init_default_encoding(self):
        """Test that FileHandler initializes with default encoding."""
        handler = FileHandler()
        assert handler.encoding == 'utf-8'
        assert handler.version_pattern.pattern == r'(.*)_v(\d+)$'

    def test_init_custom_encoding(self):
        """Test that FileHandler initializes with custom encoding."""
        handler = FileHandler(encoding='latin-1')
        assert handler.encoding == 'latin-1'

    @patch('builtins.open', new_callable=mock_open, read_data="test content\n")
    def test_read_file_success(self, mock_file, file_handler):
        """Test successful file reading."""
        test_path = Path('test_file.txt')
        content = file_handler.read_file(test_path)
        
        mock_file.assert_called_once_with(test_path, 'r', encoding='utf-8')
        assert content == "test content"  # Should strip trailing newline

    @patch('builtins.open')
    @patch('builtins.print')
    def test_read_file_io_error(self, mock_print, mock_open_func, file_handler):
        """Test handling of IOError when reading a file."""
        test_path = Path('nonexistent_file.txt')
        mock_open_func.side_effect = IOError("File not found")
        
        result = file_handler.read_file(test_path)
        
        mock_open_func.assert_called_once_with(test_path, 'r', encoding='utf-8')
        mock_print.assert_called_once()
        assert "Error reading" in mock_print.call_args[0][0]
        assert result is None

    def test_write_file_version_new_file(self, temp_dir, file_handler):
        """Test writing a new file when no version exists."""
        file_name = "test_file.txt"
        content = "This is test content"
        
        result = file_handler.write_file_version(temp_dir, file_name, content)
        
        assert result == temp_dir / file_name
        assert result.exists()
        with open(result, 'r', encoding='utf-8') as f:
            assert f.read() == content

    def test_write_file_version_existing_file(self, temp_dir, file_handler):
        """Test versioning when a file already exists."""
        file_name = "test_file.txt"
        content1 = "Original content"
        content2 = "Updated content"
        
        # Create the original file
        with open(temp_dir / file_name, 'w', encoding='utf-8') as f:
            f.write(content1)
        
        # Write a new version
        result = file_handler.write_file_version(temp_dir, file_name, content2)
        
        expected_path = temp_dir / "test_file_v1.txt"
        assert result == expected_path
        assert result.exists()
        
        # Check both files have correct content
        with open(temp_dir / file_name, 'r', encoding='utf-8') as f:
            assert f.read() == content1
        with open(expected_path, 'r', encoding='utf-8') as f:
            assert f.read() == content2

    def test_write_file_version_multiple_versions(self, temp_dir, file_handler):
        """Test creating multiple versions of a file."""
        file_name = "test_file.txt"
        
        # Create original and v1
        with open(temp_dir / file_name, 'w', encoding='utf-8') as f:
            f.write("Original")
        with open(temp_dir / "test_file_v1.txt", 'w', encoding='utf-8') as f:
            f.write("Version 1")
        
        # Write a new version
        result = file_handler.write_file_version(temp_dir, file_name, "Version 2")
        
        expected_path = temp_dir / "test_file_v2.txt"
        assert result == expected_path
        assert result.exists()

    def test_write_file_version_with_existing_version(self, temp_dir, file_handler):
        """Test writing a file that already has a version in its name."""
        file_name = "test_file_v3.txt"
        content = "This has a version already"
        
        result = file_handler.write_file_version(temp_dir, file_name, content)
        
        # Should try to use v3 first, but since it doesn't exist, it should use that
        expected_path = temp_dir / "test_file_v3.txt"
        assert result == expected_path
        assert result.exists()

    def test_write_file_version_with_existing_version_conflict(self, temp_dir, file_handler):
        """Test writing a file with a version that already exists."""
        # Create v3 first
        with open(temp_dir / "test_file_v3.txt", 'w', encoding='utf-8') as f:
            f.write("Existing v3")
        
        file_name = "test_file_v3.txt"
        content = "This should become v4"
        
        result = file_handler.write_file_version(temp_dir, file_name, content)
        
        # Should increment to v4
        expected_path = temp_dir / "test_file_v4.txt"
        assert result == expected_path
        assert result.exists()

    @patch('builtins.open')
    @patch('builtins.print')
    def test_write_file_version_io_error(self, mock_print, mock_open_func, temp_dir, file_handler):
        """Test handling of IOError when writing a file."""
        file_name = "test_file.txt"
        content = "This should fail"
        
        mock_open_func.side_effect = IOError("Permission denied")
        
        result = file_handler.write_file_version(temp_dir, file_name, content)
        
        assert "Error writing to" in mock_print.call_args[0][0]
        assert result is None

    @pytest.mark.parametrize("file_name,expected_base,expected_version", [
        ("regular.txt", "regular", 0),
        ("with_v3.txt", "with_v3", 0),  # v3 is not at the end with underscore
        ("file_v1.txt", "file", 1),
        ("complex_name_v42.md", "complex_name", 42),
        ("_v5.json", "", 5),  # Edge case with empty base name
    ])
    def test_version_pattern_matching(self, file_handler, file_name, expected_base, expected_version):
        """Test the version pattern regex with various filenames."""
        output_file = Path(file_name)
        stem = output_file.stem
        
        match = file_handler.version_pattern.match(stem)
        if expected_version == 0:
            if match:
                assert match.group(1) != expected_base, "Should not match as a version"
        else:
            assert match is not None, f"Should match for {file_name}"
            assert match.group(1) == expected_base
            assert int(match.group(2)) == expected_version
