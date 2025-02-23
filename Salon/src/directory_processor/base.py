# directory_visitor_base.py
"""
 DirectoryProcessor: Abstract base class for directory-processing visitors
"""

from pathlib import Path
from typing import List
from ..types.directory_data import DirectoryData
class DirectoryProcessor:
    """
    Base class for any visitor that wants to process a directory.
    Subclasses should implement 'visit'.
    """
    def __init__(self, priority: int = 0) -> None:
        self.priority = priority

    def visit(self, directory_data: DirectoryData) -> None:
        """
        Process the given directory data. Must be implemented by subclasses.
        """
        raise NotImplementedError("Subclasses must implement 'visit' method")
