"""
OpenAI text chunking module.

This module provides functionality for chunking text into smaller pieces that fit within
OpenAI model context windows. It includes classes for tokenization and text chunking
specifically designed for OpenAI's token limits and embedding requirements.

The module contains:
- Tokenizer: Handles GPT-4 compatible tokenization using tiktoken
- OpenAITextChunker: Implements text chunking with configurable sizes and overlap
"""

from typing import Optional
from dataclasses import dataclass

from src.model_driver_base import TextChunker, ModelProvider, Model

import tiktoken

class Tokenizer:
    """
    Tokenizer class for GPT-4 compatible tokenization using tiktoken.
    """
    def __init__(self):
        # Initialize with GPT-4 encoding
        self.encoding = tiktoken.get_encoding("cl100k_base")

    def estimate_token_count(self, text: str) -> int:
        """
        Estimates the number of tokens in the given text.

        Args:
            text: The text to estimate tokens for
            
        Returns:
            The estimated number of tokens
        """
        return len(self.encoding.encode(text))

    def chunk_text(self, text: str, chunk_size: int) -> list[str]:
        """
        Splits text into chunks based on token count.

        Args:
            text: The text to split into chunks
            chunk_size: Maximum tokens per chunk
            
        Returns:
            List of strings containing chunked text
        """
        tokens = self.encoding.encode(text)
        chunks = []
        
        current_chunk = []
        current_size = 0
        
        for token in tokens:
            if current_size >= chunk_size:
                # Convert tokens back to text and store chunk
                chunk_text = self.encoding.decode(current_chunk)
                chunks.append(chunk_text)
                current_chunk = []
                current_size = 0
            
            current_chunk.append(token)
            current_size += 1
            
        # Handle remaining tokens
        if current_chunk:
            chunk_text = self.encoding.decode(current_chunk)
            chunks.append(chunk_text)
            
        return chunks

# Create global tokenizer instance
tokenizer = Tokenizer()

@dataclass
class OpenAiTextChunkerInit:
    """
    Initialization parameters for OpenAI text chunking models.
    Contains model configuration settings like chunk sizes and buffer sizes.
    """
    driven_model_provider: ModelProvider
    driven_model_type: Model
    default_chunk_size: int
    maximum_chunk_size: int
    embedding_chunk_size: int
    default_chunk_size_with_buffer: int
    maximum_chunk_size_with_buffer: int
    embedding_chunk_size_with_buffer: int
    implements_model: Model

class OpenAiGpt4oMiniTextChunkerInit(OpenAiTextChunkerInit):
    """
    Initialization parameters for OpenAI text chunking models.
    Contains model configuration settings like chunk sizes and buffer sizes.
    """
    def __init__(self):
        super().__init__(
            driven_model_provider=ModelProvider.OPEN_AI,
            driven_model_type=Model.SMALL,
            default_chunk_size=8192,
            maximum_chunk_size=65536,
            embedding_chunk_size=8191,
            default_chunk_size_with_buffer=8192 - 256,
            embedding_chunk_size_with_buffer=8191 - 256,
            maximum_chunk_size_with_buffer=65536 - 256,
            implements_model=Model.SMALL
        )

class OpenAiGpt4oTextChunkerInit(OpenAiTextChunkerInit):
    """
    Initialization parameters for OpenAI text chunking models.
    Contains model configuration settings like chunk sizes and buffer sizes.
    """    
    def __init__(self):
        super().__init__(
            driven_model_provider=ModelProvider.OPEN_AI,
            driven_model_type=Model.LARGE,
            default_chunk_size=8192,
            maximum_chunk_size=65536,
            embedding_chunk_size=8191,
            default_chunk_size_with_buffer=8192 - 256,
            embedding_chunk_size_with_buffer=8191 - 256,
            maximum_chunk_size_with_buffer=65536 - 256,
            implements_model=Model.LARGE
        )

class OpenAiO1TextChunkerInit(OpenAiTextChunkerInit):
    """
    Initialization parameters for OpenAI text chunking models.
    Contains model configuration settings like chunk sizes and buffer sizes.
    """    
    def __init__(self):
        super().__init__(
            driven_model_provider=ModelProvider.OPEN_AI,
            driven_model_type=Model.REASONING,
            default_chunk_size=8192,
            maximum_chunk_size=65536,
            embedding_chunk_size=8191,
            default_chunk_size_with_buffer=8192 - 256,
            embedding_chunk_size_with_buffer=8191 - 256,
            maximum_chunk_size_with_buffer=65536 - 256,
            implements_model=Model.REASONING
        )

class OpenAITextChunker(TextChunker):
    """
    GPT4 class implementing TextChunker interface.
    Represents a model with specific deployment settings and context window sizes.
    """
    def __init__(self, params: OpenAiTextChunkerInit):
        super().__init__(ModelProvider.OPEN_AI, params.driven_model_type)
        self.default_chunk_size = params.default_chunk_size
        self.maximum_chunk_size = params.maximum_chunk_size
        self.embedding_chunk_size = params.embedding_chunk_size
        self.default_chunk_size_with_buffer = params.default_chunk_size_with_buffer
        self.embedding_chunk_size_with_buffer = params.embedding_chunk_size_with_buffer
        self.maximum_chunk_size_with_buffer = params.maximum_chunk_size_with_buffer
        self.implements_model = params.implements_model

    def fits_in_default_chunk(self, text: str) -> bool:
        """
        Checks if the given text fits within the context window size with buffer.
        
        Args:
            text: The text to check if it fits within the context window size with buffer.
        Returns:
            True if the text fits within the context window size with buffer, false otherwise.
        """
        estimated_tokens = tokenizer.estimate_token_count(text)
        return estimated_tokens < self.default_chunk_size_with_buffer

    def fits_in_maximum_chunk(self, text: str) -> bool:
        """
        Checks if the given text fits within the maximum context window size with buffer.
        
        Args:
            text: The text to check if it fits within the context window size with buffer.
        Returns:
            True if the text fits within the context window size with buffer, false otherwise.
        """
        estimated_tokens = tokenizer.estimate_token_count(text)
        return estimated_tokens < self.maximum_chunk_size_with_buffer

    def fits_in_embedding_chunk(self, text: str) -> bool:
        """
        Checks if the given text fits within the embedding context window size with buffer.
        
        Args:
            text: The text to check if it fits within the context window size with buffer.
        Returns:
            True if the text fits within the context window size with buffer, false otherwise.
        """
        estimated_tokens = tokenizer.estimate_token_count(text)
        return estimated_tokens < self.embedding_chunk_size_with_buffer

    def chunk_text(self, text: str, chunk_size: Optional[int] = None, overlap_words: Optional[int] = None) -> list[str]:
        """
        Splits the input text into chunks based on the specified overlap of words.
        
        Args:
            text: The text to be chunked.
            chunk_size: Optional size of chunks
            overlap_words: The number of overlapping words between consecutive chunks. If undefined, we chunk with no overlap.
        Returns:
            An array of strings representing the chunked text.
        """
        effective_chunk_size = min(self.default_chunk_size_with_buffer, chunk_size) if chunk_size else self.default_chunk_size_with_buffer

        if overlap_words:
            if overlap_words > effective_chunk_size:
                raise ValueError("Overlap window size cannot be bigger than chunk size")

            # If the users requests overlapping chunks, we divide the text into pieces the size of the overlap, then glue them back
            # together until we fill a buffer.
            chunked = tokenizer.chunk_text(text, overlap_words * 2)
            chunks = []

            working_buffer_text = ""
            working_buffer_tokens = 0
            last_chunk_text = ""
            last_chunk_tokens = 0

            for i, chunk in enumerate(chunked):
                this_chunk_text = chunk
                this_chunk_tokens = tokenizer.estimate_token_count(this_chunk_text)

                if working_buffer_tokens + this_chunk_tokens < effective_chunk_size:
                    # If we are within buffer size, we just accumulate
                    working_buffer_text += this_chunk_text
                    working_buffer_tokens += this_chunk_tokens
                else:
                    # If we are outside buffer, we save the current chunk and build the start of the next one
                    chunks.append(working_buffer_text)
                    working_buffer_text = last_chunk_text + this_chunk_text
                    working_buffer_tokens = last_chunk_tokens + this_chunk_tokens

                # If we have reached the last chunk, we have to save it.
                if i == len(chunked) - 1:
                    chunks.append(working_buffer_text)

                last_chunk_tokens = this_chunk_tokens
                last_chunk_text = this_chunk_text

            return chunks
        else:
            chunked = tokenizer.chunk_text(text, effective_chunk_size)
            return chunked

    def estimate_tokens(self, text: str) -> int:
        """
        Estimates the number of tokens in the provided text using the tokenizer.
        
        Args:
            text: The text for which to estimate the number of tokens.
        Returns:
            The estimated number of tokens in the text.
        """
        return tokenizer.estimate_token_count(text)