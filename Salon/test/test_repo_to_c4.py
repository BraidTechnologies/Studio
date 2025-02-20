import unittest
from unittest.mock import patch, MagicMock
from pathlib import Path
import sys
import argparse
from tempfile import TemporaryDirectory
import os
import pytest

# Add the src directory to the Python path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from repo_to_c4 import parse_arguments, validate_args, main

class TestRepoToC4(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.temp_dir = TemporaryDirectory()
        self.temp_path = Path(self.temp_dir.name)

    def tearDown(self):
        """Clean up test fixtures after each test method."""
        self.temp_dir.cleanup()

    def create_temp_repo(self):
        """Helper method to create a temporary repository structure."""
        # Create a simple repository structure for testing
        (self.temp_path / "src").mkdir()
        (self.temp_path / "docs").mkdir()
        (self.temp_path / "src" / "main.py").touch()
        return self.temp_path

    def test_parse_arguments_with_required_args(self):
        """Test argument parsing with required arguments."""
        test_args = ['--repo_path', '/path/to/repo']
        with patch('sys.argv', ['script.py'] + test_args):
            args = parse_arguments()
            self.assertEqual(str(args.repo_path), '/path/to/repo')
            self.assertEqual(args.model_type, 'braid_api')  # Default value

    def test_parse_arguments_with_all_args(self):
        """Test argument parsing with all arguments specified."""
        test_args = ['--repo_path', '/path/to/repo', '--model_type', 'local_gemini']
        with patch('sys.argv', ['script.py'] + test_args):
            args = parse_arguments()
            self.assertEqual(str(args.repo_path), '/path/to/repo')
            self.assertEqual(args.model_type, 'local_gemini')

    def test_parse_arguments_missing_required(self):
        """Test argument parsing fails when required arguments are missing."""
        test_args = []
        with patch('sys.argv', ['script.py'] + test_args):
            with self.assertRaises(SystemExit):
                parse_arguments()

    def test_validate_args_valid_directory(self):
        """Test argument validation with valid directory."""
        repo_path = self.create_temp_repo()
        args = argparse.Namespace(repo_path=str(repo_path), model_type='braid_api')
        validate_args(args)
        # Normalize both paths before comparison
        self.assertEqual(args.repo_path.resolve(), repo_path.resolve())

    def test_validate_args_nonexistent_path(self):
        """Test argument validation with non-existent path."""
        args = argparse.Namespace(
            repo_path='/nonexistent/path',
            model_type='braid_api'
        )
        with self.assertRaises(ValueError) as context:
            validate_args(args)
        self.assertIn('does not exist', str(context.exception))

    def test_validate_args_file_instead_of_directory(self):
        """Test argument validation when path points to a file instead of directory."""
        test_file = self.temp_path / "test.txt"
        test_file.touch()
        args = argparse.Namespace(repo_path=str(test_file), model_type='braid_api')
        with self.assertRaises(ValueError) as context:
            validate_args(args)
        self.assertIn('not a directory', str(context.exception))

    def test_main_successful_execution(self):
        """Test successful execution of the main function."""
        repo_path = self.create_temp_repo()
        test_args = ['--repo_path', str(repo_path)]
        
        with patch('sys.argv', ['script.py'] + test_args), \
             patch('repo_to_c4.get_visitors_for_c4') as mock_get_visitors, \
             patch('repo_to_c4.add_visitor') as mock_add_visitor, \
             patch('repo_to_c4.walk_directory') as mock_walk_directory:
            
            # Setup mock visitors
            mock_visitor = MagicMock()
            mock_get_visitors.return_value = [mock_visitor]
            
            # Run main function
            result = main()
            
            # Verify the execution
            self.assertEqual(result, 0)
            mock_get_visitors.assert_called_once_with('braid_api')
            mock_add_visitor.assert_called_once_with(mock_visitor)
            mock_walk_directory.assert_called_once()

    def test_main_with_invalid_path(self):
        """Test main function with invalid repository path."""
        test_args = ['--repo_path', '/nonexistent/path']
        with patch('sys.argv', ['script.py'] + test_args):
            result = main()
            self.assertEqual(result, 1)

    def test_main_with_invalid_model_type(self):
        """Test main function with invalid model type."""
        repo_path = self.create_temp_repo()
        test_args = ['--repo_path', str(repo_path), '--model_type', 'invalid_model']
        
        with patch('sys.argv', ['script.py'] + test_args), \
             patch('repo_to_c4.get_visitors_for_c4') as mock_get_visitors, \
             patch('sys.stdout'), \
             patch('sys.stderr'):  # Capture output to keep tests clean
            
            # Setup mock to raise an exception for invalid model
            mock_get_visitors.side_effect = ValueError("Invalid model type")
            
            # Run main and verify it raises a ValueError
            with pytest.raises(ValueError, match="Invalid model type"):
                main()

    def test_integration_with_visitors(self):
        """Integration test for visitor pattern implementation."""
        repo_path = self.create_temp_repo()
        test_args = ['--repo_path', str(repo_path)]
        
        with patch('sys.argv', ['script.py'] + test_args), \
             patch('repo_to_c4.get_visitors_for_c4') as mock_get_visitors, \
             patch('repo_to_c4.add_visitor') as mock_add_visitor, \
             patch('repo_to_c4.walk_directory') as mock_walk_directory:
            
            # Create multiple mock visitors
            mock_visitors = [MagicMock() for _ in range(3)]
            mock_get_visitors.return_value = mock_visitors
            
            result = main()
            
            # Verify all visitors were added and directory was walked
            self.assertEqual(result, 0)
            self.assertEqual(mock_add_visitor.call_count, len(mock_visitors))
            mock_walk_directory.assert_called_once()

if __name__ == '__main__':
    unittest.main()
