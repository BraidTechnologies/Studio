"""
Tests for the repo_readme_generator module.

These tests verify that the ReadmeGenerator correctly creates or updates
ReadMe.Salon.md files based on the source files in a directory.
"""

import os
import pytest
from pathlib import Path
from datetime import datetime
from unittest.mock import patch, MagicMock, call

from Salon.src.directory_processor.repo_readme_generator import ReadmeGenerator
from Salon.src.types.directory_data import DirectoryData
from Salon.src.models.base import AIModel
from Salon.src.core.file_handler import FileHandler
from Salon.src.types.model_type import ModelType


@pytest.fixture
def mock_ai_model():
    """
    Creates a mock AI model for testing.
    """
    mock_model = MagicMock(spec=AIModel)
    mock_model.generate_content.return_value = "This is a mock summary of the code."
    return mock_model


@pytest.fixture
def mock_file_handler():
    """
    Creates a mock FileHandler for testing.
    """
    mock_handler = MagicMock(spec=FileHandler)
    mock_handler.read_file.return_value = "def test_function():\n    return 'Hello, World!'\n" * 100  # Make it > 250 chars
    mock_handler.write_file_version.return_value = Path("/mock/path/ReadMe.Salon.md")
    return mock_handler


@pytest.fixture
def mock_directory_data():
    """
    Creates a mock DirectoryData structure for testing.
    """
    # Root directory
    root_path = MagicMock(spec=Path)
    root_path.name = "root"
    
    # Create DirectoryData
    dir_data = DirectoryData(root_path)
    
    # Add source files
    file1 = MagicMock(spec=Path)
    file1.name = "file1.py"
    file1.parent.name = "root"
    
    file2 = MagicMock(spec=Path)
    file2.name = "file2.py"
    file2.parent.name = "root"
    
    readme = MagicMock(spec=Path)
    readme.name = "ReadMe.Salon.md"
    readme.parent.name = "root"
    
    dir_data.source_files = [file1, file2, readme]
    dir_data.has_readme = True
    
    return dir_data


class TestReadmeGenerator:
    """Test suite for the ReadmeGenerator class."""
    
    def test_init(self):
        """Test ReadmeGenerator initialization."""
        # We need to patch the create_model function at the correct location
        with patch('Salon.src.directory_processor.repo_readme_generator.create_model') as mock_create_model:
            # Setup
            mock_model = MagicMock(spec=AIModel)
            mock_create_model.return_value = mock_model
            
            # Execute - use a valid model type from the ModelType enum
            generator = ReadmeGenerator(model_type=ModelType.BRAID_API.value, priority=5)
            
            # Verify
            assert generator.priority == 5
            mock_create_model.assert_called_once_with(ModelType.BRAID_API.value)
            assert generator.driver == mock_model
            assert isinstance(generator.file_handler, FileHandler)
    
    def test_summarise_code_success(self, mock_ai_model):
        """Test successful code summarization."""
        # Setup
        generator = ReadmeGenerator()
        generator.driver = mock_ai_model
        code = "def test_function():\n    return 'Hello, World!'"
        
        # Execute
        result = generator.summarise_code(code)
        
        # Verify
        assert result == "This is a mock summary of the code."
        mock_ai_model.generate_content.assert_called_once_with(
            code, 
            persona="CodeSummariser",
            persona_intro="You are an AI assistant that summarizes code to help explain it to new developers.",
            length_in_words=100
        )
    
    def test_summarise_code_failure(self, mock_ai_model):
        """Test code summarization when AI model returns None."""
        # Setup
        generator = ReadmeGenerator()
        generator.driver = mock_ai_model
        mock_ai_model.generate_content.return_value = None
        code = "def test_function():\n    return 'Hello, World!'"
        
        # Execute
        result = generator.summarise_code(code)
        
        # Verify
        assert result is None
        mock_ai_model.generate_content.assert_called_once()
    
    def test_visit_no_source_files(self):
        """Test visit method with no source files."""
        # Setup
        generator = ReadmeGenerator()
        dir_data = DirectoryData(Path("/mock/path"))
        dir_data.source_files = []
        
        # Execute
        result = generator.visit(dir_data)
        
        # Verify
        assert result is None
    
    def test_visit_no_need_to_update(self):
        """Test visit method when readme is up to date."""
        # Setup
        generator = ReadmeGenerator()
        dir_data = DirectoryData(Path("/mock/path"))
        
        # Mock source files
        file1 = MagicMock(spec=Path)
        dir_data.source_files = [file1]
        
        # Mock readme path
        readme_path = Path("/mock/path/ReadMe.Salon.md")
        dir_data.path = Path("/mock/path")
        
        # Mock os.path.getmtime to make readme newer than source files
        with patch('os.path.getmtime') as mock_getmtime:
            mock_getmtime.side_effect = lambda path: 200 if "ReadMe.Salon.md" in str(path) else 100
            with patch('pathlib.Path.exists') as mock_exists:
                mock_exists.return_value = True
                
                # Execute
                result = generator.visit(dir_data)
        
        # Verify
        assert result is None
    
    def test_visit_create_readme(self, mock_ai_model, mock_file_handler):
        """Test visit method creating a new readme."""
        # Setup
        generator = ReadmeGenerator()
        generator.driver = mock_ai_model
        generator.file_handler = mock_file_handler
        
        dir_data = DirectoryData(Path("/mock/path"))
        
        # Mock source files
        file1 = MagicMock(spec=Path)
        file1.name = "file1.py"
        file1.parent.name = "mock_dir"
        dir_data.source_files = [file1]
        
        # Mock readme path
        readme_path = Path("/mock/path/ReadMe.Salon.md")
        dir_data.path = Path("/mock/path")
        dir_data.has_readme = False
        
        # Create a mock datetime class
        mock_datetime = MagicMock()
        mock_date = MagicMock()
        mock_date.strftime.return_value = "01/01/2023"
        mock_datetime.now.return_value = mock_date
        
        # Patch os.path.getmtime to avoid FileNotFoundError
        with patch('os.path.getmtime') as mock_getmtime:
            mock_getmtime.return_value = 100  # Arbitrary timestamp
            
            # Patch datetime at the module level
            with patch('Salon.src.directory_processor.repo_readme_generator.datetime', mock_datetime):
                # Execute
                result = generator.visit(dir_data)
        
        # Verify
        assert result == Path("/mock/path/ReadMe.Salon.md")
        mock_file_handler.read_file.assert_called_once_with(file1)
        mock_file_handler.write_file_version.assert_called_once()
        
        # Instead of checking for the exact date, check for the general format
        content = mock_file_handler.write_file_version.call_args[0][2]
        assert "Generated by Salon from Braid Technologies" in content
    
    def test_visit_update_readme(self, mock_ai_model, mock_file_handler):
        """Test visit method updating an existing readme."""
        # Setup
        generator = ReadmeGenerator()
        generator.driver = mock_ai_model
        generator.file_handler = mock_file_handler
        
        dir_data = DirectoryData(Path("/mock/path"))
        
        # Mock source files
        file1 = MagicMock(spec=Path)
        file1.name = "file1.py"
        file1.parent.name = "mock_dir"
        
        readme = MagicMock(spec=Path)
        readme.name = "ReadMe.Salon.md"
        readme.parent.name = "mock_dir"
        
        dir_data.source_files = [file1, readme]
        
        # Mock readme path
        dir_data.path = Path("/mock/path")
        dir_data.has_readme = True
        
        # Create a mock datetime class
        mock_datetime = MagicMock()
        mock_date = MagicMock()
        mock_date.strftime.return_value = "01/01/2023"
        mock_datetime.now.return_value = mock_date
        
        # Patch os.path.getmtime to avoid FileNotFoundError
        with patch('os.path.getmtime') as mock_getmtime:
            mock_getmtime.side_effect = lambda path: 100 if "ReadMe.Salon.md" in str(path) else 200
            with patch('pathlib.Path.exists') as mock_exists:
                mock_exists.return_value = True
                
                # Patch datetime at the module level
                with patch('Salon.src.directory_processor.repo_readme_generator.datetime', mock_datetime):
                    # Execute
                    result = generator.visit(dir_data)
        
        # Verify
        assert result == Path("/mock/path/ReadMe.Salon.md")
        assert mock_file_handler.read_file.call_count == 2
        mock_file_handler.write_file_version.assert_called_once()
        
        # Check for the general format instead of the exact date
        content = mock_file_handler.write_file_version.call_args[0][2]
        assert "Generated by Salon from Braid Technologies" in content
    
    def test_visit_no_summaries_generated(self, mock_ai_model, mock_file_handler):
        """Test visit method when no summaries are generated."""
        # Setup
        generator = ReadmeGenerator()
        generator.driver = mock_ai_model
        generator.file_handler = mock_file_handler
        mock_ai_model.generate_content.return_value = None  # No summaries generated
        
        dir_data = DirectoryData(Path("/mock/path"))
        
        # Mock source files
        file1 = MagicMock(spec=Path)
        file1.name = "file1.py"
        file1.parent.name = "mock_dir"
        dir_data.source_files = [file1]
        
        # Mock readme path
        dir_data.path = Path("/mock/path")
        dir_data.has_readme = False
        
        # Patch os.path.getmtime to avoid FileNotFoundError
        with patch('os.path.getmtime') as mock_getmtime:
            mock_getmtime.return_value = 100  # Arbitrary timestamp
            
            # Execute
            result = generator.visit(dir_data)
        
        # Verify
        assert result is None
        mock_file_handler.read_file.assert_called_once_with(file1)
        mock_file_handler.write_file_version.assert_not_called()
    
    def test_visit_small_files_not_summarized(self, mock_ai_model, mock_file_handler):
        """Test visit method with files too small to summarize."""
        # Setup
        generator = ReadmeGenerator()
        generator.driver = mock_ai_model
        generator.file_handler = mock_file_handler
        mock_file_handler.read_file.return_value = "Small file"  # Less than 250 chars
        
        dir_data = DirectoryData(Path("/mock/path"))
        
        # Mock source files
        file1 = MagicMock(spec=Path)
        file1.name = "file1.py"
        file1.parent.name = "mock_dir"
        dir_data.source_files = [file1]
        
        # Mock readme path
        dir_data.path = Path("/mock/path")
        dir_data.has_readme = False
        
        # Patch os.path.getmtime to avoid FileNotFoundError
        with patch('os.path.getmtime') as mock_getmtime:
            mock_getmtime.return_value = 100  # Arbitrary timestamp
            
            # Execute
            result = generator.visit(dir_data)
        
        # Verify
        assert result is None
        mock_file_handler.read_file.assert_called_once_with(file1)
        mock_ai_model.generate_content.assert_not_called()
        mock_file_handler.write_file_version.assert_not_called()
    