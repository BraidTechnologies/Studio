'''
Utility module for enriched query API testing.

This module provides helper functions for creating and manipulating test payloads
used in testing the enriched query API. 

'''


from CommonPy.src.enriched_query_api_types import IEnrichedQueryRequest


SAMPLE_HOW_LLMS_WORK_RESPONSE = (
    "LLMs use deep learning to generate human-like text. They are trained on vast "
    "amounts of text data. When given a prompt, they predict the next word based "
    "on patterns learned during training. This process repeats to generate "
    "coherent and contextually relevant text."
)
def valid_request_payload():
    '''
    Return a valid request payload. This function is used by both fixtures and test functions.
    '''
    shell = IEnrichedQueryRequest()
    shell.repositoryId = "Boxer"
    shell.similarityThreshold = 0.4
    shell.maxCount = 1
    shell.history = []
    shell.question = "What is an LLM?"
    shell.wordTarget = 50
    return shell