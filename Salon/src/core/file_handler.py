# file_handler.py
import os
from pathlib import Path

class FileHandler:
    """
    Handles file reading, writing, and versioning.
    """

    def __init__(self, encoding='utf-8'):
        self.encoding = encoding

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
        exists, increment a version number in the filename (e.g. myFile_v1.md).
        Returns the path to the written file.
        """
        output_file = directory / file_name
        try:
            written = False
            version = 1
            while output_file.exists() and not written:
                parent = output_file.parent
                stem = output_file.stem
                suffix = output_file.suffix
                output_file = parent / f"{stem}_v{version}{suffix}"
                version += 1

            with open(output_file, 'w', encoding=self.encoding) as f:
                f.write(content)
            print(f"Wrote to {output_file}")
            return output_file
        except IOError as e:
            print(f"Error writing to {output_file}: {e}")
            return None