# test_config_manager.py

import pytest
import argparse
from pathlib import Path
from unittest.mock import patch
from Salon.src.core.config_manager import ConfigManager, LocalArgumentParser, parse_arguments, load_yaml, validate_args  # Assuming config_manager.py is in the same directory


def test_parse_arguments():
    """Test argument parsing."""
    with patch('sys.argv', ['script.py', '--repo_path', '/path/to/repo']):
        args = parse_arguments("Test Description")
        assert args.repo_path == '/path/to/repo'
        assert args.model_type == 'braid_api'
        assert args.cfg == 'config.yaml'
        assert args.max_words == 200000
        assert args.output_dir == '.'
        assert args.skip_patterns is None
        assert args.skip_dirs is None
        assert args.verbose is False


def test_load_yaml_valid(tmp_path):
    """Test loading a valid YAML file."""
    config_file = tmp_path / "config.yaml"
    config_file.write_text("key: value")
    config = load_yaml(str(config_file))
    assert config == {'key': 'value'}


def test_load_yaml_missing():
    """Test handling a missing YAML file."""
    config = load_yaml("missing.yaml")
    assert config == {}


def test_load_yaml_invalid(tmp_path):
    """Test handling an invalid YAML file."""
    config_file = tmp_path / "config.yaml"
    config_file.write_text(":")  # Invalid YAML
    config = load_yaml(str(config_file))
    assert config == {}


def test_validate_args_valid(tmp_path, monkeypatch):
    """Test validating valid arguments."""
    repo_path = tmp_path / "repo"
    repo_path.mkdir()
    output_dir = tmp_path / "output"

    args = argparse.Namespace(repo_path=str(repo_path), output_dir=str(output_dir))
    validate_args(args)

    assert args.repo_path == repo_path.resolve()
    assert args.output_dir == output_dir.resolve()
    assert output_dir.exists()


def test_validate_args_repo_not_exists():
    """Test when the repository path does not exist."""
    args = argparse.Namespace(repo_path='/path/that/does/not/exist', output_dir='output')
    with pytest.raises(ValueError, match="Repository path does not exist"):
        validate_args(args)


def test_validate_args_repo_not_directory(tmp_path):
    """Test when the repository path is not a directory."""
    file_path = tmp_path / "not_a_directory"
    file_path.write_text("Some content")
    args = argparse.Namespace(repo_path=str(file_path), output_dir='output')
    with pytest.raises(ValueError, match="Repository path is not a directory"):
        validate_args(args)


def test_config_manager_integration(tmp_path):
    """Test the ConfigManager class integration."""
    # Create a dummy config file
    config_file = tmp_path / "config.yaml"
    config_file.write_text("test_key: test_value")

    # Create a ConfigManager instance
    config_manager = ConfigManager("Test Description")

    # Mock the arguments
    with patch('sys.argv', ['script.py', '--repo_path', str(tmp_path), '--cfg', str(config_file)]):
        # Load the configuration
        config_manager.load_config()

        # Get the arguments and config
        args = config_manager.get_args()
        config = config_manager.get_config()

        # Assert that the arguments and config are loaded correctly
        assert args.repo_path == tmp_path.resolve()
        assert config['test_key'] == 'test_value'


def test_config_manager_get_args_before_load(tmp_path):
    """Test that get_args raises an error if called before load_config."""
    config_manager = ConfigManager("Test Description")
    with pytest.raises(ValueError, match="Configuration not loaded. Call load_config() first."):
        config_manager.get_args()


def test_config_manager_get_config_before_load(tmp_path):
    """Test that get_config raises an error if called before load_config."""
    config_manager = ConfigManager("Test Description")
    with pytest.raises(ValueError, match="Configuration not loaded. Call load_config() first."):
        config_manager.get_config()