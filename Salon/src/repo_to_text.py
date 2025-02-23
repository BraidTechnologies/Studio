# repo_to_text.py
"""
Processes a local GitHub repository by:
1. Concatenating file contents into text files (up to max_words each).
2. Generating 'ReadMe.Salon.md' with code summaries if needed.

Usage:
    python repo_to_text.py --cfg <config.yaml> --repo_path <repo> [options]

Options:
    --cfg             Path to the config file (default: config.yaml)
    --repo_path       Path to the local GitHub repository (absolute or relative).
    -w, --max_words   Maximum number of words per output file (default: 200,000).
    -o, --output_dir  Directory to save the output files (default: current directory).
    --skip_patterns   Additional file patterns to skip (e.g., "*.md" "*.txt").
    --skip_dirs       Additional directories to skip.
    --model_type      Model type: "braid_api" or "local_gemini" (default: "braid_api").
    -v, --verbose     Enable verbose output.
"""

import argparse
import os
import sys
import yaml
import nltk
from pathlib import Path
from typing import Dict, Any, Set

# Local modules
from .directory_walker import add_visitor, walk_directory
from .visitor_factory import get_visitors_for_text

nltk.download('punkt', quiet=True)

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

def parse_arguments() -> argparse.Namespace:
    """
    Parse command-line arguments.
    """
    parser = argparse.ArgumentParser(
        description='Process a GitHub repository and concatenate file contents with optional readme summaries.',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument(
        '--cfg',
        type=str,
        default="config.yaml",
        help='Path to the config.yaml file'
    )

    parser.add_argument(
        '--repo_path',
        type=str,
        default='.',
        help='Path to the local GitHub repository (absolute or relative)'
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
        '--model_type',
        type=str,
        default='braid_api',
        help='Which summarisation model to use: "braid_api" or "local_gemini"'
    )

    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Enable verbose output'
    )

    return parser.parse_args()

def validate_args(args: argparse.Namespace) -> None:
    """
    Validate and normalize arguments.
    """
    repo_path = Path(args.repo_path).resolve()
    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")

    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    args.repo_path = repo_path
    args.output_dir = output_dir

def main() -> int:
    """
    Main entry point for the script.
    """
    args = parse_arguments()

    try:
        validate_args(args)
    except ValueError as e:
        print(f"Error: {e}")
        return 1

    # Load config
    config = load_yaml(args.cfg)

    skip_dirs: Set[str] = set(config.get("skip_dirs", []))
    if args.skip_dirs:
        skip_dirs.update(args.skip_dirs)

    skip_patterns: Set[str] = set(config.get("skip_patterns", []))
    if args.skip_patterns:
        skip_patterns.update(args.skip_patterns)

    # Also read "source_patterns" from config
    source_patterns = config.get("source_patterns", [])

    # Use factory to get the visitors we want
    visitors = get_visitors_for_text(args.model_type, args.max_words, args.output_dir)
    for v in visitors:
        add_visitor(v)

    # Optionally cd into the output directory if desired
    os.chdir(args.output_dir)

    walk_directory(
        root_path=args.repo_path,
        skip_dirs=list(skip_dirs),
        skip_patterns=list(skip_patterns),
        source_patterns=source_patterns
    )

    # The notebook visitor might need a final flush. Let's call it if found:
    # If you want to ensure it flushes, you can do so:
    for v in visitors:
        # We'll check if it's the NotebookLM visitor
        if hasattr(v, 'save_current_content'):
            v.save_current_content()

    return 0

if __name__ == "__main__":
    sys.exit(main())
