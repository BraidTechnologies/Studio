# file_handler.py
import os
from pathlib import Path
import re

class FileHandler:
    """
    Handles file reading, writing, and versioning.
    """

    def __init__(self, encoding='utf-8'):
        self.encoding = encoding
        # Regex to capture a filename stem ending with `_vN`, e.g., 'myFile_v2'
        self.version_pattern = re.compile(r'(.*)_v(\d+)$')

    def read_file(self, file_path: Path) -> str:
        """
        Reads a file and returns its content.
        """
        try:
            with open(file_path, 'r', encoding=self.encoding) as f:
                return f.read().rstrip()
        except IOError as e:
            print(f"Error reading {file_path}: {e}")
            return None

    def write_file_version(self, directory: Path, file_name: str, content: str) -> Path:
        """
        Writes a new file in `directory` with the given `file_name`. If the file already
        exists, increment the version number properly in the filename (e.g. 'myFile_v1.md',
        'myFile_v2.md', etc.). If the incoming file_name already has a version suffix,
        we start from that version instead. Returns the path to the written file.
        """

        # Initial path based on the requested file_name
        output_file = directory / file_name
        parent = output_file.parent
        stem = output_file.stem
        suffix = output_file.suffix

        # Attempt to parse out an existing version from the stem (e.g. 'myFile_v2' → ('myFile', 2))
        match = self.version_pattern.match(stem)
        if match:
            base_stem = match.group(1)
            version = int(match.group(2))
        else:
            base_stem = stem
            version = 0  # We'll treat 0 as "no version yet"

        # We build a candidate filename. If version == 0, try the un-versioned file first.
        if version == 0:
            candidate = parent / f"{base_stem}{suffix}"
        else:
            candidate = parent / f"{base_stem}_v{version}{suffix}"

        # If that candidate exists, increment until we find a free name
        while candidate.exists():
            version += 1
            candidate = parent / f"{base_stem}_v{version}{suffix}"

        # Finally, write to the candidate path
        try:
            with open(candidate, 'w', encoding=self.encoding) as f:
                f.write(content)
            print(f"Wrote to {candidate}")
            return candidate
        except IOError as e:
            print(f"Error writing to {candidate}: {e}")
            return None

    def write_file(self, directory: Path, file_name: str, content: str) -> Path:
        """
        Write or overwrite a file without versioning.
        
        Args:
            directory: The directory where the file should be written
            file_name: The name of the file to write
            content: The content to write to the file
            
        Returns:
            Path to the written file or None if an error occurred
        """
        file_path = directory / file_name
        try:
            with open(file_path, 'w', encoding=self.encoding) as f:
                f.write(content)
            print(f"Wrote to {file_path}")
            return file_path
        except IOError as e:
            print(f"Error writing to {file_path}: {e}")
            return None
