"""
Factory module for creating chat model driver instances.
Provides functions to instantiate model drivers with specific configurations.
Currently supports OpenAI models with different capabilities (large, small, reasoning).

The module exposes two main functions:
- get_default_chat_model_driver(): Returns the default GPT4o model driver
- get_chat_model_driver(): Creates a model driver based on specified model type and provider
"""

from openai_chat_model_driver import OpenAIChatModelDriver, OpenAi4oChatModelInit, OpenAiO1ChatModelInit, OpenAi4oMiniChatModelInit
from model_driver_base import ChatModelDriver, Model, ModelProvider

def get_default_chat_model_driver():
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