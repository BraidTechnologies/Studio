import os
import sys
import pytest
import yaml
import argparse
import tempfile
from pathlib import Path
from unittest.mock import patch, MagicMock, mock_open
from io import StringIO

from Salon.src.core.config_manager import (
    LocalArgumentParser,
    parse_arguments,
    load_yaml,
    validate_args,
    ConfigManager
)


# Test fixtures
@pytest.fixture
def temp_config_file():
    """Fixture to create a temporary config file for testing."""
    config_data = {
        "test_key": "test_value",
        "nested": {
            "key": "value"
        },
        "list_value": [1, 2, 3]
    }
    
    with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as temp_file:
        yaml.dump(config_data, temp_file)
        temp_path = temp_file.name
    
    yield temp_path
    
    # Clean up
    if os.path.exists(temp_path):
        os.remove(temp_path)


@pytest.fixture
def temp_repo_dir():
    """Fixture to create a temporary directory representing a repository."""
    with tempfile.TemporaryDirectory() as temp_dir:
        yield temp_dir


@pytest.fixture
def mock_args():
    """Fixture to create a mock args object."""
    args = MagicMock(spec=argparse.Namespace)
    args.repo_path = "/fake/repo/path"
    args.output_dir = "/fake/output/dir"
    args.cfg = "/fake/config.yaml"
    args.model_type = "braid_api"
    args.max_words = 200000
    args.skip_patterns = ["*.md", "*.txt"]
    args.skip_dirs = ["node_modules", "venv"]
    args.verbose = True
    return args


class TestLocalArgumentParser:
    """Tests for the LocalArgumentParser class."""
    
    def test_error_handling(self):
        """Test that the error method exits with code 2 and prints help."""
        parser = LocalArgumentParser(description="Test parser")
        
        # Mock sys.stderr and sys.exit
        with patch('sys.stderr', new=StringIO()) as fake_stderr:
            with pytest.raises(SystemExit) as excinfo:
                parser.error("Test error message")
            
            # Check exit code
            assert excinfo.value.code == 2
            
            # Check error message was written to stderr
            stderr_output = fake_stderr.getvalue()
            assert "error: Test error message" in stderr_output


class TestParseArguments:
    """Tests for the parse_arguments function."""
    
    @patch('sys.argv', ['program', '--repo_path', '/test/repo'])
    def test_parse_arguments_minimal(self):
        """Test parsing arguments with minimal required arguments."""
        args = parse_arguments("Test description")
        
        assert args.repo_path == '/test/repo'
        assert args.model_type == 'braid_api'  # Default value
        assert args.cfg == 'config.yaml'  # Default value
        assert args.max_words == 200000  # Default value
        assert args.output_dir == '.'  # Default value
        assert args.skip_patterns is None  # Default value
        assert args.skip_dirs is None  # Default value
        assert not args.verbose  # Default value
    
    @patch('sys.argv', [
        'program',
        '--repo_path', '/test/repo',
        '--model_type', 'local_gemini',
        '--cfg', 'custom_config.yaml',
        '--max_words', '100000',
        '--output_dir', '/test/output',
        '--skip_patterns', '*.md', '*.txt',
        '--skip_dirs', 'node_modules', 'venv',
        '--verbose'
    ])
    def test_parse_arguments_full(self):
        """Test parsing arguments with all arguments specified."""
        args = parse_arguments("Test description")
        
        assert args.repo_path == '/test/repo'
        assert args.model_type == 'local_gemini'
        assert args.cfg == 'custom_config.yaml'
        assert args.max_words == 100000
        assert args.output_dir == '/test/output'
        assert args.skip_patterns == ['*.md', '*.txt']
        assert args.skip_dirs == ['node_modules', 'venv']
        assert args.verbose


class TestLoadYaml:
    """Tests for the load_yaml function."""
    
    def test_load_yaml_success(self, temp_config_file):
        """Test loading a valid YAML file."""
        config = load_yaml(temp_config_file)
        
        assert isinstance(config, dict)
        assert config['test_key'] == 'test_value'
        assert config['nested']['key'] == 'value'
        assert config['list_value'] == [1, 2, 3]
    
    def test_load_yaml_file_not_found(self):
        """Test handling of a non-existent YAML file."""
        with patch('builtins.print') as mock_print:
            config = load_yaml('/nonexistent/file.yaml')
            
            assert config == {}
            mock_print.assert_called_once()
            assert "not found" in mock_print.call_args[0][0]
    
    def test_load_yaml_parse_error(self):
        """Test handling of a YAML file with parsing errors."""
        invalid_yaml = "invalid: yaml: content: - ["
        
        with patch('builtins.open', mock_open(read_data=invalid_yaml)):
            with patch('builtins.print') as mock_print:
                config = load_yaml('invalid.yaml')
                
                assert config == {}
                mock_print.assert_called_once()
                assert "Error parsing YAML file" in mock_print.call_args[0][0]
    
    def test_load_yaml_empty_filename(self):
        """Test handling of an empty filename."""
        config = load_yaml('')
        assert config == {}


class TestValidateArgs:
    """Tests for the validate_args function."""
    
    def test_validate_args_valid_paths(self, temp_repo_dir):
        """Test validation with valid paths."""
        args = MagicMock(spec=argparse.Namespace)
        args.repo_path = temp_repo_dir
        args.output_dir = temp_repo_dir
        
        validate_args(args)
        
        # Check that paths were resolved
        assert isinstance(args.repo_path, Path)
        assert isinstance(args.output_dir, Path)
    
    def test_validate_args_nonexistent_repo(self):
        """Test validation with a non-existent repository path."""
        args = MagicMock(spec=argparse.Namespace)
        args.repo_path = '/nonexistent/repo/path'
        
        with pytest.raises(ValueError) as excinfo:
            validate_args(args)
        
        assert "Repository path does not exist" in str(excinfo.value)
    
    def test_validate_args_repo_not_dir(self, tmp_path):
        """Test validation when repo_path is not a directory."""
        # Create a file instead of a directory
        file_path = tmp_path / "file.txt"
        file_path.touch()
        
        args = MagicMock(spec=argparse.Namespace)
        args.repo_path = str(file_path)
        
        with pytest.raises(ValueError) as excinfo:
            validate_args(args)
        
        assert "Repository path is not a directory" in str(excinfo.value)
    
    def test_validate_args_creates_output_dir(self, tmp_path):
        """Test that validate_args creates the output directory if it doesn't exist."""
        repo_dir = tmp_path / "repo"
        repo_dir.mkdir()
        
        output_dir = tmp_path / "output"
        # Don't create the output directory yet
        
        args = MagicMock(spec=argparse.Namespace)
        args.repo_path = str(repo_dir)
        args.output_dir = str(output_dir)
        
        validate_args(args)
        
        # Check that the output directory was created
        assert output_dir.exists()
        assert output_dir.is_dir()


class TestConfigManager:
    """Tests for the ConfigManager class."""
    
    def test_init(self):
        """Test initialization of ConfigManager."""
        manager = ConfigManager("Test description")
        
        assert manager.description == "Test description"
        assert manager.args is None
        assert manager.config is None
    
    @patch('Salon.src.core.config_manager.parse_arguments')
    @patch('Salon.src.core.config_manager.load_yaml')
    @patch('Salon.src.core.config_manager.validate_args')
    def test_load_config(self, mock_validate, mock_load_yaml, mock_parse):
        """Test the load_config method."""
        # Set up mocks
        mock_args = MagicMock()
        mock_args.cfg = 'test_config.yaml'
        mock_parse.return_value = mock_args
        
        mock_config = {'key': 'value'}
        mock_load_yaml.return_value = mock_config
        
        # Create and test ConfigManager
        manager = ConfigManager("Test description")
        manager.load_config()
        
        # Verify calls
        mock_parse.assert_called_once_with("Test description")
        mock_load_yaml.assert_called_once_with('test_config.yaml')
        mock_validate.assert_called_once_with(mock_args)
        
        # Verify state
        assert manager.args == mock_args
        assert manager.config == mock_config
    
    def test_get_args_without_loading(self):
        """Test get_args when config hasn't been loaded."""
        manager = ConfigManager("Test description")
        
        with pytest.raises(ValueError) as excinfo:
            manager.get_args()
        
        assert "Configuration not loaded" in str(excinfo.value)
    
    def test_get_config_without_loading(self):
        """Test get_config when config hasn't been loaded."""
        manager = ConfigManager("Test description")
        
        with pytest.raises(ValueError) as excinfo:
            manager.get_config()
        
        assert "Configuration not loaded" in str(excinfo.value)
    
    @patch('Salon.src.core.config_manager.parse_arguments')
    @patch('Salon.src.core.config_manager.load_yaml')
    @patch('Salon.src.core.config_manager.validate_args')
    def test_get_args_after_loading(self, mock_validate, mock_load_yaml, mock_parse):
        """Test get_args after config has been loaded."""
        # Set up mocks
        mock_args = MagicMock()
        mock_args.cfg = 'test_config.yaml'
        mock_parse.return_value = mock_args
        
        # Create and test ConfigManager
        manager = ConfigManager("Test description")
        manager.load_config()
        
        args = manager.get_args()
        assert args == mock_args
    
    @patch('Salon.src.core.config_manager.parse_arguments')
    @patch('Salon.src.core.config_manager.load_yaml')
    @patch('Salon.src.core.config_manager.validate_args')
    def test_get_config_after_loading(self, mock_validate, mock_load_yaml, mock_parse):
        """Test get_config after config has been loaded."""
        # Set up mocks
        mock_args = MagicMock()
        mock_args.cfg = 'test_config.yaml'
        mock_parse.return_value = mock_args
        
        mock_config = {'key': 'value'}
        mock_load_yaml.return_value = mock_config
        
        # Create and test ConfigManager
        manager = ConfigManager("Test description")
        manager.load_config()
        
        config = manager.get_config()
        assert config == mock_config
    
    def test_integration_with_temp_files(self, temp_repo_dir, temp_config_file):
        """Integration test with actual temporary files."""
        # Prepare test arguments
        test_args = [
            'program',
            '--repo_path', temp_repo_dir,
            '--cfg', temp_config_file,
            '--output_dir', temp_repo_dir
        ]
        
        with patch('sys.argv', test_args):
            # Create and test ConfigManager
            manager = ConfigManager("Test description")
            manager.load_config()
            
            # Verify state
            args = manager.get_args()
            config = manager.get_config()
            
            assert isinstance(args, argparse.Namespace)
            assert isinstance(config, dict)
            assert args.repo_path.exists()
            assert args.output_dir.exists()
            assert 'test_key' in config
            assert config['test_key'] == 'test_value'


if __name__ == "__main__":
    pytest.main(["-v", __file__])
