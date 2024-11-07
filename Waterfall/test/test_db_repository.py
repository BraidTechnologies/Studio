''' Tests for the DB API '''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import os
import sys
import logging

from src.db_repository import DbRespository

test_root = os.path.dirname(__file__)
parent= os.path.abspath(os.path.join(test_root, '..'))
src_dir = os.path.join(parent, 'src')
sys.path.extend([parent, src_dir])

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logger.setLevel(logging.ERROR)

def test_basic ():
    test_context = "TestContext"
    repository = DbRespository (test_context)
    assert repository.context_id == test_context 

def test_with_no_output ():

    test_path = 'fail_test.html'
    test_context = "TestContext"

    repository = DbRespository (test_context)  
    exists = repository.exists (test_path)
    #saved = repository.load (test_path, test_extention)

    assert not exists
    #assert saved != text
