from enum import Enum
from .gemini import GeminiModel
from .open_ai import OpenAiModel

class ModelType(Enum):
    """
    Enum representing different types of summarization models.
    """
    BRAID_API = "braid_api"
    LOCAL_GEMINI = "local_gemini"
    
# Factory function to create the appropriate model based on model_type
def create_model(model_type: str):
    """
    Factory method to create a new model instance based on the specified model type.
    """
    model_type_enum = ModelType(model_type)
    if model_type_enum == ModelType.BRAID_API:
        return OpenAiModel()
    elif model_type == ModelType.LOCAL_GEMINI.name:
        return GeminiModel()
    else:
        raise ValueError(f"Unknown model type: {model_type}")