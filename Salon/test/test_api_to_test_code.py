import pytest
import json
import yaml
import argparse
from unittest import mock
from Salon.src.api_to_test_code import extract_code, load_api_data, parse_arguments


def test_extract_code():
    content_with_code = "Some text\n```python\nprint('Hello')\n```"
    assert extract_code(content_with_code) == "print('Hello')"

    content_without_code = "Some text without markers"
    assert extract_code(content_without_code) is None


@pytest.fixture
def mock_json_file(tmp_path):
    data = {"key": "value"}
    file = tmp_path / "test.json"
    file.write_text(json.dumps(data))
    return str(file)


@pytest.fixture
def mock_yaml_file(tmp_path):
    data = {"key": "value"}
    file = tmp_path / "test.yaml"
    file.write_text(yaml.dump(data))
    return str(file)


def test_load_api_data_json(mock_json_file):
    assert load_api_data(mock_json_file) == {"key": "value"}


def test_load_api_data_yaml(mock_yaml_file):
    assert load_api_data(mock_yaml_file) == {"key": "value"}


def test_load_api_data_invalid():
    assert load_api_data("non_existent.json") is None


@mock.patch("sys.argv", ["script.py", "test.json", "--eval"])
def test_parse_arguments():
    args = parse_arguments()
    assert args.input_path == "test.json"
    assert args.eval is True
