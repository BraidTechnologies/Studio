# DirectoryVisitor.py

import os
import fnmatch
from pathlib import Path
import requests
import nltk
from nltk.tokenize import word_tokenize
from datetime import datetime
import sys

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(parent_dir)  # Go up one more level to find CommonPy
sys.path.insert(0, root_dir)

from CommonPy.src.request_utilities import request_timeout

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)

SUMMARY_FILENAME = 'ReadMe.Salon.md'
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ.get('BRAID_SESSION_KEY', '')  # Fall back to empty if not set

class DirectoryData:
    """
    Holds metadata about a directory, such as whether it has a readme,
    what files it contains, etc.
    """
    def __init__(self, path: Path):
        self.path = path
        self.has_readme = False
        self.source_files = []
        self.all_files = []   # Optionally store all files if you need them
        self.summary_needed = False  # Flag if we should re-summarize

class DirectoryVisitor:
    """
    Base class for any visitor that wants to process a directory.
    """
    def visit(self, directory_data: DirectoryData):
        raise NotImplementedError("Subclasses must implement 'visit' method")


class DirectoryVisitorForNotebookLM(DirectoryVisitor):
    """
    This visitor concatenates file contents (excluding any skip conditions)
    until reaching a max word limit, then writes the output to a file.
    """

    def __init__(self, max_words=200000, output_dir: Path = None):
        self.max_words = max_words
        self.output_dir = output_dir or Path('.')
        self.content = ""
        self.current_word_count = 0
        self.file_counter = 1
        # We can keep track of "common file" dedup if needed
        self.common_files = set()

    def count_words(self, text: str) -> int:
        return len(word_tokenize(text))

    def save_current_content(self):
        if not self.content.strip():
            return
        output_file = self.output_dir / f'repo_content_{self.file_counter}.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(self.content.rstrip() + "\n")
        print(f"Created {output_file} with {self.current_word_count} words")
        self.file_counter += 1
        self.content = ""
        self.current_word_count = 0

    def add_file_block(self, relative_path: str, file_content: str):
        """Adds the text block for a single file, with a 40-char separator."""
        separator = '*' * 40
        block = f"{separator}\n{relative_path}\n{separator}\n{file_content}\n{separator}\n"
        block_word_count = self.count_words(block)

        # Check if adding this block would exceed limit
        if self.current_word_count + block_word_count > self.max_words:
            self.save_current_content()

        if self.content:  # add a blank line to separate from previous block
            self.content += "\n"
        self.content += block
        self.current_word_count += block_word_count

    def visit(self, directory_data: DirectoryData):
        """
        Called for each directory. We can process all files or `source_files`
        depending on your design. For illustration, we'll process all_files.
        """
        for file_path in directory_data.all_files:
            relative_path = file_path.relative_to(directory_data.path.parent)
            # Example check for duplicates if in "common" directories
            # if "common_dir" in file_path.parts:
            #     if file_path.name in self.common_files:
            #         print(f"Skipping duplicate common file: {file_path}")
            #         continue
            #     else:
            #         self.common_files.add(file_path.name)

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read().rstrip()
                self.add_file_block(str(relative_path), content)
            except (UnicodeDecodeError, IOError) as e:
                print(f"Skipping {file_path}: {str(e)}")

        # If there's any leftover content for this directory, we keep it
        # until the next directory is visited or until the very end.
        # It's up to you whether to flush after each directory:
        # self.save_current_content()
        # For this example, let's do nothing. We'll rely on a "final flush"
        # after the entire walk is done.


class DirectoryVisitorForReadme(DirectoryVisitor):
    """
    Looks at timestamps in the directory's source files and compares
    to the existing `ReadMe.Salon.md`. If source files are newer, it
    will re-summarize.
    """

    def __init__(self):
        # you can store any config or state needed for summarization
        pass

    def summarise_code(self, source: str) -> str:
        """
        Summarize source code text using an external API endpoint.
        """
        if not SESSION_KEY:
            return "No session key set, cannot summarize."

        url = f"{BASE_URL}/Summarize?session={SESSION_KEY}"
        payload = {
            'persona': 'CodeSummariser',
            'text': source,
            'lengthInWords': 100
        }
        wrapped = {'request': payload}

        response = requests.post(url, json=wrapped, timeout=request_timeout)
        if response.status_code == 200:
            data = response.json()
            if 'summary' in data:
                return data['summary']
        return None

    def visit(self, directory_data: DirectoryData):
        """
        If any source file is newer than the readme, or there's no readme yet,
        generate a new readme by summarizing all source files.
        """

        # If no source files, do nothing
        if not directory_data.source_files:
            return

        readme_path = directory_data.path / SUMMARY_FILENAME
        readme_timestamp = 0
        if readme_path.exists():
            readme_timestamp = os.path.getmtime(readme_path)

        need_resummarize = (not directory_data.has_readme)
        for src_file in directory_data.source_files:
            if os.path.getmtime(src_file) > readme_timestamp:
                need_resummarize = True
                break

        if not need_resummarize:
            return

        # Summaries for each source file
        new_readme = []
        for src_file in directory_data.source_files:
            try:
                with open(src_file, 'r', encoding='utf-8') as f:
                    code = f.read().rstrip()
                if len(code) > 250:  # If the file is big, call summarization
                    summary = self.summarise_code(code)
                    if summary:
                        new_readme.append(f"**{src_file.name}**\n\n{summary}\n")
            except Exception as e:
                print(f"Failed to summarize {src_file}: {e}")

        # Write out the updated readme if there's any summary content
        if new_readme:
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write("\n".join(new_readme))
            print(f"Created/Updated {readme_path}")
