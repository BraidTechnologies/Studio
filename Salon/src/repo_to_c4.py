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
from .directory_processor.directory_walker import walk_directory
from .core.config_manager import ConfigManager #Import config manager
from .types.directory_data import DirectoryData
from .directory_processor.factory import getProcessorsRepoToC4
from .directory_processor.base import process_directory

def main():
    """Entry point to generate C4 diagrams from a local repo."""
    config_manager = ConfigManager('Process a GitHub repository and concatenate file contents with optional readme summaries')
    try:
        config_manager.load_config()
        args = config_manager.get_args()
    except ValueError as e:
        print(f"Error: {e}")
        return 1

    # Walk the directory
    directory_data: DirectoryData = walk_directory(
        root_path=args.repo_path,
        skip_dirs=[],
        skip_patterns=[],
        source_patterns=[]
    )

    processors = getProcessorsRepoToC4(args.model_type)
    process_directory(directory_data, processors)

   
    return 0

if __name__ == "__main__":
    sys.exit(main())
