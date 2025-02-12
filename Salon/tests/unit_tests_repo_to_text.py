import pytest
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

# Add the parent directory of 'Salon' to the system path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Salon.src.DirectoryWalker import add_visitor, clear_visitors, walk_directory
from Salon.src.DirectoryVisitor import DirectoryVisitorForNotebookLM, DirectoryVisitorForReadme, DirectoryData
from Salon.src.repo_to_text import load_yaml, parse_arguments, validate_args, main

# Test DirectoryWalker.py
def test_add_visitor():
    mock_visitor = MagicMock()
    add_visitor(mock_visitor)
    assert len(_visitors) == 1
    assert _visitors[0] == mock_visitor

def test_clear_visitors():
    mock_visitor = MagicMock()
    add_visitor(mock_visitor)
    clear_visitors()
    assert len(_visitors) == 0

def test_walk_directory_no_visitors(tmp_path):
    test_dir = tmp_path / "test"
    test_dir.mkdir()
    walk_directory(test_dir)
    # No assertion needed, just ensure no exceptions

def test_walk_directory_with_visitor(tmp_path):
    test_dir = tmp_path / "test"
    test_dir.mkdir()
    (test_dir / "file.txt").write_text("content")
    mock_visitor = MagicMock()
    add_visitor(mock_visitor)
    walk_directory(test_dir)
    assert mock_visitor.visit.called

# Test DirectoryVisitor.py
def test_directory_data_initialization():
    path = Path("/some/path")
    data = DirectoryData(path)
    assert data.path == path
    assert not data.has_readme
    assert data.source_files == []
    assert data.all_files == []

def test_directory_visitor_for_notebook_lm(tmp_path):
    visitor = DirectoryVisitorForNotebookLM(max_words=10)
    test_file = tmp_path / "file.txt"
    test_file.write_text("word " * 3)
    directory_data = DirectoryData(tmp_path)
    directory_data.all_files.append(test_file)
    visitor.visit(directory_data)
    assert visitor.current_word_count == 3

def test_directory_visitor_for_readme_no_source_files():
    visitor = DirectoryVisitorForReadme()
    directory_data = DirectoryData(Path("/some/path"))
    visitor.visit(directory_data)
    # No assertion needed, just ensure no exceptions

# Test repo_to_text.py
def test_load_yaml_valid_file(tmp_path):
    yaml_content = "key: value"
    yaml_file = tmp_path / "config.yaml"
    yaml_file.write_text(yaml_content)
    config = load_yaml(yaml_file)
    assert config["key"] == "value"

def test_load_yaml_invalid_file():
    config = load_yaml("non_existent.yaml")
    assert config == {}

def test_parse_arguments_defaults():
    with patch('sys.argv', ['repo_to_text.py']):
        args = parse_arguments()
        assert args.cfg == "config.yaml"
        assert args.repo_path == '.'
        assert args.max_words == 200000
        assert args.output_dir == '.'

def test_validate_args_valid(tmp_path):
    args = MagicMock()
    args.repo_path = tmp_path
    args.output_dir = tmp_path
    validate_args(args)
    assert args.repo_path == tmp_path.resolve()
    assert args.output_dir == tmp_path.resolve()

def test_validate_args_invalid_repo_path():
    args = MagicMock()
    args.repo_path = "invalid_path"
    with pytest.raises(ValueError):
        validate_args(args)

def test_main_function(tmp_path):
    with patch('sys.argv', ['repo_to_text.py', '--repo_path', str(tmp_path)]):
        assert main() == 0

# Additional tests for edge cases and error handling
def test_walk_directory_skip_patterns(tmp_path):
    test_dir = tmp_path / "test"
    test_dir.mkdir()
    (test_dir / "file.md").write_text("content")
    mock_visitor = MagicMock()
    add_visitor(mock_visitor)
    walk_directory(test_dir, skip_patterns=["*.md"])
    assert not mock_visitor.visit.called

def test_directory_visitor_for_notebook_lm_exceeding_word_limit(tmp_path):
    visitor = DirectoryVisitorForNotebookLM(max_words=5)
    test_file = tmp_path / "file.txt"
    test_file.write_text("word " * 10)
    directory_data = DirectoryData(tmp_path)
    directory_data.all_files.append(test_file)
    visitor.visit(directory_data)
    assert visitor.current_word_count == 0  # Should have saved and reset

def test_directory_visitor_for_readme_with_source_files(tmp_path):
    visitor = DirectoryVisitorForReadme()
    test_file = tmp_path / "source.py"
    test_file.write_text("print('Hello World')")
    directory_data = DirectoryData(tmp_path)
    directory_data.source_files.append(test_file)
    visitor.visit(directory_data)
    # No assertion needed, just ensure no exceptions

def test_load_yaml_parsing_error(tmp_path):
    yaml_file = tmp_path / "config.yaml"
    yaml_file.write_text("key: : value")
    config = load_yaml(yaml_file)
    assert config == {}

def test_main_function_invalid_args():
    with patch('sys.argv', ['repo_to_text.py', '--repo_path', 'invalid_path']):
        assert main() == 1
