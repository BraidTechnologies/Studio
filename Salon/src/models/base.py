from typing import Optional
from abc import ABC, abstractmethod

class AIModel(ABC):
    def __init__(self) -> None:
        super().__init__()

    @abstractmethod
    def generate_content(
        self,
        text_to_summarise: str,
        persona: str = "CodeSummariser",
        persona_intro: str = "",
        length_in_words: int = 100,
        max_retries: int = 3,
        retry_delay_seconds: int = 2
    ) -> Optional[str]:
        """
        Abstract method to generate content with a given persona and approximate desired length.
        """
        raise NotImplementedError("Method 'generate_content' must be implemented by subclasses")