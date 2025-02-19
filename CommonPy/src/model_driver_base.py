'''
Base class for model drivers.
'''

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
    def __init__(self, provider: ModelProvider, model: Model):
        self.provider = provider
        self.model = model

    def generate_response(self, prompt: ChatPrompt) -> str:
        raise NotImplementedError("generate_response() must be implemented by subclasses")


        
