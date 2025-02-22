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
import nltk
from pathlib import Path
from typing import Dict, Any, Set

# Local modules
from .directory_walker import add_visitor, walk_directory
from .visitor_factory import get_visitors_for_text
from .core.config_manager import ConfigManager  # Import ConfigManager

nltk.download('punkt', quiet=True)


def main() -> int:
    """
    Main entry point for the script.
    """
    config_manager = ConfigManager('Process a local GitHub repository')
    try:
        config_manager.load_config()
        args = config_manager.get_args()
        config = config_manager.get_config()
    except ValueError as e:
        print(f"Error: {e}")
        return 1

    # Load config
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
