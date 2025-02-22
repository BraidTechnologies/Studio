# config_manager.py
import argparse
import yaml
from pathlib import Path
from typing import Dict, Any, Optional


class LocalArgumentParser(argparse.ArgumentParser):
    """
    Custom argument parser that overrides the default error handling.
    """

    def error(self, message):
        import sys
        sys.stderr.write('error: %s\n' % message)
        self.print_help()
        sys.exit(2)


def parse_arguments(description: str) -> argparse.Namespace:
    """
    Parse command-line arguments for the script.
    """
    parser = LocalArgumentParser(
        description=description,
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument(
        '--repo_path',
        type=str,
        required=True,
        help='Path to the local GitHub repository (absolute or relative)'
    )

    parser.add_argument(
        '--model_type',
        type=str,
        default='braid_api',
        help='Which summarisation model to use: "braid_api" or "local_gemini"'
    )

    parser.add_argument(
        '--cfg',
        type=str,
        default="config.yaml",
        help='Path to the config.yaml file'
    )

    parser.add_argument(
        '-w', '--max_words',
        type=int,
        default=200000,
        help='Maximum number of words per output file'
    )

    parser.add_argument(
        '-o', '--output_dir',
        type=str,
        default='.',
        help='Directory to save the output files'
    )

    parser.add_argument(
        '--skip_patterns',
        type=str,
        nargs='+',
        help='Additional file patterns to skip (e.g., "*.md" "*.txt")'
    )

    parser.add_argument(
        '--skip_dirs',
        type=str,
        nargs='+',
        help='Additional directories to skip'
    )

    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Enable verbose output'
    )

    return parser.parse_args()


def load_yaml(fname: str) -> Dict[str, Any]:
    """
    Load configuration from the YAML config file.
    """
    if not fname:
        return {}
    try:
        with open(fname, 'r') as config_file:
            return yaml.safe_load(config_file)
    except FileNotFoundError:
        print(f"Error: Configuration file '{fname}' not found.")
        return {}
    except yaml.YAMLError as e:
        print(f"Error parsing YAML file: {e}")
        return {}


def validate_args(args: argparse.Namespace) -> None:
    """
    Validate and normalize arguments.
    """
    repo_path = Path(args.repo_path).resolve()
    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")

    args.repo_path = repo_path

    if args.output_dir:
        output_dir = Path(args.output_dir).resolve()
        output_dir.mkdir(parents=True, exist_ok=True)
        args.output_dir = output_dir



class ConfigManager:
    """
    Manages configuration by parsing arguments, loading YAML config, and validating arguments.
    """

    def __init__(self, description: str):
        self.args = None
        self.config = None
        self.description = description

    def load_config(self) -> None:
        """
        Parse arguments, load YAML configuration, and validate arguments.
        """
        self.args = parse_arguments(self.description)
        self.config = load_yaml(self.args.cfg)
        validate_args(self.args)

    def get_args(self) -> argparse.Namespace:
        """
        Return the parsed arguments.
        """
        if self.args is None:
            raise ValueError("Configuration not loaded. Call load_config() first.")
        return self.args

    def get_config(self) -> Dict[str, Any]:
        """
        Return the loaded YAML configuration.
        """
        if self.config is None:
            raise ValueError("Configuration not loaded. Call load_config() first.")
        return self.config


# Example usage:
if __name__ == '__main__':
    config_manager = ConfigManager()
    config_manager.load_config()

    args = config_manager.get_args()
    config = config_manager.get_config()

    print("Arguments:", args)
    print("Configuration:", config)