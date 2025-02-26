import pytest
import argparse
from unittest.mock import patch, mock_open, MagicMock
from pathlib import Path
import yaml

from Salon.src.repo_to_text import parse_arguments, load_yaml, validate_args, main

def test_parse_arguments_defaults():
    """Test default argument parsing."""
    with patch('sys.argv', ['Salon.src.repo_to_text.py']):
        args = parse_arguments()
        # Check that default values are set correctly
        assert args.cfg == "config.yaml"
        assert args.repo_path == "."
        assert args.max_words == 200000
        assert args.output_dir == "."
        assert args.model_type == "braid_api"
        assert not args.verbose

def test_parse_arguments_custom():
    """Test custom argument parsing."""
    with patch('sys.argv', ['Salon.src.repo_to_text.py', '--cfg', 'custom.yaml', '--repo_path', '/path/to/repo', '-w', '100000', '-o', '/output', '--model_type', 'local_gemini', '-v']):
        args = parse_arguments()
        # Check that custom values are parsed correctly
        assert args.cfg == "custom.yaml"
        assert args.repo_path == "/path/to/repo"
        assert args.max_words == 100000
        assert args.output_dir == "/output"
        assert args.model_type == "local_gemini"
        assert args.verbose

def test_load_yaml_file_not_found():
    """Test loading a YAML file that does not exist."""
    with patch('builtins.open', side_effect=FileNotFoundError):
        config = load_yaml('non_existent.yaml')
        # Expect an empty dictionary when the file is not found
        assert config == {}

def test_load_yaml_invalid_yaml():
    """Test loading an invalid YAML file."""
    with patch('builtins.open', mock_open(read_data="invalid: [yaml")):
        with patch('yaml.safe_load', side_effect=yaml.YAMLError):
            config = load_yaml('invalid.yaml')
            # Expect an empty dictionary when the YAML is invalid
            assert config == {}

def test_load_yaml_valid():
    """Test loading a valid YAML file."""
    yaml_content = """
    skip_dirs:
      - dir1
      - dir2
    skip_patterns:
      - "*.md"
      - "*.txt"
    """
    with patch('builtins.open', mock_open(read_data=yaml_content)):
        config = load_yaml('valid.yaml')
        # Check that the loaded configuration matches the expected values
        assert config['skip_dirs'] == ['dir1', 'dir2']
        assert config['skip_patterns'] == ['*.md', '*.txt']

def test_validate_args_invalid_repo_path():
    """Test validation of an invalid repository path."""
    args = argparse.Namespace(repo_path='invalid_path', output_dir='.')
    with pytest.raises(ValueError, match="Repository path does not exist"):
        validate_args(args)

def test_validate_args_repo_path_not_dir():
    """Test validation when the repository path is not a directory."""
    with patch('pathlib.Path.exists', return_value=True):
        with patch('pathlib.Path.is_dir', return_value=False):
            args = argparse.Namespace(repo_path='file_path', output_dir='.')
            with pytest.raises(ValueError, match="Repository path is not a directory"):
                validate_args(args)

def test_validate_args_valid_paths():
    """Test validation of valid repository and output directory paths."""
    with patch('pathlib.Path.exists', return_value=True), patch('pathlib.Path.is_dir', return_value=True), patch('pathlib.Path.mkdir'):
        args = argparse.Namespace(repo_path='valid_path', output_dir='output_dir')
        validate_args(args)
        # Check that the paths are resolved correctly
        assert args.repo_path == Path('valid_path').resolve()
        assert args.output_dir == Path('output_dir').resolve()

def test_main_invalid_args(monkeypatch):
    """Test the main function with invalid arguments."""
    monkeypatch.setattr('sys.argv', ['Salon.src.repo_to_text.py', '--repo_path', 'invalid_path'])
    with patch('builtins.print') as mock_print:
        assert main() == 1
        # Check that the error message is printed
        mock_print.assert_called_with("Error: Repository path does not exist: invalid_path")

def test_main_valid_args(monkeypatch):
    """Test the main function with valid arguments."""
    monkeypatch.setattr('sys.argv', ['Salon.src.repo_to_text.py', '--repo_path', '.', '--cfg', 'config.yaml'])
    with patch('Salon.src.repo_to_text.validate_args'), \
         patch('Salon.src.repo_to_text.load_yaml', return_value={}), \
         patch('Salon.src.repo_to_text.walk_directory'), \
         patch('os.chdir'):
        assert main() == 0

def test_main_with_config(monkeypatch):
    """Test the main function with a configuration file."""
    config = {
        'skip_dirs': ['dir1'],
        'skip_patterns': ['*.md'],
        'source_patterns': ['*.py']
    }
    monkeypatch.setattr('sys.argv', ['Salon.src.repo_to_text.py', '--repo_path', '.', '--cfg', 'config.yaml'])
    with patch('Salon.src.repo_to_text.validate_args'), \
         patch('Salon.src.repo_to_text.load_yaml', return_value=config), \
         patch('Salon.src.repo_to_text.walk_directory'), \
         patch('os.chdir'):
        assert main() == 0
