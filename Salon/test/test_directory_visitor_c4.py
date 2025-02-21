import pytest
from pathlib import Path
from unittest.mock import Mock, patch, mock_open, call
import sys
import os

# Add both src and CommonPy directories to the Python path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root / 'Salon' / 'src'))
sys.path.insert(0, str(project_root))  # For CommonPy module

from directory_visitor_c4 import DirectoryVisitorForC4
from directory_visitor_base import DirectoryData
from chat_model_drivers import SummariseModelType, SalonModelDriver

# Register custom pytest markers
def pytest_configure(config):
    config.addinivalue_line(
        "markers", "integration: mark test as an integration test"
    )

@pytest.fixture
def mock_directory():
    """Fixture to create a mock directory structure for testing."""
    return Path("/mock/test/path")

@pytest.fixture
def mock_directory_data(mock_directory):
    """Fixture to create a mock DirectoryData object."""
    data = DirectoryData(path=mock_directory)
    data.all_files = [
        mock_directory / "readme.md",
        mock_directory / "other_file.txt"
    ]
    data.modified_files = set()
    return data

@pytest.fixture
def visitor():
    """Fixture to create a DirectoryVisitorForC4 instance."""
    return DirectoryVisitorForC4(model_type="braid_api")

class TestDirectoryVisitorForC4:
    def test_init_with_braid_api(self):
        """Test initialization with braid_api model type."""
        visitor = DirectoryVisitorForC4(model_type="braid_api")
        assert str(visitor.model_type_enum.value) == str(SummariseModelType.BRAID_API.value)
        assert visitor.priority == 2

    def test_init_with_local_gemini(self):
        """Test initialization with local_gemini model type."""
        visitor = DirectoryVisitorForC4(model_type="local_gemini")
        assert str(visitor.model_type_enum.value) == str(SummariseModelType.LOCAL_GEMINI.value)
        assert visitor.priority == 2

    def test_init_with_custom_priority(self):
        """Test initialization with custom priority."""
        visitor = DirectoryVisitorForC4(priority=1)
        assert visitor.priority == 1

    @patch.object(SalonModelDriver, 'create')
    def test_summarise_code(self, mock_create):
        """Test the summarise_code method."""
        mock_driver = Mock()
        mock_driver.summarise.return_value = "Mocked summary"
        mock_create.return_value = mock_driver

        visitor = DirectoryVisitorForC4()
        # Mock the driver creation to avoid actual API calls
        visitor.driver = mock_driver
        result = visitor.summarise_code("Test text")

        assert result == "Mocked summary"
        mock_driver.summarise.assert_called_once_with(
            "Test text",
            persona="C4Diagrammer",
            length_in_words=1000
        )

    def test_write_file_version_new_file(self, tmp_path):
        """Test writing a new file when it doesn't exist."""
        visitor = DirectoryVisitorForC4()
        content = "Test content"
        file_name = "test.md"
        
        visitor.write_file_version(tmp_path, file_name, content)
        
        written_file = tmp_path / file_name
        assert written_file.exists()
        assert written_file.read_text() == content

    def test_write_file_version_existing_file(self, tmp_path):
        """Test writing a file when it already exists (should create versioned file)."""
        visitor = DirectoryVisitorForC4()
        content = "Test content"
        file_name = "test.md"
        
        # Create initial file
        (tmp_path / file_name).write_text("Original content")
        
        visitor.write_file_version(tmp_path, file_name, content)
        
        versioned_file = tmp_path / "test_v1.md"
        assert versioned_file.exists()
        assert versioned_file.read_text() == content

    @patch('builtins.open', new_callable=mock_open)
    def test_visit_no_readme(self, mock_file, mock_directory_data):
        """Test visit method when no readme.md exists."""
        mock_directory_data.all_files = [
            mock_directory_data.path / "other_file.txt"
        ]
        
        visitor = DirectoryVisitorForC4()
        visitor.visit(mock_directory_data)
        
        # Since there's no readme.md, the open() function should not be called
        mock_file.assert_not_called()

    @patch.object(DirectoryVisitorForC4, 'summarise_code')
    @patch.object(DirectoryVisitorForC4, 'write_file_version')
    @patch('pathlib.Path.iterdir')
    def test_visit_with_readme_and_salon_files(self, mock_iterdir, mock_write, mock_summarise, tmp_path):
        """Test visit method with both readme.md and readme.salon.md files."""
        # Create test directory structure
        main_dir = tmp_path / "test_project"
        main_dir.mkdir()
        sub_dir = main_dir / "sub_dir"
        sub_dir.mkdir()
        
        # Create test files
        (main_dir / "readme.md").write_text("Main readme")
        (sub_dir / "readme.salon.md").write_text("Salon readme")
        
        # Mock the directory iteration to simulate finding readme.salon.md
        mock_sub_dir = Mock()
        mock_sub_dir.is_dir.return_value = True
        mock_sub_dir.name = "sub_dir"
        mock_salon_file = Mock()
        mock_salon_file.is_file.return_value = True
        mock_salon_file.name = "readme.salon.md"
        mock_sub_dir.iterdir.return_value = [mock_salon_file]
        mock_iterdir.return_value = [mock_sub_dir]
        
        directory_data = DirectoryData(path=main_dir)
        directory_data.all_files = [main_dir / "readme.md"]
        
        mock_summarise.return_value = "mermaid diagram content"
        
        visitor = DirectoryVisitorForC4()
        
        # Mock all file operations
        mock_file_data = {
            str(main_dir / "readme.md"): "Main readme content",
            str(sub_dir / "readme.salon.md"): "Salon readme content"
        }
        
        def mock_open_file(file_path, *args, **kwargs):
            m = mock_open(read_data=mock_file_data.get(str(file_path), "")).return_value
            return m
        
        with patch('builtins.open', side_effect=mock_open_file):
            visitor.visit(directory_data)
        
        # Should generate 3 diagrams
        assert mock_write.call_count == 3
        mock_write.assert_has_calls([
            call(main_dir, 'C4Context.Salon.md', "mermaid diagram content"),
            call(main_dir, 'C4Container.Salon.md', "mermaid diagram content"),
            call(main_dir, 'C4Component.Salon.md', "mermaid diagram content")
        ])
        assert mock_summarise.call_count == 3

    @patch.object(DirectoryVisitorForC4, 'summarise_code')
    def test_visit_handles_file_read_errors(self, mock_summarise, mock_directory_data):
        """Test visit method handles file read errors gracefully."""
        visitor = DirectoryVisitorForC4()
        
        with patch('builtins.open', side_effect=IOError("Mock IO Error")):
            visitor.visit(mock_directory_data)
        
        mock_summarise.assert_not_called()

    @pytest.mark.parametrize("model_response", [
        None,
        "",
        "Invalid diagram content"
    ])
    def test_visit_handles_invalid_model_responses(self, model_response, mock_directory_data, tmp_path):
        """Test visit method handles invalid or empty model responses."""
        visitor = DirectoryVisitorForC4()
        
        with patch.object(visitor, 'summarise_code', return_value=model_response):
            with patch.object(visitor, 'write_file_version') as mock_write:
                with patch('pathlib.Path.iterdir') as mock_iterdir:
                    # Mock finding a readme.salon.md file
                    mock_sub_dir = Mock()
                    mock_sub_dir.is_dir.return_value = True
                    mock_sub_dir.name = "sub_dir"
                    mock_salon_file = Mock()
                    mock_salon_file.is_file.return_value = True
                    mock_salon_file.name = "readme.salon.md"
                    mock_sub_dir.iterdir.return_value = [mock_salon_file]
                    mock_iterdir.return_value = [mock_sub_dir]
                    
                    # Mock file reading operations
                    mock_file_data = {
                        str(mock_directory_data.path / "readme.md"): "Main readme content",
                        str(mock_directory_data.path / "sub_dir/readme.salon.md"): "Salon readme content"
                    }
                    
                    def mock_open_file(file_path, *args, **kwargs):
                        m = mock_open(read_data=mock_file_data.get(str(file_path), "")).return_value
                        return m
                    
                    with patch('builtins.open', side_effect=mock_open_file):
                        visitor.visit(mock_directory_data)
                
                if not model_response:
                    mock_write.assert_not_called()
                else:
                    assert mock_write.call_count == 3
                    mock_write.assert_has_calls([
                        call(mock_directory_data.path, 'C4Context.Salon.md', model_response),
                        call(mock_directory_data.path, 'C4Container.Salon.md', model_response),
                        call(mock_directory_data.path, 'C4Component.Salon.md', model_response)
                    ])

    def test_visit_respects_test_directory_exclusion(self, tmp_path):
        """Test that the visit method properly excludes 'test' directories."""
        # Create test directory structure
        main_dir = tmp_path / "project"
        main_dir.mkdir()
        test_dir = main_dir / "test"
        test_dir.mkdir()
        
        # Create test files
        (main_dir / "readme.md").write_text("Main readme")
        (test_dir / "readme.salon.md").write_text("Test readme")
        
        directory_data = DirectoryData(path=main_dir)
        directory_data.all_files = [main_dir / "readme.md"]
        
        visitor = DirectoryVisitorForC4()
        with patch.object(visitor, 'summarise_code') as mock_summarise:
            with patch('pathlib.Path.iterdir') as mock_iterdir:
                # Mock directory iteration to include a test directory
                mock_test_dir = Mock()
                mock_test_dir.is_dir.return_value = True
                mock_test_dir.name = "test"
                mock_iterdir.return_value = [mock_test_dir]
                
                visitor.visit(directory_data)
                
                mock_summarise.assert_not_called()

    @pytest.mark.integration
    @pytest.mark.skipif(not os.environ.get('BRAID_SESSION_KEY'), reason="BRAID_SESSION_KEY not set")
    def test_integration_braid_api(self, tmp_path):
        """
        Integration test for Braid API model.
        Requires BRAID_SESSION_KEY environment variable to be set.
        """
        # Create a simple C4 system description
        system_desc = """
        The system is a simple web application with:
        - A frontend built with React
        - A backend API using FastAPI
        - A PostgreSQL database
        The frontend communicates with the backend via REST API calls.
        The backend handles business logic and data persistence.
        """
        
        visitor = DirectoryVisitorForC4(model_type="braid_api")
        result = visitor.summarise_code(system_desc)
        
        assert result is not None
        assert isinstance(result, str), "Result should be a string"
        

    @pytest.mark.integration
    def test_integration_local_gemini(self, tmp_path):
        """
        Integration test for Local Gemini model.
        """
        # Create a simple C4 system description
        system_desc = """
        The system is a simple web application with:
        - A frontend built with React
        - A backend API using FastAPI
        - A PostgreSQL database
        The frontend communicates with the backend via REST API calls.
        The backend handles business logic and data persistence.
        """
        
        visitor = DirectoryVisitorForC4(model_type="local_gemini")
        result = visitor.summarise_code(system_desc)
        
        assert result is not None
        assert isinstance(result, str), "Result should be a string"

if __name__ == '__main__':
    pytest.main([__file__, '-v', '-m', 'not integration'])  # By default, skip integration tests
