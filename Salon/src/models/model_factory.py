from enum import Enum
from .gemini import GeminiModel
from .open_ai import OpenAiModel
from ..types.model_type import ModelType
    
# Factory function to create the appropriate model based on model_type
def create_model(model_type: str):
    """
    Factory method to create a new model instance based on the specified model type.
    """
    model_type_enum = ModelType(model_type)
    if model_type_enum == ModelType.BRAID_API:
        return OpenAiModel()
    elif model_type_enum == ModelType.LOCAL_GEMINI:
        return GeminiModel()
    else:
        raise ValueError(f"Unknown model type: {model_type}")