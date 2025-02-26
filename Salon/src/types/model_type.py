from enum import Enum

class ModelType(Enum):
    """
    Enum representing different types of summarization models.
    """
    BRAID_API = "braid_api"
    LOCAL_GEMINI = "local_gemini"