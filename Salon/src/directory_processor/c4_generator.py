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

from .base import DirectoryProcessor
from ..types.directory_data import DirectoryData
from ..models.model_factory import create_model
from ..models.base import AIModel
from ..core.file_handler import FileHandler
from ..prompts.prompts import C4_DIAGRAMMER_PERSONA_INTRO, C4_CONTEXT_PROMPT, C4_CONTAINER_PROMPT,C4_COMPONENT_PROMPT

class C4Generator(DirectoryProcessor):
    """
    For each directory, if there's a 'readme.md' and at least one subdirectory
    with a 'readme.salon.md', we create 3 C4 diagrams in mermaid format:
    - C4Context.Salon.md
    - C4Container.Salon.md
    - C4Component.Salon.md
    """

    def __init__(self, model_type: str = "braid_api", priority: int = 2) -> None:
        super().__init__(priority=priority)
        self.driver: AIModel = create_model(model_type.lower())
        self.file_handler = FileHandler()  # Instantiate FileHandler

    def summarise_code(self, text: str) -> Optional[str]:
        """
        Summarizes the given text using a 'C4Diagrammer' persona prompt
        or equivalent logic for local_gemini.
        """
        return self.driver.generate_content(
            text,
            persona="C4Diagrammer",
            persona_intro=C4_DIAGRAMMER_PERSONA_INTRO,
            length_in_words=1000
        )

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
        readme_text = self.file_handler.read_file(readme_file_path) # Use FileHandler
        if not readme_text:
            return

        # Check subdirectories for readme.salon.md
        have_readme_and_salon_files = False
        for sub_d in dir_path.iterdir():
            if sub_d.is_dir() and sub_d.name.lower() != 'test':
                try:
                    for f in sub_d.iterdir():
                        if f.is_file() and f.name.lower() == 'readme.salon.md':
                            have_readme_and_salon_files = True
                            readme_salon_text = self.file_handler.read_file(f) # Use FileHandler
                            if readme_salon_text:
                                readme_text += "\n\n" + readme_salon_text
                except Exception as e2:
                    print(f"Error scanning subdirectory {sub_d}: {e2}")

        if not have_readme_and_salon_files:
            return

        print(f"Found 'readme.md' + 'ReadMe.Salon.md' in subdirectories of: {dir_path}")

        # Generate the 3 diagrams:

        # 1. C4Context
        prompt_context = (C4_CONTEXT_PROMPT + readme_text)
        summary = self.summarise_code(prompt_context)
        print(f"Context Summary: {summary}")
        if summary:
            self.file_handler.write_file_version(dir_path, 'C4Context.Salon.md', summary) # Use FileHandler

        # 2. C4Container
        prompt_container = (C4_CONTAINER_PROMPT + readme_text )
        summary = self.summarise_code(prompt_container)
        print(f"Container Summary: {summary}")
        if summary:
            self.file_handler.write_file_version(dir_path, 'C4Container.Salon.md', summary) # Use FileHandler

        # 3. C4Component
        prompt_component = (C4_COMPONENT_PROMPT + readme_text)
        summary = self.summarise_code(prompt_component)
        print(f"Component Summary: {summary}")
        if summary:
            self.file_handler.write_file_version(dir_path, 'C4Component.Salon.md', summary) # Use FileHandler
