# visitors_factory.py
"""
Factory methods to create sets of DirectoryVisitor objects
for various workflows, without hardcoding them in main scripts.
"""

from pathlib import Path
from typing import List

from directory_visitor_notebook_lm import DirectoryVisitorForNotebookLM
from directory_visitor_readme import DirectoryVisitorForReadme
from directory_visitor_c4 import DirectoryVisitorForC4

def get_visitors_for_text(model_type: str, max_words: int, output_dir: Path) -> List:
    """
    Return a list of DirectoryVisitor instances for the 'repo_to_text' workflow.
    """
    return [
        DirectoryVisitorForNotebookLM(max_words=max_words, output_dir=output_dir),
        DirectoryVisitorForReadme(model_type=model_type)
    ]

def get_visitors_for_c4(model_type: str) -> List:
    """
    Return a list of DirectoryVisitor instances for the 'repo_to_c4' workflow.
    """
    return [
        DirectoryVisitorForC4(model_type=model_type)
    ]
