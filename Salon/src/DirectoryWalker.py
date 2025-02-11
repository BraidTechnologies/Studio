# DirectoryWalker.py

import os
import fnmatch
from pathlib import Path
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Salon.src.DirectoryVisitor import DirectoryData, DirectoryVisitor

_visitors = []

def add_visitor(visitor: DirectoryVisitor):
    """
    Register a visitor that will be applied to each directory
    encountered in the walk_directory function.
    """
    _visitors.append(visitor)

def clear_visitors():
    """
    (Optional) If you need a way to reset the visitor list between runs.
    """
    _visitors.clear()

def walk_directory(
    root_path: Path,
    skip_dirs=None,
    skip_patterns=None,
    source_patterns=None,
):
    """
    Recursively walk the directory starting at `root_path`.
    For each directory, build a DirectoryData object, then
    call each registered visitor with that object.

    skip_dirs: list of directory names or partial paths to skip
    skip_patterns: list of file patterns (e.g. '*.md') to skip
    source_patterns: which file patterns are considered "source files"
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

        # Skip if directory is in skip_dirs or is .git, etc.
        # This uses partial matching. Adjust as needed.
        parts = dir_path.parts
        if any(sd in parts for sd in skip_dirs) or ".git" in parts:
            # Prevent descending into this directory
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

            # Skip if matches any skip pattern
            if any(fnmatch.fnmatch(filename, pattern) for pattern in skip_patterns):
                continue

            directory_data.all_files.append(file_path)

            # If it matches a source pattern, add to `source_files`
            if any(fnmatch.fnmatch(filename, sp) for sp in source_patterns):
                directory_data.source_files.append(file_path)

        # Call each visitor’s visit method
        for visitor in _visitors:
            visitor.visit(directory_data)

