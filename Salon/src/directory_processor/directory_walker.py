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
    Recursively walk the directory starting at `root_path`.
    For each directory, build a DirectoryData object, then
    """
    if skip_dirs is None:
        skip_dirs = []
    if skip_patterns is None:
        skip_patterns = []
    if source_patterns is None:
        source_patterns = []

    root_path = root_path.resolve()

    directory_data: List[DirectoryData] = []
    for dirpath, dirnames, filenames in os.walk(root_path):
        dir_path = Path(dirpath)

        # Skip if directory is in skip_dirs or is .git
        parts = dir_path.parts
        if any(sd in parts for sd in skip_dirs) or ".git" in parts:
            dirnames[:] = []
            continue

        # Build directory data
        sub_directory_data = DirectoryData(path=dir_path)

        # Check if it has a ReadMe.Salon.md
        readme_path = dir_path / "ReadMe.Salon.md"
        sub_directory_data.has_readme = readme_path.is_file()

        # Gather all files while respecting skip_patterns
        for filename in filenames:
            file_path = dir_path / filename

            if any(fnmatch.fnmatch(filename, pattern) for pattern in skip_patterns):
                continue

            sub_directory_data.all_files.append(file_path)

            # If it matches a source pattern, add to source_files
            if any(fnmatch.fnmatch(filename, sp) for sp in source_patterns):
                sub_directory_data.source_files.append(file_path)

        directory_data.append(sub_directory_data)

    return directory_data

