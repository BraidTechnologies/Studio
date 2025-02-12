# DirectoryVisitor.py

import os
import fnmatch
import requests
from pathlib import Path
import nltk
from nltk.tokenize import word_tokenize
from datetime import datetime
import sys
from typing import List, Optional

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
root_dir = os.path.dirname(parent_dir)
sys.path.insert(0, root_dir)

from CommonPy.src.request_utilities import request_timeout

nltk.download('punkt', quiet=True)

BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ.get('BRAID_SESSION_KEY', '')   # Fall back to empty if not set

class DirectoryData:
    """
    Holds metadata about a directory, such as whether it has a readme,
    what files it contains, etc.
    """
    def __init__(self, path: Path):
        self.path: Path = path
        self.has_readme: bool = False
        self.source_files: List[Path] = []
        self.all_files: List[Path] = []  # All files in the directory
        self.summary_needed: bool = False   # Whether this directory needs a summary

class DirectoryVisitor:
    """
    Base class for any visitor that wants to process a directory.
    """
    def visit(self, directory_data: DirectoryData) -> None:
        raise NotImplementedError("Subclasses must implement 'visit' method")


class DirectoryVisitorForNotebookLM(DirectoryVisitor):
    """
    This visitor concatenates file contents (excluding any skip conditions)
    until reaching a max word limit, then writes the output to a file.
    """
    def __init__(self, max_words: int = 200000, output_dir: Optional[Path] = None):
        self.max_words: int = max_words
        self.output_dir: Path = output_dir or Path('.')
        self.content: str = ""
        self.current_word_count: int = 0
        self.file_counter: int = 1
        self.common_files: set = set()

    def count_words(self, text: str) -> int:
        """Count the number of words in a given text."""
        return len(word_tokenize(text))

    def save_current_content(self) -> None:
        """Save the current content to a file if it is not empty."""
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
        """Adds a text block for a single file, with a 40-char separator."""
        separator = '*' * 40
        block = f"{separator}\n{relative_path}\n{separator}\n{file_content}\n{separator}\n"
        block_word_count = self.count_words(block)

        # Check if adding this block would exceed limit
        if self.current_word_count + block_word_count > self.max_words:
            self.save_current_content()

        if self.content:
            self.content += "\n"    # add a blank line to separate from previous block
        self.content += block
        self.current_word_count += block_word_count

    def visit(self, directory_data: DirectoryData) -> None:
        """
        Called for each directory. We can process all_files or source_files.
        Here we just demonstrate reading all_files.
        """
        for file_path in directory_data.all_files:
            relative_path = file_path.relative_to(directory_data.path.parent)

            # Example check for duplicates if it's in "common_dir"
            if "common_dir" in file_path.parts:
                if file_path.name in self.common_files:
                    print(f"Skipping duplicate common file: {file_path}")
                    continue
                else:
                    self.common_files.add(file_path.name)

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read().rstrip()
                self.add_file_block(str(relative_path), content)
            except (UnicodeDecodeError, IOError) as e:
                print(f"Skipping {file_path}: {str(e)}")

        # You can optionally flush after each directory:
        # self.save_current_content()


class DirectoryVisitorForReadme(DirectoryVisitor):
    """
    Example visitor from 'repo_to_text.py': if any source file is newer than 'ReadMe.Salon.md',
    re-summarize those source files.
    """
    SUMMARY_FILENAME = 'ReadMe.Salon.md'

    def __init__(self) -> None:
        pass

    def summarise_code(self, source: str) -> Optional[str]:
        """
        Summarize source code text using an external API endpoint.
        """
        if not SESSION_KEY:
            return "No session key set; cannot summarize."

        url = f"{BASE_URL}/Summarize?session={SESSION_KEY}"
        payload = {
            'persona': 'CodeSummariser',
            'text': source,
            'lengthInWords': 100
        }
        wrapped = {'request': payload}

        try:
            response = requests.post(url, json=wrapped, timeout=request_timeout)
            if response.status_code == 200:
                data = response.json()
                if 'summary' in data:
                    return data['summary']
        except Exception as e:
            print(f"Error during summarise_code: {e}")
            return None

        return None

    def visit(self, directory_data: DirectoryData) -> None:
        if not directory_data.source_files:
            return

        readme_path = directory_data.path / self.SUMMARY_FILENAME
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

        new_readme = []
        for src_file in directory_data.source_files:
            try:
                with open(src_file, 'r', encoding='utf-8') as f:
                    code = f.read().rstrip()
                if len(code) > 250:
                    summary = self.summarise_code(code)
                    if summary:
                        new_readme.append(f"**{src_file.name}**\n\n{summary}\n")
            except Exception as e:
                print(f"Failed to summarize {src_file}: {e}")

        if new_readme:
            with open(readme_path, 'w', encoding='utf-8') as f:
                f.write("\n".join(new_readme))
            print(f"Created/Updated {readme_path}")


class DirectoryVisitorForC4(DirectoryVisitor):
    """
    A visitor that replicates the logic from 'RepoToC4.process_repo()'.
    For each directory, we look for a 'readme.md' (case-insensitive), then
    look in its subdirectories for 'readme.salon.md'. If found, we generate
    3 mermaid-based C4 diagrams.
    """

    def summarise_code(self, source: str) -> Optional[str]:
        """
        Summarizes the given source using an external C4Diagrammer persona.
        """
        if not SESSION_KEY:
            print("No BRAID_SESSION_KEY found in environment; cannot call summarise endpoint.")
            return None

        url = f"{BASE_URL}/Summarize?session={SESSION_KEY}"
        payload = {
            'persona': 'C4Diagrammer',
            'text': source,
            'lengthInWords': 1000
        }
        wrapped = {'request': payload}

        try:
            # Using a longer timeout factor due to possible large text
            response = requests.post(url, json=wrapped, timeout=request_timeout * 3)
            if response.status_code == 200:
                data = response.json()
                if 'summary' in data:
                    return data['summary']
        except Exception as e:
            print(f"Error during summarise_code: {e}, continuing.")

        return None

    def write_file_version(self, directory: Path, file_name: str, content: str) -> None:
        """
        Write a new file in `directory` with the given `file_name`. If the file already
        exists, increment a version number in the filename (e.g. myFile_v1.md, myFile_v2.md).
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

            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Wrote diagram to {output_file}")
        except IOError as e:
            print(f"Error writing to {output_file}: {e}")

    def visit(self, directory_data: DirectoryData) -> None:
        """
        For the current directory:
        1. Check if there's a readme.md (case-insensitive).
        2. If so, gather its text, then check each subdirectory for a readme.salon.md (case-insensitive).
        3. If both readme.md and readme.salon.md exist, generate the three C4 diagrams in mermaid format.
        """
        dir_path = directory_data.path
        all_filenames = [f.name for f in directory_data.all_files]

        # Find readme.md (case-insensitive)
        readme_file_name = next((f for f in all_filenames if f.lower() == 'readme.md'), None)
        if not readme_file_name:
            return  # No readme here, do nothing

        # Read its content
        readme_file_path = dir_path / readme_file_name
        try:
            with open(readme_file_path, 'r', encoding='utf-8') as f:
                readme_text = f.read()
        except Exception as e:
            print(f"Unable to read {readme_file_path}: {e}")
            return

        # Now check subdirectories for readme.salon.md
        have_readme_and_salon_files = False
        for sub_d in dir_path.iterdir():
            if sub_d.is_dir() and sub_d.name.lower() != 'test':
                # Look for readme.salon.md in this subdirectory
                try:
                    for f in sub_d.iterdir():
                        if f.is_file() and f.name.lower() == 'readme.salon.md':
                            have_readme_and_salon_files = True
                            with open(f, 'r', encoding='utf-8') as sf:
                                readme_salon_text = sf.read()
                            readme_text += "\n\n" + readme_salon_text
                except Exception as e2:
                    print(f"Error scanning subdirectory {sub_d}: {e2}")

        if not have_readme_and_salon_files:
            return

        print(f"Found 'readme.md' and 'ReadMe.Salon.Md' in subdirectories of: {dir_path}")

        # Generate the 3 diagrams:
        # 1. C4Context
        prompt_context = (
            "Please generate a C4Context diagram in mermaid format from the following "
            "description of a software system. Include the User. Only generate mermaid content. "
            "Group components with container boundaries if possible, but pay attention to syntax - "
            "a small diagram that is syntactically correct is better than a large diagram with errors.\n\n"
            + readme_text
        )
        summary = self.summarise_code(prompt_context)
        if summary:
            self.write_file_version(dir_path, 'C4Context.Salon.md', summary)

        # 2. C4Container
        prompt_container = (
            "Please generate a C4Container diagram in mermaid format from the following "
            "description of a software system. Only generate mermaid content. Group components with "
            "container boundaries if possible, but pay attention to syntax - "
            "a small diagram that is syntactically correct is better than a large diagram with errors.\n\n"
            + readme_text
        )
        summary = self.summarise_code(prompt_container)
        if summary:
            self.write_file_version(dir_path, 'C4Container.Salon.md', summary)

        # 3. C4Component
        prompt_component = (
            "Please generate a C4Component diagram in mermaid format from the following "
            "description of a software system. Only generate mermaid content. Group components with "
            "container boundaries if possible, but pay attention to syntax - "
            "a small diagram that is syntactically correct is better than a large diagram with errors.\n\n"
            + readme_text
        )
        summary = self.summarise_code(prompt_component)
        if summary:
            self.write_file_version(dir_path, 'C4Component.Salon.md', summary)
