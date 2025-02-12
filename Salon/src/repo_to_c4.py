"""
A tool to analyze a repository and generate C4 diagrams by processing its contents.

This module:
- Uses a DirectoryVisitorForC4 (defined in DirectoryVisitor.py) to handle each directory
- Summarizes code structure and relationships
- Generates C4 architectural diagrams via an API endpoint
"""

import argparse
import os
from pathlib import Path
import sys

# If needed, adjust Python path so we can import from local modules
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Import your local modules
from DirectoryWalker import add_visitor, walk_directory
from DirectoryVisitor import DirectoryVisitorForC4

def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Process a GitHub repository and generate C4 diagrams',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument(
        '--repo_path',
        type=str,
        help='Path to the local GitHub repository (absolute or relative)'
    )

    return parser.parse_args()

def validate_args(args):
    """Validate command line arguments"""
    if not args.repo_path:
        raise ValueError("No repository path provided.")

    # Convert relative path to absolute path
    repo_path = Path(args.repo_path).resolve()

    # Check if repo path exists and is a directory
    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")

    # Update args with resolved paths
    args.repo_path = repo_path

def main():
    # Parse and validate arguments
    args = parse_arguments()
    try:
        validate_args(args)
    except ValueError as e:
        print(f"Error: {e}")
        return 1

    # Create our specialized C4 visitor
    visitor = DirectoryVisitorForC4()

    # Register the visitor
    add_visitor(visitor)

    # Walk the directory
    walk_directory(
        root_path=args.repo_path,
        skip_dirs=[],       # Adjust if you have any default skip dirs
        skip_patterns=[],   # Adjust if you have any default skip patterns
        source_patterns=[]  # Not strictly used here
    )

    return 0

if __name__ == "__main__":
    main()