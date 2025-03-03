import os
from pathlib import Path
from unittest.mock import MagicMock, patch
import pytest
from Salon.src.directory_processor.repo_readme_generator import ReadmeGenerator
from Salon.src.types.directory_data import DirectoryData


@pytest.fixture
def mock_file_handler(mocker):
    """Fixture to mock the FileHandler."""
    return mocker.patch("repo_readme_generator.FileHandler").return_value


@pytest.fixture
def mock_create_model(mocker):
    """Fixture to mock model creation."""
    return mocker.patch("repo_readme_generator.create_model").return_value


@pytest.fixture
def readme_generator(mock_create_model, mock_file_handler):
    """Fixture to create an instance of ReadmeGenerator with mocks."""
    return ReadmeGenerator(model_type="braid_api")


def test_initialization(mock_create_model, readme_generator):
    """Test if ReadmeGenerator initializes correctly."""
    mock_create_model.assert_called_with("braid_api")
    assert readme_generator.driver is not None
    assert readme_generator.file_handler is not None


def test_visit_no_source_files(readme_generator):
    """Test that visit does nothing if there are no source files."""
    directory_data = DirectoryData(path=Path("/test"), source_files=[], has_readme=False)
    result = readme_generator.visit(directory_data)
    assert result is None


@patch("repo_readme_generator.os.path.getmtime")
def test_visit_no_resummarization_needed(mock_getmtime, readme_generator):
    """Test that visit does nothing if no files require summarization."""
    mock_getmtime.return_value = 100  # Simulating old timestamp
    directory_data = DirectoryData(
        path=Path("/test"),
        source_files=[Path("/test/file1.py")],
        has_readme=True
    )
    result = readme_generator.visit(directory_data)
    assert result is None


@patch("repo_readme_generator.os.path.getmtime")
@patch("repo_readme_generator.ReadmeGenerator.summarise_code")
def test_visit_creates_readme(mock_summarise_code, mock_getmtime, readme_generator, mock_file_handler):
    """Test that visit creates a new ReadMe.Salon.md when necessary."""
    mock_getmtime.side_effect = lambda x: 50 if "ReadMe.Salon.md" in str(x) else 100
    mock_file_handler.read_file.return_value = "def test(): pass"
    mock_summarise_code.return_value = "Summarized content"

    directory_data = DirectoryData(
        path=Path("/test"),
        source_files=[Path("/test/file1.py")],
        has_readme=False
    )

    result = readme_generator.visit(directory_data)
    assert result is not None
    mock_file_handler.write_file_version.assert_called()


def test_summarise_code(readme_generator):
    """Test that summarise_code is called correctly."""
    readme_generator.driver.generate_content = MagicMock(return_value="Summarized content")
    summary = readme_generator.summarise_code("def test(): pass")
    assert summary == "Summarized content"
    readme_generator.driver.generate_content.assert_called()
