# visitors_factory.py
"""
Factory methods to create sets of DirectoryVisitor objects
for various workflows, without hardcoding them in main scripts.
"""

from pathlib import Path
from typing import List

from .directory_visitor_base import DirectoryVisitor
from .directory_visitor_notebook_lm import DirectoryVisitorForNotebookLM
from .directory_visitor_readme import DirectoryVisitorForReadme
from .directory_visitor_c4 import DirectoryVisitorForC4

def get_visitors_for_text(model_type: str, max_words: int, output_dir: Path) -> List[DirectoryVisitor]:
    """
    Return a list of DirectoryVisitor instances for the 'repo_to_text' workflow,
    sorted by priority (lower number = higher priority).
    """
    visitors = [
        DirectoryVisitorForReadme(model_type=model_type, priority=1),
        DirectoryVisitorForC4(model_type=model_type, priority=2),
        DirectoryVisitorForNotebookLM(max_words=max_words, output_dir=output_dir, priority=3)
    ]
    return sorted(visitors, key=lambda x: x.priority)

def get_visitors_for_c4(model_type: str) -> List[DirectoryVisitor]:
    """
    Return a list of DirectoryVisitor instances for the 'repo_to_c4' workflow.
    """
    visitors = [
        DirectoryVisitorForReadme(model_type=model_type, priority=1),
        DirectoryVisitorForC4(model_type=model_type, priority=2)
    ]
    return sorted(visitors, key=lambda x: x.priority)
