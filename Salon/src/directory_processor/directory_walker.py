# directory_walker.py
"""
Walks a directory tree and applies registered directory_visitor instances
to each directory encountered.
"""

import os
import fnmatch
from pathlib import Path
from typing import List

from .base import DirectoryProcessor
from ..types.directory_data import DirectoryData

def walk_directory(
    root_path: Path,
    skip_dirs: List[str] = None,
    skip_patterns: List[str] = None,
    source_patterns: List[str] = None,
) -> DirectoryData:
    """
    Recursively walk the directory starting at `root_path` using Path.iterdir().
    Returns a single root DirectoryData with all subdirectories nested correctly.
    """
    if skip_dirs is None:
        skip_dirs = []
    if skip_patterns is None:
        skip_patterns = []
    if source_patterns is None:
        source_patterns = []
    
    # Create DirectoryData for the root
    root_directory_data = DirectoryData(path=root_path)

    for entry in root_path.iterdir():
        if entry.is_dir():
            # Skip ignored directories
            if entry.name in skip_dirs:
                continue

            # Recursively process subdirectory and add to tree
            sub_directory_data = walk_directory(entry, skip_dirs, skip_patterns, source_patterns)
            root_directory_data.sub_directories.append(sub_directory_data)

        elif entry.is_file():
            # Skip files matching skip_patterns
            if any(entry.match(pattern) for pattern in skip_patterns):
                continue

            root_directory_data.all_files.append(entry)

            # If file matches a source pattern, add to source_files
            if any(entry.match(pattern) for pattern in source_patterns):
                root_directory_data.source_files.append(entry)

    # Check if the directory contains ReadMe.Salon.md
    root_directory_data.has_readme = (root_path / "ReadMe.Salon.md").is_file()
    return root_directory_data