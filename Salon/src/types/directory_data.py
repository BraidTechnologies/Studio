# directory_data.py
"""
Contains both:
- DirectoryData: Holds metadata about a directory
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
        self.sub_directories: List[DirectoryData] = []
