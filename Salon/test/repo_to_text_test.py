import os
import sys
import pytest
import tempfile
import shutil
from pathlib import Path
from unittest.mock import patch, MagicMock, call, ANY

# Import modules to test
from Salon.src.repo_to_text import main
from Salon.src.directory_processor.directory_walker import walk_directory
from Salon.src.types.directory_data import DirectoryData


class TestRepoToText:
    """
    Test suite for the repo_to_text.py module.
    Tests command-line argument handling, directory walking, and processor application.
    """
    
    @pytest.fixture
    def temp_repo_dir(self):
        """Create a temporary directory structure simulating a repository."""
        temp_dir = tempfile.mkdtemp()
        repo_dir = Path(temp_dir) / "test_repo"
        repo_dir.mkdir()
        
        # Create some test files
        (repo_dir / "file1.py").write_text("def test_function():\n    return 'Hello World'")
        (repo_dir / "file2.txt").write_text("This is a test text file")
        
        # Create subdirectory with files
        sub_dir = repo_dir / "subdir"
        sub_dir.mkdir()
        (sub_dir / "subfile.py").write_text("print('This is a subfile')")
        
        # Create a common dir that should be skipped
        skip_dir = repo_dir / "node_modules"
        skip_dir.mkdir()
        (skip_dir / "package.json").write_text("{}")
        
        yield repo_dir
        
        # Clean up
        shutil.rmtree(temp_dir)
    
    @pytest.fixture
    def temp_output_dir(self):
        """Create a temporary output directory."""
        temp_dir = tempfile.mkdtemp()
        yield Path(temp_dir)
        shutil.rmtree(temp_dir)
    
        
    @patch('Salon.src.repo_to_text.ConfigManager')
    def test_main_config_error(self, mock_config_manager):
        """Test handling of configuration errors."""
        # Set up mock to raise an error
        mock_config_manager_instance = MagicMock()
        mock_config_manager_instance.load_config.side_effect = ValueError("Test error")
        mock_config_manager.return_value = mock_config_manager_instance
        
        # Execute the function
        with patch('builtins.print') as mock_print:
            result = main()
        
        # Check error handling
        assert result == 1
        mock_print.assert_called_with("Error: Test error")
    
    def test_walk_directory_integration(self, temp_repo_dir):
        """Test walk_directory with a real directory structure."""
        # Define test parameters
        skip_dirs = ['node_modules']
        skip_patterns = ['*.txt']
        source_patterns = ['*.py']
        
        # Execute the function
        directory_data = walk_directory(
            root_path=temp_repo_dir,
            skip_dirs=skip_dirs,
            skip_patterns=skip_patterns,
            source_patterns=source_patterns
        )
        
        # Verify results
        assert directory_data.path == temp_repo_dir
        
        # Check that files were processed correctly
        all_files_names = [f.name for f in directory_data.all_files]
        assert "file1.py" in all_files_names
        assert "file2.txt" not in all_files_names  # Should be skipped due to pattern
        
        # Check source files were identified correctly
        source_files_names = [f.name for f in directory_data.source_files]
        assert "file1.py" in source_files_names
        
        # Check subdirectories were processed
        assert len(directory_data.sub_directories) == 1
        subdir_data = directory_data.sub_directories[0]
        assert subdir_data.path.name == "subdir"
        
        # Check skip_dirs worked
        assert not any(d.path.name == "node_modules" for d in directory_data.sub_directories)
    
    @patch('Salon.src.core.config_manager.argparse.ArgumentParser')
    @patch('os.chdir')
    @patch('os.path.exists')
    @patch('Salon.src.repo_to_text.getProcessorsRepoToText')
    @patch('Salon.src.repo_to_text.walk_directory')
    @patch('Salon.src.repo_to_text.process_directory')
    def test_main_integration(self, mock_process_directory, mock_walk_directory, 
                             mock_get_processors, mock_path_exists, mock_chdir,
                             mock_arg_parser, temp_repo_dir, temp_output_dir):
        """Integration test for main function with minimal arguments."""
        # Set up directory paths to use in the test
        repo_path_str = str(temp_repo_dir)
        output_path_str = str(temp_output_dir)
        
        # Configure mocks
        mock_path_exists.return_value = True
        
        # Set up argument parser mock
        mock_args = MagicMock()
        mock_args.repo_path = temp_repo_dir
        mock_args.output_dir = temp_output_dir
        mock_args.model_type = 'braid_api'
        mock_args.max_words = 1000
        mock_args.skip_dirs = None
        mock_args.skip_patterns = None
        mock_args.verbose = False
        
        mock_parser = MagicMock()
        mock_parser.parse_args.return_value = mock_args
        mock_arg_parser.return_value = mock_parser
        
        # Create a test file in the repo
        test_py = temp_repo_dir / "test.py"
        test_py.write_text("print('hello world')")
        
        # Mock the directory data that would be returned
        mock_dir_data = DirectoryData(temp_repo_dir)
        mock_dir_data.all_files = [test_py]
        mock_dir_data.source_files = [test_py]
        mock_walk_directory.return_value = mock_dir_data
        
        # Mock processors
        mock_processor = MagicMock()
        mock_get_processors.return_value = [mock_processor]
        
        # Patch the config manager to return our mock args
        with patch('Salon.src.repo_to_text.ConfigManager') as mock_config_manager:
            # Set up config manager mock
            mock_config_instance = MagicMock()
            mock_config_instance.get_args.return_value = mock_args
            mock_config_instance.get_config.return_value = {
                'skip_dirs': [],
                'skip_patterns': [],
                'source_patterns': ['*.py']
            }
            mock_config_manager.return_value = mock_config_instance
            
            # Execute the function
            result = main()
        
        # Verify success and proper function calls
        assert result == 0
        mock_walk_directory.assert_called_once()
        mock_get_processors.assert_called_once()
        mock_process_directory.assert_called_once_with(mock_dir_data, [mock_processor])
    
    @patch('Salon.src.core.config_manager.argparse.ArgumentParser')
    @patch('os.chdir')
    @patch('os.path.exists')
    def test_end_to_end_with_mock_processors(self, mock_path_exists, mock_chdir,
                                           mock_arg_parser, temp_repo_dir, temp_output_dir):
        """End-to-end test with real directories but mocked processors."""
        # Configure mock
        mock_path_exists.return_value = True
        
        # Create a simple repository structure
        (temp_repo_dir / "main.py").write_text("def main():\n    print('Hello world')\n\nif __name__ == '__main__':\n    main()")
        (temp_repo_dir / "util.py").write_text("def helper():\n    return 'helper function'")
        
        # Set up argument parser mock
        mock_args = MagicMock()
        mock_args.repo_path = temp_repo_dir
        mock_args.output_dir = temp_output_dir
        mock_args.model_type = 'braid_api'
        mock_args.max_words = 1000
        mock_args.skip_dirs = None
        mock_args.skip_patterns = None
        mock_args.verbose = False
        
        mock_parser = MagicMock()
        mock_parser.parse_args.return_value = mock_args
        mock_arg_parser.return_value = mock_parser
        
        # Mock the processor creation 
        mock_processor = MagicMock()
        
        # Patch dependencies
        with patch('Salon.src.repo_to_text.ConfigManager') as mock_config_manager, \
             patch('Salon.src.repo_to_text.getProcessorsRepoToText', return_value=[mock_processor]):
            
            # Set up config manager mock
            mock_config_instance = MagicMock()
            mock_config_instance.get_args.return_value = mock_args
            mock_config_instance.get_config.return_value = {
                'skip_dirs': [],
                'skip_patterns': [],
                'source_patterns': ['*.py']
            }
            mock_config_manager.return_value = mock_config_instance
            
            # Execute function
            result = main()
        
        # Verify success
        assert result == 0
        
        # Verify processor was visited with correct directory data
        assert mock_processor.visit.called
        call_args = mock_processor.visit.call_args[0][0]
        assert isinstance(call_args, DirectoryData)
        assert call_args.path == temp_repo_dir
        
        # Verify file discovery
        all_files = [f.name for f in call_args.all_files]
        assert "main.py" in all_files
        assert "util.py" in all_files
