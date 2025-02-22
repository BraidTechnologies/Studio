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
from .core.config_manager import ConfigManager #Import config manager


def main():
    """Entry point to generate C4 diagrams from a local repo."""
    config_manager = ConfigManager('Process a GitHub repository and concatenate file contents with optional readme summaries')
    try:
        config_manager.load_config()
        args = config_manager.get_args()
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
    return 0

if __name__ == "__main__":
    sys.exit(main())
