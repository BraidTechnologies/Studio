import os
import pytest
from pathlib import Path
from unittest.mock import patch, mock_open, MagicMock, call
import tempfile
import shutil

from Salon.src.directory_processor.code_aggregator import CodeAggregator
from Salon.src.types.directory_data import DirectoryData


class TestCodeAggregator:
    """
    Test suite for the CodeAggregator class.
    """
    
    @pytest.fixture
    def temp_dir(self):
        """Create a temporary directory for testing file operations."""
        temp_dir = tempfile.mkdtemp()
        yield Path(temp_dir)
        shutil.rmtree(temp_dir)
    
    @pytest.fixture
    def aggregator(self, temp_dir):
        """Create a CodeAggregator instance with a temporary output directory."""
        return CodeAggregator(max_words=100, output_dir=temp_dir)
    
    @pytest.fixture
    def directory_data(self, temp_dir):
        """Create a mock DirectoryData instance for testing."""
        dir_data = DirectoryData(temp_dir)
        
        # Create test files
        test_files = [
            temp_dir / "file1.py",
            temp_dir / "file2.py",
            temp_dir / "common_dir" / "common_file.py"
        ]
        
        # Ensure common_dir exists
        (temp_dir / "common_dir").mkdir(exist_ok=True)
        
        # Create the files with some content
        for file_path in test_files:
            file_path.parent.mkdir(exist_ok=True)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"Content of {file_path.name}")
        
        dir_data.all_files = test_files
        return dir_data
    
    def test_init_default_values(self):
        """Test that the constructor initializes with correct default values."""
        aggregator = CodeAggregator()
        
        assert aggregator.max_words == 200000
        assert aggregator.output_dir == Path('.')
        assert aggregator.content == ""
        assert aggregator.current_word_count == 0
        assert aggregator.file_counter == 1
        assert aggregator.common_files == set()
        assert aggregator.priority == 3
    
    def test_init_custom_values(self):
        """Test that the constructor initializes with custom values."""
        custom_dir = Path('/custom/path')
        aggregator = CodeAggregator(max_words=50000, output_dir=custom_dir, priority=5)
        
        assert aggregator.max_words == 50000
        assert aggregator.output_dir == custom_dir
        assert aggregator.priority == 5
    
    def test_count_words(self):
        """Test the word counting functionality."""
        aggregator = CodeAggregator()
        
        # Test with empty string
        assert aggregator.count_words("") == 0
        
        # Test with simple text
        assert aggregator.count_words("Hello world") == 2
        
        # Test with code-like text
        code = "def test_function():\n    return 'Hello world'"
        assert aggregator.count_words(code) > 0  # Exact count may vary with tokenizer
    
    @patch('builtins.open', new_callable=mock_open)
    @patch('builtins.print')
    def test_save_current_content(self, mock_print, mock_file, aggregator):
        """Test saving content to a file."""
        # Set up test data
        aggregator.content = "Test content"
        aggregator.current_word_count = 2
        
        # Call the method
        aggregator.save_current_content()
        
        # Verify file was opened correctly
        expected_path = aggregator.output_dir / 'repo_content_1.txt'
        mock_file.assert_called_once_with(expected_path, 'w', encoding='utf-8')
        
        # Verify content was written
        mock_file().write.assert_called_once_with("Test content\n")
        
        # Verify print was called
        mock_print.assert_called_once()
        
        # Verify state was reset
        assert aggregator.file_counter == 2
        assert aggregator.content == ""
        assert aggregator.current_word_count == 0
    
    def test_save_current_content_empty(self, aggregator):
        """Test that empty content is not saved."""
        # Set up test data
        aggregator.content = "   "  # Just whitespace
        initial_counter = aggregator.file_counter
        
        # Call the method
        aggregator.save_current_content()
        
        # Verify state was not changed
        assert aggregator.file_counter == initial_counter
    
    @patch.object(CodeAggregator, 'count_words')
    def test_add_file_block_within_limit(self, mock_count_words, aggregator):
        """Test adding a file block when it's within the word limit."""
        # Mock the word count to return a fixed value
        mock_count_words.return_value = 10
        
        # Call the method
        aggregator.add_file_block("test/path.py", "file content")
        
        # Verify content was added
        assert "test/path.py" in aggregator.content
        assert "file content" in aggregator.content
        assert aggregator.current_word_count == 10
    
    @patch.object(CodeAggregator, 'count_words')
    @patch.object(CodeAggregator, 'save_current_content')
    def test_add_file_block_exceeds_limit(self, mock_save, mock_count_words, aggregator):
        """Test adding a file block that exceeds the word limit."""
        # Set up initial state
        aggregator.current_word_count = 95
        
        # Mock the word count to return a value that exceeds the limit
        mock_count_words.return_value = 10  # This will exceed the max_words of 100
        
        # Call the method
        aggregator.add_file_block("test/path.py", "file content")
        
        # Verify save_current_content was called
        mock_save.assert_called_once()
        
        # Verify new content was added after saving
        assert "test/path.py" in aggregator.content
    
    @patch.object(CodeAggregator, 'add_file_block')
    def test_visit_processes_files(self, mock_add_file_block, aggregator, directory_data, temp_dir):
        """Test that visit processes all files in the directory."""
        # Call the method
        aggregator.visit(directory_data)
        
        # Verify add_file_block was called for each file
        assert mock_add_file_block.call_count == 3
        
        # Get the actual calls made to add_file_block
        actual_calls = mock_add_file_block.call_args_list
        
        # Check each call individually to handle platform-specific path separators
        file_paths = ["file1.py", "file2.py", "common_dir/common_file.py"]
        file_contents = ["Content of file1.py", "Content of file2.py", "Content of common_file.py"]
        
        # Verify each file was processed
        for path, content in zip(file_paths, file_contents):
            # Check if any call matches this path and content
            # Convert forward slashes to the platform's path separator for comparison
            platform_path = path.replace("/", os.path.sep)
            matching_calls = [c for c in actual_calls if c[0][0] == platform_path and c[0][1] == content]
            assert len(matching_calls) == 1, f"Expected call with path '{platform_path}' and content '{content}' not found"
    
    def test_visit_skips_duplicate_common_files(self, aggregator, directory_data, temp_dir):
        """Test that visit skips duplicate common files."""
        # Add a duplicate common file
        duplicate_path = temp_dir / "common_dir" / "common_file.py"
        directory_data.all_files.append(duplicate_path)
        
        # Add the first common file to the set of already processed common files
        aggregator.common_files.add("common_file.py")
        
        # Patch open to track which files are read
        with patch('builtins.open', mock_open(read_data="test content")) as mock_file:
            # Call the method
            aggregator.visit(directory_data)
            
            # Count how many times each file was opened
            opened_files = [call_args[0][0] for call_args in mock_file.call_args_list]
            
            # Verify the duplicate common file was skipped
            assert duplicate_path not in opened_files
    
    def test_visit_handles_unicode_error(self, aggregator, directory_data, temp_dir):
        """Test that visit handles UnicodeDecodeError gracefully."""
        # Create a test file that will cause a UnicodeDecodeError
        test_file = temp_dir / "binary_file.bin"
        directory_data.all_files.append(test_file)
        
        # Write some binary content
        with open(test_file, 'wb') as f:
            f.write(b'\x80\x81')
        
        # Patch print to capture output
        with patch('builtins.print') as mock_print:
            # Call the method
            aggregator.visit(directory_data)
            
            # Verify error was handled and printed
            assert any("Skipping" in str(args[0]) for args in mock_print.call_args_list)
    
    def test_visit_handles_relative_path_error(self, aggregator):
        """Test that visit handles ValueError from relative_to gracefully."""
        # Create a DirectoryData with a path that will cause relative_to to fail
        dir_data = DirectoryData(Path("/path/a"))
        
        # Add a file with a path that's not relative to the directory
        dir_data.all_files = [Path("/different/path/file.py")]
        
        # Patch print to capture output
        with patch('builtins.print') as mock_print:
            # Call the method
            aggregator.visit(dir_data)
            
            # Verify error was handled and printed
            assert any("Skipping" in str(args[0]) for args in mock_print.call_args_list)
    
    def test_integration_with_real_files(self, temp_dir):
        """Integration test with real files and directories."""
        # Create a test directory structure
        test_dir = temp_dir / "test_project"
        test_dir.mkdir()
        
        # Create some test files with content
        file1 = test_dir / "file1.py"
        file1.write_text("def function1():\n    return 'Hello world'")
        
        file2 = test_dir / "file2.py"
        file2.write_text("def function2():\n    return 'Goodbye world'")
        
        # Create a common directory with a file
        common_dir = test_dir / "common_dir"
        common_dir.mkdir()
        common_file = common_dir / "common_file.py"
        common_file.write_text("# Common utility functions")
        
        # Create a DirectoryData object
        dir_data = DirectoryData(test_dir)
        dir_data.all_files = [file1, file2, common_file]
        
        # Create an aggregator with a higher max_words to ensure all files are in one output
        aggregator = CodeAggregator(max_words=1000, output_dir=temp_dir)
        
        # Process the directory
        aggregator.visit(dir_data)
        
        # Verify output file was created
        output_file = temp_dir / "repo_content_1.txt"
        assert output_file.exists()
        
        # Verify content of output file
        content = output_file.read_text()
        
        # Check that all files are included in the output
        assert "file1.py" in content
        assert "def function1" in content
        assert "file2.py" in content
        assert "def function2" in content
        assert "common_file.py" in content
        assert "# Common utility functions" in content
