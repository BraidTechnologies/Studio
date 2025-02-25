
import os
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

from model_driver_base import EmbeddingModelDriver, ModelProvider, Model

class OpenAiEmbeddingModelInit:
    """
    Class defining initialization parameters for OpenAI embedding models.
    Used to configure model instances with deployment details and model characteristics.
    """
    def __init__(self, deployment_name: str, url_element: str, driven_model_type: Model, driven_model_provider: ModelProvider):
        self.deployment_name = deployment_name
        self.url_element = url_element
        self.driven_model_type = driven_model_type
        self.driven_model_provider = driven_model_provider

class OpenAiEmbed3EmbeddingModelInit(OpenAiEmbeddingModelInit):
    def __init__(self):
        super().__init__(
            deployment_name="Embed-3",
            url_element="StudioEmbeddingLarge",
            driven_model_type=Model.LARGE,
            driven_model_provider=ModelProvider.OPEN_AI
        )

class OpenAiEmbed3SmallEmbeddingModelInit(OpenAiEmbeddingModelInit):
    def __init__(self):
        super().__init__(
            deployment_name="Embed-3-Small", 
            url_element="StudioEmbeddingSmall",
            driven_model_type=Model.SMALL,
            driven_model_provider=ModelProvider.OPEN_AI
        )

class OpenAIEmbeddingModelDriver(EmbeddingModelDriver):
    """
    Driver for OpenAI embedding models.
    """

    def __init__(self, init: OpenAiEmbeddingModelInit):
        super().__init__(ModelProvider.OPEN_AI, init.driven_model_type)
        self.deployment_name = init.deployment_name
        self.url_element = init.url_element

    def embed(self, text: str) -> list[float]:
        return calculate_embedding(text, self.url_element)

def calculate_embedding(text: str, url_element: str) -> list[float]:
    """
    Asynchronously calculates the embedding for the given text using the Azure AI service.

    Args:
        text: The text for which the embedding needs to be calculated.
        url_element: The element of the URL to use for the embedding.

    Returns:
        list[float]: The calculated embedding vector.
    """

    # Configure retry strategy
    retry_strategy = Retry(
        total=5,
        backoff_factor=1,
        status_forcelist=[429]  # Retry on rate limit errors
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session = requests.Session()
    session.mount("https://", adapter)

    try:
        api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        url = f"https://studiomodels.openai.azure.com/openai/deployments/{url_element}/embeddings?api-version=2024-06-01"
        
        response = session.post(
            url,
            json={"input": text},
            headers={
                "Content-Type": "application/json",
                "api-key": api_key
            }
        )
        response.raise_for_status()
        
        embedding = response.json()["data"][0]["embedding"]
        return embedding

    except Exception as error:
        print(f"Error: {error}")
        raise
