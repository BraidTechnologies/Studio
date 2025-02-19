"""
Factory module for creating chat model driver instances.
Provides functions to instantiate model drivers with specific configurations.
Currently supports OpenAI models with different capabilities (large, small, reasoning).

The module exposes the following functions:
- get_default_chat_model_driver(): Returns the default GPT4o model driver
- get_chat_model_driver(): Creates a model driver based on specified model type and provider
- get_default_embedding_model_driver(): Returns the default Embed-3 model driver
- get_embedding_model_driver(): Creates a model driver based on specified model type and provider
- get_default_text_chunker(): Returns the default GPT4o chunker
- get_text_chunker(): Creates a chunker based on specified model type and provider
"""

from model_driver_base import ChatModelDriver, EmbeddingModelDriver, TextChunker, Model, ModelProvider
from openai_chat_model_driver import OpenAIChatModelDriver, OpenAi4oChatModelInit, OpenAiO1ChatModelInit, OpenAi4oMiniChatModelInit
from openai_embedding_model_driver import OpenAIEmbeddingModelDriver, OpenAiEmbed3EmbeddingModelInit, OpenAiEmbed3SmallEmbeddingModelInit
from openai_chunker import OpenAITextChunker, OpenAiGpt4oTextChunkerInit, OpenAiGpt4oMiniTextChunkerInit, OpenAiO1TextChunkerInit


def get_default_chat_model_driver() -> ChatModelDriver:
    """
    Returns the default chat model driver which is an instance of GPT4o.
    
    Returns:   
        ChatModelDriver: The default chat model driver
    """
    return OpenAIChatModelDriver(OpenAi4oChatModelInit())

def get_chat_model_driver(model: Model, provider: ModelProvider) -> ChatModelDriver:
    """
    Returns an instance of ChatModelDriver based on the provided Model type and ModelProvider
    
    Args:
        model: The Model type to determine the model
        provider: The ModelProvider type to determine the provider   
        
    Returns:
        ChatModelDriver: An instance of ChatModelDriver corresponding to the specified Model type and Provider
    """
    if provider != ModelProvider.OPEN_AI:
        raise ValueError("Only OpenAI provider is currently supported")

    if model == Model.REASONING:
        return OpenAIChatModelDriver(OpenAiO1ChatModelInit())
    elif model == Model.SMALL:
        return OpenAIChatModelDriver(OpenAi4oMiniChatModelInit())
    else:  # Model.LARGE or default
        return OpenAIChatModelDriver(OpenAi4oChatModelInit())

def get_default_embedding_model_driver() -> EmbeddingModelDriver:
    """
    Returns the default embedding model driver which is an instance of Embed-3.
    
    Returns:   
        EmbeddingModelDriver: The default embedding model driver
    """
    return OpenAIEmbeddingModelDriver(OpenAiEmbed3EmbeddingModelInit())

def get_embedding_model_driver(model: Model, provider: ModelProvider) -> EmbeddingModelDriver:
    """
    Returns an instance of EmbeddingModelDriver based on the provided Model type and ModelProvider
    
    Args:
        model: The Model type to determine the model
        provider: The ModelProvider type to determine the provider   
        
    Returns:
        EmbeddingModelDriver: An instance of EmbeddingModelDriver corresponding to the specified Model type and Provider
    """
    if provider != ModelProvider.OPEN_AI:
        raise ValueError("Only OpenAI provider is currently supported")

    if model == Model.SMALL:
        return OpenAIEmbeddingModelDriver(OpenAiEmbed3SmallEmbeddingModelInit())
    else:  # Model.LARGE or default
        return OpenAIEmbeddingModelDriver(OpenAiEmbed3EmbeddingModelInit())

def get_default_text_chunker() -> TextChunker:
    """
    Returns the default text chunker which is an instance of GPT4o chunker.
    
    Returns:   
        TextChunker: The default text chunker
    """
    return OpenAITextChunker(OpenAiGpt4oTextChunkerInit())

def get_text_chunker(model: Model, provider: ModelProvider) -> TextChunker:
    """
    Returns an instance of TextChunker based on the provided Model type and ModelProvider
    
    Args:
        model: The Model type to determine the model
        provider: The ModelProvider type to determine the provider   
        
    Returns:
        TextChunker: An instance of TextChunker corresponding to the specified Model type and Provider
    """
    if provider != ModelProvider.OPEN_AI:
        raise ValueError("Only OpenAI provider is currently supported")

    if model == Model.REASONING:
        return OpenAITextChunker(OpenAiO1TextChunkerInit())
    elif model == Model.SMALL:
        return OpenAITextChunker(OpenAiGpt4oMiniTextChunkerInit())
    else:  # Model.LARGE or default
        return OpenAITextChunker(OpenAiGpt4oTextChunkerInit())