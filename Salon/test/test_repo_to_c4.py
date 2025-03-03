import pytest
import sys
from unittest import mock
from Salon.src.repo_to_c4 import main
from Salon.src.core.config_manager import ConfigManager
from Salon.src.types.directory_data import DirectoryData
from Salon.src.directory_processor.directory_walker import walk_directory
from Salon.src.directory_processor.factory import getProcessorsRepoToC4
from Salon.src.directory_processor.base import process_directory


@mock.patch("repo_to_c4.ConfigManager.load_config")
@mock.patch("repo_to_c4.ConfigManager.get_args")
@mock.patch("repo_to_c4.walk_directory")
@mock.patch("repo_to_c4.getProcessorsRepoToC4")
@mock.patch("repo_to_c4.process_directory")
def test_main_success(mock_process_directory, mock_get_processors, mock_walk_directory, mock_get_args, mock_load_config):
    """Test main() when all functions execute successfully."""
    mock_get_args.return_value = mock.Mock(repo_path="test_repo", model_type="braid_api")
    mock_walk_directory.return_value = DirectoryData(files=[], directories=[])

    with mock.patch("sys.exit") as mock_exit:
        main()
        mock_exit.assert_called_with(0)
        mock_walk_directory.assert_called_with(root_path="test_repo", skip_dirs=[], skip_patterns=[], source_patterns=[])
        mock_get_processors.assert_called_with("braid_api")
        mock_process_directory.assert_called()


@mock.patch("repo_to_c4.ConfigManager.load_config", side_effect=ValueError("Invalid config"))
def test_main_config_error(mock_load_config):
    """Test main() when there is a ValueError during config loading."""
    with mock.patch("sys.exit") as mock_exit:
        main()
        mock_exit.assert_called_with(1)


@mock.patch("sys.argv", ["repo_to_c4.py", "--repo_path", "test_repo", "--model_type", "local_gemini"])
def test_argument_parsing():
    """Test if ConfigManager correctly handles command-line arguments."""
    config_manager = ConfigManager("Test description")
    config_manager.load_config()
    args = config_manager.get_args()

    assert args.repo_path == "test_repo"
    assert args.model_type == "local_gemini"
