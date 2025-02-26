import pytest
from pathlib import Path
from unittest.mock import MagicMock
from Salon.src.directory_processor.base import DirectoryProcessor, process_directory
from Salon.src.types.directory_data import DirectoryData

class MockProcessor(DirectoryProcessor):
    def visit(self, directory_data: DirectoryData) -> Path:
        return Path(f"{directory_data.path}/processed.txt")

@pytest.fixture
def mock_directory_data():
    sub_dir = MagicMock(spec=DirectoryData)
    sub_dir.path = Path("/fake/subdir")
    sub_dir.sub_directories = []
    sub_dir.source_files = []
    
    root_dir = MagicMock(spec=DirectoryData)
    root_dir.path = Path("/fake/root")
    root_dir.sub_directories = [sub_dir]
    root_dir.source_files = []
    
    return root_dir

def test_process_directory(mock_directory_data):
    processor = MockProcessor()
    processors = [processor]
    
    result = process_directory(mock_directory_data, processors)
    
    assert result == Path("/fake/root/processed.txt")
    assert Path("/fake/subdir/processed.txt") in mock_directory_data.source_files
