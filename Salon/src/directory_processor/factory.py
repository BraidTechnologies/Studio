# visitors_factory.py
"""
Factory methods to create sets of DirectoryProcessor objects
for various workflows, without hardcoding them in main scripts.
"""

from pathlib import Path
from typing import List

from .base import DirectoryProcessor
from .code_aggregator import CodeAggregator
from .repo_readme_generator import ReadmeGenerator
from .c4_generator import C4Generator

def getProcessorsRepoToText(model_type: str, max_words: int, output_dir: Path) -> List[DirectoryProcessor]:
    """
    Return a list of DirectoryProcessor instances for the 'repo_to_text' workflow,
    sorted by priority (lower number = higher priority).
    """
    processors = [
        ReadmeGenerator(model_type=model_type, priority=1),
        C4Generator(model_type=model_type, priority=2),
        CodeAggregator(max_words=max_words, output_dir=output_dir, priority=3)
    ]
    return sorted(processors, key=lambda x: x.priority)


def getProcessorsRepoToC4(model_type: str) -> List[DirectoryProcessor]:
    """
    Return a list of DirectoryProcessor instances for the 'repo_to_c4' workflow.
    """
    processors = [
        ReadmeGenerator(model_type=model_type, priority=1),
        C4Generator(model_type=model_type, priority=2)
    ]
    return sorted(processors, key=lambda x: x.priority)
