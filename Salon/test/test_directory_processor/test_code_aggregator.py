import pytest
from pathlib import Path
from unittest.mock import MagicMock, mock_open, patch
from Salon.src.directory_processor.code_aggregator import CodeAggregator
from Salon.src.types.directory_data import DirectoryData

@pytest.fixture
def mock_directory_data():
    mock_file = MagicMock()
    mock_file.relative_to = MagicMock(return_value=Path("subdir/file1.py"))
    mock_file.parts = ("subdir", "file1.py")
    
    root_dir = MagicMock(spec=DirectoryData)
    root_dir.path = Path("/fake/root")
    root_dir.all_files = [mock_file]
    root_dir.sub_directories = []
    
    return root_dir

@pytest.fixture
def mock_code_aggregator():
    aggregator = CodeAggregator(max_words=100)
    aggregator.add_file_block = MagicMock()
    aggregator.save_current_content = MagicMock()
    return aggregator

def test_visit_accumulates_content(mock_directory_data, mock_code_aggregator):
    with patch("builtins.open", mock_open(read_data="sample content")):
        mock_code_aggregator.visit(mock_directory_data)
    
    assert mock_code_aggregator.add_file_block.called
    assert mock_code_aggregator.save_current_content.called
