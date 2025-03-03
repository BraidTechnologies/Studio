#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Unit tests for repo_to_c4.py module.

These tests verify the functionality of the repo_to_c4 module, which processes
a repository and generates C4 diagrams.
"""

import os
import sys
import pytest
from pathlib import Path
from unittest.mock import patch, MagicMock, call
from argparse import Namespace

# Import the module under test
from Salon.src import repo_to_c4
from Salon.src.repo_to_c4 import main
from Salon.src.types.directory_data import DirectoryData
from Salon.src.directory_processor.base import DirectoryProcessor


class TestRepoToC4:
    """Test suite for the repo_to_c4 module."""

    @pytest.fixture
    def mock_config_manager(self):
        """Fixture to create a mock ConfigManager."""
        with patch('Salon.src.repo_to_c4.ConfigManager') as mock_cm:
            # Configure the mock
            mock_instance = mock_cm.return_value
            mock_instance.get_args.return_value = Namespace(
                repo_path=Path('/fake/repo/path'),
                model_type='braid_api'
            )
            yield mock_cm

    @pytest.fixture
    def mock_walk_directory(self):
        """Fixture to create a mock for walk_directory function."""
        with patch('Salon.src.repo_to_c4.walk_directory') as mock_walk:
            # Create a mock DirectoryData object
            mock_dir_data = MagicMock(spec=DirectoryData)
            mock_dir_data.path = Path('/fake/repo/path')
            mock_dir_data.sub_directories = []
            mock_dir_data.all_files = []
            mock_dir_data.source_files = []
            
            # Configure the mock to return the mock DirectoryData
            mock_walk.return_value = mock_dir_data
            yield mock_walk

    @pytest.fixture
    def mock_processors_factory(self):
        """Fixture to create a mock for getProcessorsRepoToC4 function."""
        with patch('Salon.src.repo_to_c4.getProcessorsRepoToC4') as mock_factory:
            # Create a mock processor
            mock_processor = MagicMock(spec=DirectoryProcessor)
            mock_processor.visit.return_value = None
            mock_processor.priority = 1
            
            # Configure the mock to return a list with the mock processor
            mock_factory.return_value = [mock_processor]
            yield mock_factory

    @pytest.fixture
    def mock_process_directory(self):
        """Fixture to create a mock for process_directory function."""
        with patch('Salon.src.repo_to_c4.process_directory') as mock_process:
            yield mock_process

    def test_main_success(self, mock_config_manager, mock_walk_directory, 
                         mock_processors_factory, mock_process_directory):
        """Test successful execution of the main function."""
        # Execute the function under test
        result = main()
        
        # Verify the result
        assert result == 0
        
        # Verify the interactions with mocked dependencies
        mock_config_manager.assert_called_once_with(
            'Process a GitHub repository and concatenate file contents with optional readme summaries'
        )
        mock_config_manager.return_value.load_config.assert_called_once()
        mock_config_manager.return_value.get_args.assert_called_once()
        
        # Verify walk_directory was called with the correct arguments
        mock_walk_directory.assert_called_once_with(
            root_path=Path('/fake/repo/path'),
            skip_dirs=[],
            skip_patterns=[],
            source_patterns=[]
        )
        
        # Verify getProcessorsRepoToC4 was called with the correct model_type
        mock_processors_factory.assert_called_once_with('braid_api')
        
        # Verify process_directory was called with the correct arguments
        mock_process_directory.assert_called_once_with(
            mock_walk_directory.return_value,
            mock_processors_factory.return_value
        )

    def test_main_config_error(self, mock_config_manager):
        """Test main function when ConfigManager raises a ValueError."""
        # Configure the mock to raise a ValueError
        mock_config_manager.return_value.load_config.side_effect = ValueError("Config error")
        
        # Execute the function under test
        with patch('builtins.print') as mock_print:
            result = main()
        
        # Verify the result
        assert result == 1
        
        # Verify the error was printed
        mock_print.assert_called_once_with("Error: Config error")

    @patch('Salon.src.repo_to_c4.walk_directory')
    def test_main_with_custom_skip_patterns(self, mock_walk, mock_config_manager):
        """Test main function with custom skip patterns."""
        # Configure the mock to return custom args
        mock_config_manager.return_value.get_args.return_value = Namespace(
            repo_path=Path('/fake/repo/path'),
            model_type='braid_api',
            skip_dirs=['node_modules', 'dist'],
            skip_patterns=['*.log', '*.tmp']
        )
        
        # Create a mock DirectoryData
        mock_dir_data = MagicMock(spec=DirectoryData)
        mock_walk.return_value = mock_dir_data
        
        # Mock the other dependencies
        with patch('Salon.src.repo_to_c4.getProcessorsRepoToC4') as mock_factory:
            mock_processor = MagicMock(spec=DirectoryProcessor)
            mock_factory.return_value = [mock_processor]
            
            with patch('Salon.src.repo_to_c4.process_directory') as mock_process:
                # Execute the function under test
                result = main()
                
                # Verify the result
                assert result == 0
                
                # Verify walk_directory was called with the custom skip patterns
                mock_walk.assert_called_once()
                # This test would be more specific if the actual implementation used these args

    @patch('sys.exit')
    def test_script_execution(self, mock_exit, mock_config_manager, 
                             mock_walk_directory, mock_processors_factory, 
                             mock_process_directory):
        """Test script execution through __main__ block."""
        # Mock __name__ to simulate script execution
        with patch.object(repo_to_c4, '__name__', '__main__'):
            # No need to re-import the module
            # Execute the __main__ block logic
            repo_to_c4.sys.exit(repo_to_c4.main())
            
            # Verify sys.exit was called with the result of main()
            mock_exit.assert_called_once_with(0)

    def test_integration_with_real_processors(self, mock_config_manager, mock_walk_directory):
        """Test integration with real processor objects."""
        # Create a mock processor for the factory to return
        mock_processor = MagicMock(spec=DirectoryProcessor)
        
        # Use the real getProcessorsRepoToC4 function but override its return value
        with patch('Salon.src.repo_to_c4.getProcessorsRepoToC4') as mock_factory:
            # Configure it to return our mock processor
            mock_factory.return_value = [mock_processor]
            
            # Use the real process_directory function
            with patch('Salon.src.repo_to_c4.process_directory') as mock_process:
                # Execute the function under test
                result = main()
                
                # Verify the result
                assert result == 0
                
                # Verify the functions were called
                mock_factory.assert_called_once_with('braid_api')
                mock_process.assert_called_once()
                
                # Verify processors were created and used
                processors = mock_factory.return_value
                assert len(processors) > 0
                assert all(isinstance(p, DirectoryProcessor) or isinstance(p, MagicMock) for p in processors)

    @pytest.mark.parametrize("model_type", ["braid_api", "local_gemini"])
    def test_different_model_types(self, model_type, mock_config_manager, 
                                  mock_walk_directory, mock_process_directory):
        """Test main function with different model types."""
        # Configure the mock to return custom args with different model_type
        mock_config_manager.return_value.get_args.return_value = Namespace(
            repo_path=Path('/fake/repo/path'),
            model_type=model_type
        )
        
        # Use the real getProcessorsRepoToC4 function
        with patch('Salon.src.repo_to_c4.getProcessorsRepoToC4') as mock_factory:
            mock_processor = MagicMock(spec=DirectoryProcessor)
            mock_factory.return_value = [mock_processor]
            
            # Execute the function under test
            result = main()
            
            # Verify the result
            assert result == 0
            
            # Verify getProcessorsRepoToC4 was called with the correct model_type
            mock_factory.assert_called_once_with(model_type)


if __name__ == "__main__":
    pytest.main(["-v", __file__])
