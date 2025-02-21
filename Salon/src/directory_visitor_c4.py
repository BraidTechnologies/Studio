# directory_visitor_c4.py
"""
Visitor that looks for 'readme.md' (case-insensitive) and subdirectories' 
'readme.salon.md'. If found, it generates three mermaid-based C4 diagrams 
(C4Context, C4Container, C4Component).
"""

import os
from pathlib import Path
from typing import Optional

from CommonPy.src.request_utilities import request_timeout

from Salon.src.directory_visitor_base import DirectoryVisitor, DirectoryData
from Salon.src.chat_model_drivers import SummariseModelType, SalonModelDriver

class DirectoryVisitorForC4(DirectoryVisitor):
    """
    For each directory, if there's a 'readme.md' and at least one subdirectory
    with a 'readme.salon.md', we create 3 C4 diagrams in mermaid format:
    - C4Context.Salon.md
    - C4Container.Salon.md
    - C4Component.Salon.md
    """

    def __init__(self, model_type: str = "braid_api", priority: int = 2) -> None:
        """
        :param model_type: Summarisation model type: 'braid_api' or 'local_gemini'.
        :param priority: Processing priority (lower number = higher priority)
        """
        super().__init__(priority=priority)
        if model_type.lower() == "local_gemini":
            self.model_type_enum = SummariseModelType.LOCAL_GEMINI
        else:
            self.model_type_enum = SummariseModelType.BRAID_API

        self.driver = SalonModelDriver.create(self.model_type_enum)

    def summarise_code(self, text: str) -> Optional[str]:
        """
        Summarizes the given text using a 'C4Diagrammer' persona prompt
        or equivalent logic for local_gemini.
        """
        return self.driver.summarise(
            text,
            persona="C4Diagrammer",
            length_in_words=1000
        )

    def write_file_version(self, directory: Path, file_name: str, content: str) -> None:
        """
        Write a new file in `directory` with the given `file_name`. If the file already
        exists, increment a version number in the filename (e.g. myFile_v1.md).
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
        2. If so, read it; then look in subdirectories for readme.salon.md.
        3. If at least one subdirectory has readme.salon.md, generate 3 mermaid-based
           C4 diagrams (Context, Container, Component).
        """
        dir_path = directory_data.path
        all_filenames = [f.name for f in directory_data.all_files]

        # Find readme.md (case-insensitive)
        readme_file_name = next((f for f in all_filenames if f.lower() == 'readme.md'), None)
        if not readme_file_name:
            return  # No readme, do nothing

        # Read its content
        readme_file_path = dir_path / readme_file_name
        try:
            with open(readme_file_path, 'r', encoding='utf-8') as f:
                readme_text = f.read()
        except Exception as e:
            print(f"Unable to read {readme_file_path}: {e}")
            return

        # Check subdirectories for readme.salon.md
        have_readme_and_salon_files = False
        for sub_d in dir_path.iterdir():
            if sub_d.is_dir() and sub_d.name.lower() != 'test':
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

        print(f"Found 'readme.md' + 'ReadMe.Salon.md' in subdirectories of: {dir_path}")

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
        print(f"Context Summary: {summary}")
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
        print(f"Container Summary: {summary}")
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
        print(f"Component Summary: {summary}")
        if summary:
            self.write_file_version(dir_path, 'C4Component.Salon.md', summary)
