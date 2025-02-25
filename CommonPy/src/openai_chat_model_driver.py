
import os
import requests
from requests.adapters import HTTPAdapter
from urllib3.util import Retry

from model_driver_base import ChatModelDriver, ModelProvider, ChatPrompt, Model

class OpenAiChatModelInit:
    """
    Class defining initialization parameters for OpenAI chat models.
    Used to configure model instances with deployment details and model characteristics.
    """
    def __init__(self, deployment_name: str, url_element: str, driven_model_type: Model, driven_model_provider: ModelProvider):
        self.deployment_name = deployment_name
        self.url_element = url_element 
        self.driven_model_type = driven_model_type
        self.driven_model_provider = driven_model_provider

class OpenAi4oChatModelInit(OpenAiChatModelInit):
    def __init__(self):
        super().__init__(
            deployment_name="GTP4o",
            url_element="StudioLarge", 
            driven_model_type=Model.LARGE,
            driven_model_provider=ModelProvider.OPEN_AI
        )

class OpenAi4oMiniChatModelInit(OpenAiChatModelInit):
    def __init__(self):
        super().__init__(
            deployment_name="GTP4o-mini",
            url_element="StudioSmall",
            driven_model_type=Model.SMALL,
            driven_model_provider=ModelProvider.OPEN_AI
        )

class OpenAiO1ChatModelInit(OpenAiChatModelInit):
    def __init__(self):
        super().__init__(
            deployment_name="o1",
            url_element="StudioReasoning",
            driven_model_type=Model.REASONING,
            driven_model_provider=ModelProvider.OPEN_AI
        )

class OpenAIChatModelDriver(ChatModelDriver):
    '''
    Driver for OpenAI chat models.
    '''

    def __init__(self, init: OpenAiChatModelInit):
        super().__init__(ModelProvider.OPEN_AI, init.driven_model_type)
        self.params = init

    def generate_response(self, prompt: ChatPrompt) -> str:
        return chat (prompt)
    
def chat(prompt: ChatPrompt) -> str:
    """
    Asynchronously generates a chat response using the Azure OpenAI service.

    Args:
        prompt: The chat prompt containing the system prompt, message history and user prompt

    Returns:
        str: The generated response from the model
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

    # Construct messages list
    messages = []
    
    if prompt.system_prompt:
        messages.append({
            "role": "system",
            "content": prompt.system_prompt
        })

    for message in prompt.message_history:
        messages.append({
            "role": message.role.value,
            "content": message.content
        })

    messages.append({
        "role": "user",
        "content": prompt.user_prompt
    })

    try:
        api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        url = "https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01"
        
        response = session.post(
            url,
            json={"messages": messages},
            headers={
                "Content-Type": "application/json",
                "api-key": api_key
            }
        )
        response.raise_for_status()
        
        return response.json()["choices"][0]["message"]["content"]

    except Exception as error:
        print(f"Error: {error}")
        raise
