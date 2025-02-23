# directory_walker.py
"""
Walks a directory tree and applies registered directory_visitor instances
to each directory encountered.
"""

import os
import fnmatch
from pathlib import Path
from typing import List

from .directory_visitor_base import DirectoryData, DirectoryVisitor

_visitors: List[DirectoryVisitor] = []

def add_visitor(visitor: DirectoryVisitor) -> None:
    """
    Register a visitor that will be applied to each directory.
    """
    _visitors.append(visitor)

def clear_visitors() -> None:
    """
    If you need a way to reset the visitor list between runs, use this.
    """
    _visitors.clear()

def walk_directory(
    root_path: Path,
    skip_dirs: List[str] = None,
    skip_patterns: List[str] = None,
    source_patterns: List[str] = None,
) -> None:
    """
    Recursively walk the directory starting at `root_path`.
    For each directory, build a DirectoryData object, then
    call each registered visitor with that object.
    """
    if skip_dirs is None:
        skip_dirs = []
    if skip_patterns is None:
        skip_patterns = []
    if source_patterns is None:
        source_patterns = []

    root_path = root_path.resolve()

    for dirpath, dirnames, filenames in os.walk(root_path):
        dir_path = Path(dirpath)

        # Skip if directory is in skip_dirs or is .git
        parts = dir_path.parts
        if any(sd in parts for sd in skip_dirs) or ".git" in parts:
            dirnames[:] = []
            continue

        # Build directory data
        directory_data = DirectoryData(path=dir_path)

        # Check if it has a ReadMe.Salon.md
        readme_path = dir_path / "ReadMe.Salon.md"
        directory_data.has_readme = readme_path.is_file()

        # Gather all files while respecting skip_patterns
        for filename in filenames:
            file_path = dir_path / filename

            if any(fnmatch.fnmatch(filename, pattern) for pattern in skip_patterns):
                continue

            directory_data.all_files.append(file_path)

            # If it matches a source pattern, add to source_files
            if any(fnmatch.fnmatch(filename, sp) for sp in source_patterns):
                directory_data.source_files.append(file_path)

        # Call each visitor's visit method
        for visitor in _visitors:
            visitor.visit(directory_data)
