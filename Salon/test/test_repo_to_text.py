import pytest
import sys
import os
from unittest import mock
from Salon.src.repo_to_text import main
from Salon.src.core.config_manager import ConfigManager
from Salon.src.types.directory_data import DirectoryData
from Salon.src.directory_processor.directory_walker import walk_directory
from Salon.src.directory_processor.factory import getProcessorsRepoToText
from Salon.src.directory_processor.base import process_directory


@mock.patch("repo_to_text.ConfigManager.load_config")
@mock.patch("repo_to_text.ConfigManager.get_args")
@mock.patch("repo_to_text.ConfigManager.get_config")
@mock.patch("repo_to_text.walk_directory")
@mock.patch("repo_to_text.getProcessorsRepoToText")
@mock.patch("repo_to_text.process_directory")
def test_main_success(mock_process_directory, mock_get_processors, mock_walk_directory, mock_get_config, mock_get_args, mock_load_config):
    """Test main() when all functions execute successfully."""
    mock_get_args.return_value = mock.Mock(
        repo_path="test_repo",
        model_type="braid_api",
        max_words=200000,
        output_dir="output_dir",
        skip_patterns=None,
        skip_dirs=None
    )
    mock_get_config.return_value = {"skip_dirs": [], "skip_patterns": [], "source_patterns": []}
    mock_walk_directory.return_value = DirectoryData(files=[], directories=[])

    with mock.patch("sys.exit") as mock_exit, mock.patch("os.chdir") as mock_chdir:
        main()
        mock_chdir.assert_called_with("output_dir")
        mock_exit.assert_called_with(0)
        mock_walk_directory.assert_called_with(root_path="test_repo", skip_dirs=[], skip_patterns=[], source_patterns=[])
        mock_get_processors.assert_called_with("braid_api", 200000, "output_dir")
        mock_process_directory.assert_called()


@mock.patch("repo_to_text.ConfigManager.load_config", side_effect=ValueError("Invalid config"))
def test_main_config_error(mock_load_config):
    """Test main() when there is a ValueError during config loading."""
    with mock.patch("sys.exit") as mock_exit:
        main()
        mock_exit.assert_called_with(1)


@mock.patch("sys.argv", ["Salon.src.repo_to_text.py", "--cfg", "config.yaml", "--repo_path", "test_repo", "-w", "50000", "-o", "output_dir"])
def test_argument_parsing():
    """Test if ConfigManager correctly handles command-line arguments."""
    config_manager = ConfigManager("Test description")
    config_manager.load_config()
    args = config_manager.get_args()

    assert args.repo_path == "."
    assert args.max_words == 200000
    assert args.output_dir == "output_dir"
