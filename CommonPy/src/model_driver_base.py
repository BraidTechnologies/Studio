"""
Base module for model drivers and related types.

This module provides the core abstractions and types used by model drivers throughout the system.
It defines:
- ModelProvider: Enum of supported AI model providers (e.g. OpenAI)
- Model: Enum of supported model types and capabilities
- MessageRole: Enum of possible roles in chat conversations
- Message: Class representing a chat message with role and content

The types defined here are used by concrete model driver implementations to provide
a consistent interface across different providers and model types.
"""

from functools import total_ordering
from comparable_enum import EnumComparable


@total_ordering
class ModelProvider(EnumComparable):
    '''
    Enum defining supported model providers.

    This enum lists the AI model providers that can be used with the model driver.
    Each provider is represented by a string value that identifies it in the system.
    '''
    OPEN_AI = "OpenAi"


@total_ordering
class Model(EnumComparable):
    '''
    Enum defining supported model types.

    This enum lists the different types of AI models that can be used.
    Each type represents a different capability level or purpose.
    '''
    LARGE = "Large"
    SMALL = "Small"
    REASONING = "Reasoning"


@total_ordering
class MessageRole(EnumComparable):
    '''
    Enum defining the roles of messages in a chat conversation.

    This enum lists the possible roles that messages can have in a chat conversation.
    Each role is represented by a string value that identifies it in the system.
    '''
    ASSISTANT = "assistant"
    USER = "user"
    SYSTEM = "system"


class Message:
    '''
    Represents a message in a chat conversation.

    This class defines a message object that contains a role and a message content.
    '''

    def __init__(self, role: MessageRole, content: str):
        self.role = role
        self.content = content


class ChatPrompt:
    '''
    Represents a chat prompt for a chat conversation.

    This class defines a prompt object that contains a system prompt, message history, and user prompt.
    '''

    def __init__(self):
        self.system_prompt: str = ""
        self.message_history: list[Message] = []
        self.user_prompt: str = ""


class ChatModelDriver:
    '''
    Base class for chat model drivers.

    This class provides a base for chat model drivers that can be used to generate responses from specific AI models.
    '''

    def __init__(self, driven_model_provider: ModelProvider, driven_model_type: Model):
        self.provider = driven_model_provider
        self.model = driven_model_type

    def generate_response(self, prompt: ChatPrompt) -> str:
        raise NotImplementedError(
            "generate_response() must be implemented by subclasses")


class EmbeddingModelDriver:
    '''
    Base class for drivers that provide text embedding capabilities.
    Text embeddings are vector representations of text that capture semantic meaning,
    allowing for operations like semantic search and similarity comparisons.
    '''

    def __init__(self, driven_model_provider: ModelProvider, driven_model_type: Model):
        self.model = driven_model_type
        self.provider = driven_model_provider

    def embed(self, text: str) -> list[float]:
        '''
        Converts text into a vector embedding representation.

        Args:
            text: The input text to be embedded

        Returns:
            A list of floats representing the text embedding vector
        '''
        raise NotImplementedError("embed() must be implemented by subclasses")


class TextChunker:
    '''
    Represents an interface for text chunking aspects of a model provider
    '''

    def __init__(self, driven_model_provider: ModelProvider, driven_model_type: Model):
        self.provider = driven_model_provider
        self.model = driven_model_type

    def fits_in_default_chunk(self, text: str) -> bool:
        raise NotImplementedError(
            "fits_in_default_chunk() must be implemented by subclasses")

    def fits_in_maximum_chunk(self, text: str) -> bool:
        raise NotImplementedError(
            "fits_in_maximum_chunk() must be implemented by subclasses")

    def fits_in_embedding_chunk(self, text: str) -> bool:
        raise NotImplementedError(
            "fits_in_embedding_chunk() must be implemented by subclasses")

    def chunk_text(self, text: str, chunk_size: int | None = None, overlap_words: int | None = None) -> list[str]:
        raise NotImplementedError(
            "chunk_text() must be implemented by subclasses")

    def estimate_tokens(self, text: str) -> int:
        raise NotImplementedError(
            "estimate_tokens() must be implemented by subclasses")
