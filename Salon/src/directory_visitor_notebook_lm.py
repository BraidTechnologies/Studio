# directory_visitor_notebook_lm.py
"""
Visitor that concatenates file contents into large text blocks until 
reaching a max word limit, then writes the output to a file.
"""

import os
from pathlib import Path
from typing import Optional, Set
import nltk
from nltk.tokenize import word_tokenize

from .directory_visitor_base import DirectoryVisitor, DirectoryData

nltk.download('punkt', quiet=True)

class DirectoryVisitorForNotebookLM(DirectoryVisitor):
    """
    Concatenates file contents until a max word limit is reached, 
    then saves them in a text file.
    """

    def __init__(self, max_words: int = 200000, output_dir: Optional[Path] = None, priority: int = 3) -> None:
        super().__init__(priority=priority)
        self.max_words: int = max_words
        self.output_dir: Path = output_dir or Path('.')
        self.content: str = ""
        self.current_word_count: int = 0
        self.file_counter: int = 1
        self.common_files: Set[str] = set()

    def count_words(self, text: str) -> int:
        """
        Count the number of words in the given text using NLTK.
        """
        return len(word_tokenize(text))

    def save_current_content(self) -> None:
        """
        Save the current content to a file if it's non-empty.
        """
        if not self.content.strip():
            return

        output_file = self.output_dir / f'repo_content_{self.file_counter}.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(self.content.rstrip() + "\n")

        print(f"Created {output_file} with {self.current_word_count} words")

        self.file_counter += 1
        self.content = ""
        self.current_word_count = 0

    def add_file_block(self, relative_path: str, file_content: str) -> None:
        """
        Adds a text block for a single file, with a 40-char separator,
        checking if it exceeds the max word limit before appending.
        """
        separator = '*' * 40
        block = (
            f"{separator}\n{relative_path}\n{separator}\n"
            f"{file_content}\n{separator}\n"
        )
        block_word_count = self.count_words(block)

        # Check if adding this block would exceed the limit
        if self.current_word_count + block_word_count > self.max_words:
            self.save_current_content()

        if self.content:
            self.content += "\n"  # Separate from previous block
        self.content += block
        self.current_word_count += block_word_count

    def visit(self, directory_data: DirectoryData) -> None:
        """
        Called for each directory. Accumulates file contents up to max_words,
        then writes them out.
        """
        for file_path in directory_data.all_files:
            try:
                # Use the directory's path as the base for relative paths
                relative_path = file_path.relative_to(directory_data.path)

                # Check for duplicates if it's in "common_dir"
                if any(part == "common_dir" for part in file_path.parts):
                    if file_path.name in self.common_files:
                        print(f"Skipping duplicate common file: {file_path}")
                        continue
                    self.common_files.add(file_path.name)

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read().rstrip()
                    self.add_file_block(str(relative_path), content)
                except (UnicodeDecodeError, IOError) as e:
                    print(f"Skipping {file_path}: {e}")
            except ValueError as e:
                # Handle case where relative_to fails
                print(f"Skipping {file_path}: {e}")

        # Make sure to save any remaining content
        if self.content.strip():
            self.save_current_content()
