# test_repo_to_text.py
import sys
import os
import pytest
from pathlib import Path
from unittest.mock import patch, mock_open

# Make sure we can import from the `src` directory
TESTS_DIR = Path(__file__).resolve().parent
SRC_DIR = TESTS_DIR.parent / "src"
sys.path.append(str(SRC_DIR))

from repo_to_text import (
    load_yaml,
    parse_arguments,
    validate_args,
    main
)

@pytest.fixture
def sample_config(tmp_path):
    """Creates a temporary YAML config file."""
    config_content = """
skip_dirs:
  - .git
  - node_modules
skip_patterns:
  - "*.md"
  - "*.txt"
source_patterns:
  - "*.py"
"""
    cfg_file = tmp_path / "config.yaml"
    cfg_file.write_text(config_content)
    return cfg_file

def test_load_yaml_valid(sample_config):
    """Test loading a valid YAML configuration."""
    config = load_yaml(str(sample_config))
    assert "skip_dirs" in config
    assert "skip_patterns" in config
    assert "source_patterns" in config

def test_load_yaml_file_not_found():
    """Test loading a YAML that doesn't exist."""
    config = load_yaml("non_existent_file.yaml")
    assert config == {}

def test_load_yaml_invalid_yaml(tmp_path):
    """Test loading invalid YAML content."""
    invalid_content = "this is not: valid: yaml: -"
    cfg_file = tmp_path / "invalid.yaml"
    cfg_file.write_text(invalid_content)

    config = load_yaml(str(cfg_file))
    # Should catch the parsing error and return {}
    assert config == {}

def test_parse_arguments_defaults(monkeypatch):
    """Test parsing arguments with all defaults."""
    test_args = ["repo_to_text.py"]
    monkeypatch.setattr(sys, 'argv', test_args)
    args = parse_arguments()
    assert args.cfg == "config.yaml"
    assert args.repo_path == "."
    assert args.max_words == 200000
    assert args.output_dir == "."
    assert args.skip_patterns is None
    assert args.skip_dirs is None
    assert not args.verbose

def test_parse_arguments_custom(monkeypatch):
    """Test parsing arguments with custom values."""
    test_args = [
        "repo_to_text.py", 
        "--cfg", "myconfig.yaml",
        "--repo_path", "some/repo",
        "-w", "100000",
        "-o", "out_dir",
        "--skip_patterns", "*.md", "*.txt",
        "--skip_dirs", "tests",
        "-v"
    ]
    monkeypatch.setattr(sys, 'argv', test_args)
    args = parse_arguments()
    assert args.cfg == "myconfig.yaml"
    assert args.repo_path == "some/repo"
    assert args.max_words == 100000
    assert args.output_dir == "out_dir"
    assert args.skip_patterns == ["*.md", "*.txt"]
    assert args.skip_dirs == ["tests"]
    assert args.verbose

def test_validate_args_valid(tmp_path):
    """Test validate_args with a valid directory."""
    class Args:
        repo_path = str(tmp_path)
        output_dir = str(tmp_path / "out")
    validate_args(Args())  # Should not raise

def test_validate_args_nonexistent_path():
    """Test validate_args when repo path doesn't exist."""
    class Args:
        repo_path = "/nonexistent/path/for/test"
        output_dir = "/nonexistent/path/for/output"
    with pytest.raises(ValueError) as exc:
        validate_args(Args())
    assert "does not exist" in str(exc.value)

def test_validate_args_not_directory(tmp_path):
    """Test validate_args when repo path is actually a file."""
    file_path = tmp_path / "some_file.txt"
    file_path.touch()

    class Args:
        repo_path = str(file_path)
        output_dir = str(tmp_path)
    with pytest.raises(ValueError) as exc:
        validate_args(Args())
    assert "is not a directory" in str(exc.value)

@patch("repo_to_text.walk_directory")
@patch("repo_to_text.add_visitor")
def test_main_success(mock_add_visitor, mock_walk_dir, monkeypatch, tmp_path):
    """Test main with valid arguments, ensuring correct calls."""
    # Setup command-line args
    test_args = [
        "repo_to_text.py",
        "--cfg", str(tmp_path / "config.yaml"),
        "--repo_path", str(tmp_path),
        "-o", str(tmp_path / "output")
    ]
    # Create a dummy config
    (tmp_path / "config.yaml").write_text("skip_dirs: []\nskip_patterns: []")

    monkeypatch.setattr(sys, 'argv', test_args)

    # Patch out the validate_args to avoid needing real dirs
    with patch("repo_to_text.validate_args") as mock_validate:
        exit_code = main()
        assert exit_code == 0
        mock_validate.assert_called_once()
        mock_add_visitor.assert_any_call(mock_add_visitor.call_args[0][0]) 
        mock_walk_dir.assert_called_once()

@patch("repo_to_text.validate_args", side_effect=ValueError("Invalid repo path"))
def test_main_failure_invalid_repo_path(mock_validate, monkeypatch):
    """Test main returning exit code 1 for invalid repo path."""
    test_args = [
        "repo_to_text.py",
        "--cfg", "config.yaml",
        "--repo_path", "does_not_exist"
    ]
    monkeypatch.setattr(sys, 'argv', test_args)
    exit_code = main()
    assert exit_code == 1
    mock_validate.assert_called_once()
