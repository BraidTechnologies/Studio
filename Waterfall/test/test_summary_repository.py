# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import pytest
import os
import shutil
import sys
import logging

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

from src.summary_repository_facade import SummaryRespositoryFacade

# Fixture to create a temporary directory for test output
@pytest.fixture
def test_output_dir(tmpdir):
    dir_path = tmpdir.mkdir("test_output_file")
    logger.info(f"Created temporary test output directory: {dir_path}")
    yield str(dir_path)
    # Clean up after the test
    logger.info(f"Cleaning up test output directory: {dir_path}")
    os.chdir ("..")    
    shutil.rmtree(str(dir_path))

def test_basic (test_output_dir):
    test_output_location = test_output_dir
    repository = SummaryRespositoryFacade (test_output_location)
    assert repository.output_location == test_output_location   

def test_with_output (test_output_dir):

    os.chdir (test_output_dir)
    test_path = 'pass_test.html'
    test_output_location = test_output_dir
    text = "Here is some text"

    repository = SummaryRespositoryFacade (test_output_location)  
    repository.save (test_path, text)
    exists = repository.exists (test_path)
    saved = repository.load (test_path)

    assert exists == True
    assert saved == text

def test_with_no_output (test_output_dir):

    os.chdir (test_output_dir)
    test_path = 'fail_test.html'
    test_output_location = test_output_dir
    text = "Here is some text"

    repository = SummaryRespositoryFacade (test_output_location)  
    exists = repository.exists (test_path)
    saved = repository.load (test_path)

    assert exists == False
    assert saved != text
