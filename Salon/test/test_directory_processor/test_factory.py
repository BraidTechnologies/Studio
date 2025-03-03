import pytest
from pathlib import Path
from Salon.src.directory_processor.factory import getProcessorsRepoToText, getProcessorsRepoToC4
from Salon.src.directory_processor.repo_readme_generator import ReadmeGenerator
from Salon.src.directory_processor.c4_generator import C4Generator
from Salon.src.directory_processor.code_aggregator import CodeAggregator

def test_getProcessorsRepoToText():
    model_type = "braid_api"
    max_words = 200000
    output_dir = Path("./output")
    
    processors = getProcessorsRepoToText(model_type, max_words, output_dir)
    
    assert len(processors) == 3
    assert isinstance(processors[0], ReadmeGenerator)
    assert isinstance(processors[1], C4Generator)
    assert isinstance(processors[2], CodeAggregator)
    
    assert processors[0].priority == 1
    assert processors[1].priority == 2
    assert processors[2].priority == 3

def test_getProcessorsRepoToC4():
    model_type = "braid_api"
    
    processors = getProcessorsRepoToC4(model_type)
    
    assert len(processors) == 2
    assert isinstance(processors[0], ReadmeGenerator)
    assert isinstance(processors[1], C4Generator)
    
    assert processors[0].priority == 1
    assert processors[1].priority == 2

if __name__ == "__main__":
    pytest.main()