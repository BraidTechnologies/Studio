"""
repo_to_text.py

This script processes a local GitHub repository by concatenating the contents of its files into text files, 
with a specified word limit per file.
When it encounters a source file it creates a summary, and acccumulates summaries for all source files ina given directory. 
These are written out at the end. 

Usage:
    python repo_to_text.py --cfg <path_to_config_yaml_file> --repo_path <path-to-repo> [options]

Options:
    --cfg             Path to the config file 
    --repo_path       Path to the local GitHub repository (absolute or relative).
    -w, --max_words   Maximum number of words per output file (default: 200,000).
    -o, --output_dir  Directory to save the output files (default: current directory).
    --skip_patterns   Additional file patterns to skip (e.g., "*.md" "*.txt").
    --skip_dirs       Additional directories to skip.
    -v, --verbose     Enable verbose output.

Example:
    python src/repo_to_text.py --cfg config.yaml --repo_path . -o test_output
    python src/repo_to_text.py --cfg config.yaml --repo_path ./my_repo -w 100000 -o ./output --skip_patterns "*.md" "*.txt" --skip_dirs "tests" -v
    python "D:\Braid Technologies\Fork_January2025_repo\WorkedExamples\Salon\src\repo_to_text.py" --cfg "D:\Braid Technologies\Fork_January2025_repo\WorkedExamples\Salon\config.yaml" --repo_path . -o test_output
    python "D:\Braid Technologies\Fork_January2025_repo\WorkedExamples\Salon\src\repo_to_text.py" --cfg "D:\Braid Technologies\Fork_January2025_repo\WorkedExamples\Salon\config.yaml" --repo_path . -o test_output
    python "D:\Braid Technologies\Fork_January2025_repo\WorkedExamples\Salon\src\repo_to_text.py" --cfg config.yaml --repo_path . -o test_output
    python "D:\Braid Technologies\Fork_January2025_repo\WorkedExamples\Salon\src\repo_to_text_old.py" --cfg config.yaml --repo_path . -o test_output
"""



import argparse
import os
from pathlib import Path
import yaml

# NLTK download if needed
import nltk
nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

# Import from our local modules
from DirectoryVisitor import DirectoryVisitorForNotebookLM, DirectoryVisitorForReadme
from DirectoryWalker import add_visitor, walk_directory


def load_yaml(fname):
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


def parse_arguments():
    """
    Parse command-line arguments
    """
    parser = argparse.ArgumentParser(
        description='Process a GitHub repository and concatenate file contents with a word limit, plus optional ReadMe generation.',
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
        '-v', '--verbose',
        action='store_true',
        help='Enable verbose output'
    )

    return parser.parse_args()


def validate_args(args):
    """Validate and normalize arguments."""
    repo_path = Path(args.repo_path).resolve()

    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")

    # Create output dir if needed
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    args.repo_path = repo_path
    args.output_dir = output_dir


def main():
    args = parse_arguments()

    try:
        validate_args(args)
    except ValueError as e:
        print(f"Error: {e}")
        return 1

    # Load config from YAML
    config = load_yaml(args.cfg)

    # Combine config-based and CLI-based skip patterns
    skip_dirs = set(config.get("skip_dirs", []))
    if args.skip_dirs:
        skip_dirs.update(args.skip_dirs)

    skip_patterns = set(config.get("skip_patterns", []))
    if args.skip_patterns:
        skip_patterns.update(args.skip_patterns)

    # Also read "source_patterns" from config
    source_patterns = config.get("source_patterns", [])

    # Create visitors
    notebook_visitor = DirectoryVisitorForNotebookLM(
        max_words=args.max_words,
        output_dir=args.output_dir
    )

    readme_visitor = DirectoryVisitorForReadme()

    # Register visitors
    add_visitor(notebook_visitor)
    add_visitor(readme_visitor)

    # Change directory to output directory for writing content
    os.chdir(args.output_dir)

    # Walk the directory
    walk_directory(
        root_path=args.repo_path,
        skip_dirs=skip_dirs,
        skip_patterns=skip_patterns,
        source_patterns=source_patterns
    )

    # Optionally, after the walk, you might force a final flush of the notebook visitor’s content:
    notebook_visitor.save_current_content()

    return 0


if __name__ == "__main__":
    main()