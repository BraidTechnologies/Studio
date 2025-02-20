# directory_visitor_base.py
"""
Contains both:
- DirectoryData: Holds metadata about a directory
- DirectoryVisitor: Abstract base class for directory-processing visitors
"""

from pathlib import Path
from typing import List

class DirectoryData:
    """
    Holds metadata about a directory, such as whether it has a ReadMe.Salon.md,
    which files it contains, etc.
    """
    def __init__(self, path: Path) -> None:
        self.path: Path = path
        self.has_readme: bool = False
        self.source_files: List[Path] = []
        self.all_files: List[Path] = []  # All files in the directory
        self.summary_needed: bool = False   # Whether this directory needs a summary

class DirectoryVisitor:
    """
    Base class for any visitor that wants to process a directory.
    Subclasses should implement 'visit'.
    """
    def visit(self, directory_data: DirectoryData) -> None:
        """
        Process the given directory data. Must be implemented by subclasses.
        """
        raise NotImplementedError("Subclasses must implement 'visit' method")
