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
    

"""
Processes a single DirectoryData object and its subdirectories,
visiting each directory using the provided processors.
each processor returns a Path to a file that is added to the directory.source_files list
"""
def process_directory(directory, processors) -> Path:
    """
    Processes a single DirectoryData object and its subdirectories,
    visiting each directory using the provided processors.
    """
    # Recursively walk down subdirectories
    for sub_directory in directory.sub_directories:
        child_source_file:Path = process_directory(sub_directory, processors)
        if child_source_file:
            directory.source_files.append(child_source_file)
    
    # Process the directory
    for p in processors:
        output_visit = p.visit(directory)
        if output_visit:
            return output_visit
    return None

