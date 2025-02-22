import pytest
from pathlib import Path
from unittest.mock import Mock, patch, mock_open, MagicMock
from Salon.src.directory_visitor_readme import DirectoryVisitorForReadme
from Salon.src.directory_visitor_base import DirectoryData
from Salon.src.chat_model_drivers import SummariseModelType, SalonModelDriver

@pytest.fixture
def mock_directory_data():
    """Fixture providing a mock DirectoryData instance."""
    data = DirectoryData(path=Path("/fake/path"))
    data.source_files = [
        Path("/fake/path/file1.py"),
        Path("/fake/path/file2.py")
    ]
    data.has_readme = False
    return data

@pytest.fixture
def visitor():
    """Fixture providing a DirectoryVisitorForReadme instance."""
    return DirectoryVisitorForReadme(model_type="braid_api")

class TestDirectoryVisitorForReadme:
    
    def test_init_with_braid_api(self):
        """Test initialization with braid_api model type."""
        visitor = DirectoryVisitorForReadme(model_type="braid_api")
        assert visitor.model_type_enum == SummariseModelType.BRAID_API
        assert isinstance(visitor.driver, SalonModelDriver)
        
    def test_init_with_local_gemini(self):
        """Test initialization with local_gemini model type."""
        visitor = DirectoryVisitorForReadme(model_type="local_gemini")
        assert visitor.model_type_enum == SummariseModelType.LOCAL_GEMINI
        assert isinstance(visitor.driver, SalonModelDriver)

    def test_summarise_code(self, visitor):
        """Test code summarization with mock driver."""
        test_code = "def hello(): print('world')"
        expected_summary = "A simple function that prints 'world'"
        
        with patch.object(visitor.driver, 'summarise', return_value=expected_summary) as mock_summarise:
            result = visitor.summarise_code(test_code)
            
            assert result == expected_summary
            mock_summarise.assert_called_once_with(test_code, persona="CodeSummariser", length_in_words=100)

    def test_visit_empty_directory(self, visitor, mock_directory_data):
        """Test visiting a directory with no source files."""
        mock_directory_data.source_files = []
        
        mock_file = MagicMock()
        with patch('builtins.open', mock_open()):
            visitor.visit(mock_directory_data)
            # No files should be opened or processed
            assert not mock_file.write.called


    def test_visit_with_large_files(self, visitor, mock_directory_data):
        """Test visiting directory with files larger than 250 characters."""
        large_code = "x" * 300  # Create content larger than 250 chars
        summary = "Code summary"
        
        # Create mock files for read and write
        mock_read_file = MagicMock()
        mock_read_file.read = MagicMock(return_value=large_code)
        mock_write_file = MagicMock()
        mock_write_file.write = MagicMock()
        
        with patch('builtins.open', side_effect=[mock_read_file, mock_write_file]) as mock_open_func, \
             patch.object(visitor, 'summarise_code', return_value=summary), \
             patch('os.path.getmtime', return_value=0), \
             patch('os.path.exists', return_value=True):
            
            visitor.visit(mock_directory_data)
            
            # Verify summary was written
            assert mock_write_file.write.called
            write_calls = mock_write_file.write.call_args_list
            assert len(write_calls) > 0
            assert summary in str(write_calls[0])

    def test_visit_with_small_files(self, visitor, mock_directory_data):
        """Test visiting directory with files smaller than 250 characters."""
        small_code = "x" * 100  # Create content smaller than 250 chars
        
        # Create a mock file with write capability
        mock_file = MagicMock()
        mock_file.write = MagicMock()
        mock_read_file = MagicMock()
        mock_read_file.read = MagicMock(return_value=small_code)
        
        with patch('builtins.open', side_effect=[mock_read_file, mock_file]) as mock_open_func, \
             patch.object(visitor, 'summarise_code') as mock_summarise, \
             patch('os.path.getmtime', return_value=0), \
             patch('os.path.exists', return_value=True):
            
            visitor.visit(mock_directory_data)
            
            # Verify summarise_code was not called for small files
            mock_summarise.assert_not_called()

    def test_visit_with_file_read_error(self, visitor, mock_directory_data):
        """Test handling of file read errors during visit."""
        with patch('builtins.open') as mock_open_func, \
             patch('builtins.print') as mock_print, \
             patch('os.path.getmtime', return_value=0), \
             patch('os.path.exists', return_value=True):
            
            mock_open_func.side_effect = Exception("File read error")
            
            # Should not raise exception
            visitor.visit(mock_directory_data)
            
            # Should print error message
            assert mock_print.called
            assert "Failed to summarize" in str(mock_print.call_args)


    @pytest.mark.integration
    def test_braid_api_integration(self, tmp_path):
        """Integration test using actual Braid API."""
        # Create a temporary test file
        test_file = tmp_path / "test.py"
        test_code = """
def calculate_sum(a: int, b: int) -> int:
    '''Calculate the sum of two integers.'''
    return a + b

def multiply_numbers(x: int, y: int) -> int:
    '''Multiply two numbers together.'''
    return x * y
"""
        test_file.write_text(test_code)
        
        # Create DirectoryData with the test file
        data = DirectoryData(path=tmp_path)
        data.source_files = [test_file]
        data.has_readme = False
        
        # Create visitor with Braid API
        visitor = DirectoryVisitorForReadme(model_type="braid_api")
        
        # Visit the directory
        visitor.visit(data)
        
        # Check if ReadMe.Salon.md was created
        readme_path = tmp_path / DirectoryVisitorForReadme.SUMMARY_FILENAME
        assert readme_path.exists()
        content = readme_path.read_text()
        
        # Basic validation of the content
        assert "test.py" in content
        assert "Generated by Salon" in content

    @pytest.mark.integration
    def test_local_gemini_integration(self, tmp_path):
        """Integration test using actual Local Gemini."""
        # Create a temporary test file
        test_file = tmp_path / "test.py"
        test_code = """
class Calculator:
    '''A simple calculator class.'''
    
    def add(self, a: float, b: float) -> float:
        '''Add two numbers.'''
        return a + b
        
    def subtract(self, a: float, b: float) -> float:
        '''Subtract b from a.'''
        return a - b
"""
        test_file.write_text(test_code)
        
        # Create DirectoryData with the test file
        data = DirectoryData(path=tmp_path)
        data.source_files = [test_file]
        data.has_readme = False
        
        # Create visitor with Local Gemini
        visitor = DirectoryVisitorForReadme(model_type="local_gemini")
        
        # Visit the directory
        visitor.visit(data)
        
        # Check if ReadMe.Salon.md was created
        readme_path = tmp_path / DirectoryVisitorForReadme.SUMMARY_FILENAME
        assert readme_path.exists()
        content = readme_path.read_text()
        
        # Basic validation of the content
        assert "test.py" in content
        assert "Generated by Salon" in content
