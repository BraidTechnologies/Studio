'''
Type definitions for the Embed API, which handles text embedding operations.

This module contains interfaces for embedding requests and responses, defining the
contract between clients and the embedding service.

Key types:
- IEmbedRequest: Request structure for text embedding operations
- IEmbedResponse: Response containing the generated embedding vector

'''

# Generated by ts2python version 0.7.5 on 2024-11-05 13:56:28.905808
# pylint: disable=invalid-name
# pylint: disable=missing-docstring


class IEmbedRequest():
    persona: str
    text: str


class IEmbedResponse():
    embedding: list[float]

    def __init__(self, other=None):
        if other:
            self.embedding = other.embedding
        else:
            self.embedding = None
