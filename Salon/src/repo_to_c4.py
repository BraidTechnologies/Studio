# repo_to_c4.py
"""
A tool to analyze a repository and generate C4 diagrams by processing its contents.

Usage:
    python repo_to_c4.py --repo_path <path> --model_type <braid_api|local_gemini>

Options:
    --repo_path  Path to the local GitHub repository (absolute or relative)
    --model_type Model type: "braid_api" or "local_gemini" (default: braid_api)
"""

import argparse
import sys
from pathlib import Path
import os


# Local modules
from .directory_walker import add_visitor, walk_directory
from .visitor_factory import get_visitors_for_c4

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description='Process a GitHub repository and generate 3 C4 diagrams',
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

    return parser.parse_args()

def validate_args(args):
    """Validate command line arguments."""
    repo_path = Path(args.repo_path).resolve()
    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")

    args.repo_path = repo_path

def main():
    """Entry point to generate C4 diagrams from a local repo."""
    args = parse_arguments()
    print("--------------------------------main repo to c4")
    try:
        validate_args(args)
    except ValueError as e:
        print(f"Error: {e}")
        return 1

    # Create the specialized C4 visitor(s) using the factory
    visitors = get_visitors_for_c4(args.model_type)
    for v in visitors:
        add_visitor(v)

    # Walk the directory
    walk_directory(
        root_path=args.repo_path,
        skip_dirs=[],
        skip_patterns=[],
        source_patterns=[]
    )
    print("--------------------after walk_directory")
    return 0

if __name__ == "__main__":
    sys.exit(main())
