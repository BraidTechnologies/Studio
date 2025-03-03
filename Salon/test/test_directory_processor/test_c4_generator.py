import pytest
from pathlib import Path
from unittest.mock import MagicMock, patch
from Salon.src.directory_processor.c4_generator import C4Generator
from Salon.src.types.directory_data import DirectoryData

@pytest.fixture
def mock_directory_data():
    sub_dir = MagicMock(spec=DirectoryData)
    sub_dir.path = Path("/fake/subdir")
    sub_dir.all_files = [MagicMock(name="ReadMe.Salon.md")]
    
    root_dir = MagicMock(spec=DirectoryData)
    root_dir.path = Path("/fake/root")
    root_dir.all_files = [MagicMock(name="readme.md")]
    root_dir.sub_directories = [sub_dir]
    
    return root_dir

@pytest.fixture
def mock_c4_generator():
    generator = C4Generator(model_type="braid_api")
    generator.file_handler.read_file = MagicMock(return_value="Sample content")
    generator.file_handler.write_file_version = MagicMock()
    generator.summarise_code = MagicMock(return_value="Generated Summary")
    return generator

def test_visit_generates_diagrams(mock_directory_data, mock_c4_generator):
    mock_c4_generator.visit(mock_directory_data)
    
    assert mock_c4_generator.summarise_code.call_count == 3
    assert mock_c4_generator.file_handler.write_file_version.call_count == 3
