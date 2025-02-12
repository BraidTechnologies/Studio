'''
Type definitions for the enriched query API.

This module contains the interface definitions used by the enriched query API endpoints.
It defines the data structures for chunks, queries, and conversation elements used in
semantic search and retrieval operations.

Key types:
- IEnrichedChunk: Represents a text chunk with its embedding and metadata
- IChunkQuerySpec: Base specification for chunk queries
- IModelConversationElement: Represents an element in a conversation history
- IEnrichedQueryRequest: Request structure for enriched queries
'''

# Generated by ts2python version 0.7.5 on 2024-11-05 13:56:28.905808
# pylint: disable=invalid-name
# pylint: disable=missing-docstring


import sys
if sys.version_info >= (3, 9, 0):
    from typing import List
else:
    from typing import List


class IEnrichedChunkSummary():
    url: str
    text: str
    summary: str

    def __init__(self, other=None):

        if other:
            self.url = other.url
            self.text = other.text
            self.summary = other.summary
        else:
            self.url = None
            self.text = None
            self.summary = None


class IEnrichedChunk(IEnrichedChunkSummary):
    id: str
    embedding: List[float]

    def __init__(self, other=None):
        
        super().__init__(other)

        if other:
            self.id = other.id
            self.embedding = other.embedding
        else:
            self.id = None
            self.embedding = None


class IRelevantEnrichedChunk():
    chunk: IEnrichedChunkSummary
    relevance: float
    
    def __init__(self, other=None):
        if other:
            self.chunk = other.chunk
            self.relevance = other.relevance
        else:
            self.chunk = None
            self.relevance = None


class IChunkQuerySpec():
    repositoryId: str
    maxCount: float
    similarityThreshold: float


class IChunkQueryRelevantToUrlSpec(IChunkQuerySpec):
    url: str


class IChunkQueryRelevantToSummarySpec(IChunkQuerySpec):
    summary: str


class IModelConversationElement ():
    role: str
    content: str


class IEnrichedQueryRequest():
    repositoryId: str
    similarityThreshold: float
    maxCount: float
    history: List['IModelConversationElement']
    question: str
    wordTarget: float

class IEnrichedResponse():
    answer: str
    chunks: List[IRelevantEnrichedChunk]

    def __init__(self, other=None):
        if other:
            self.chunks = other.chunks
            self.answer = other.answer
        else:
            self.chunks = None
            self.answer = None

class IGenerateQuestionRequest():
    summary: str
    wordTarget: float


class IQuestionGenerationResponse():
    question: str

    def __init__(self, other=None):
        if other:
            self.question = other.answer
        else:
            self.question = None
