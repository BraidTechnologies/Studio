**ApiConfiguration.py**

This module configures API settings for Azure OpenAI and Google's Gemini API, centralizing API endpoints, keys, and other necessary parameters.

It adapts configurations based on the environment, managing versions, URLs, and sensitive data fetched via environment variables for security.

`ApiConfiguration` class provides structured access to these settings, initializing default values for key attributes like API version, endpoints, processing threads, timeout, and token limits.

Key classes/functions:
- `ApiConfiguration`: Main class for accessing and managing API settings.
- `os.getenv()`: Used to safely retrieve environment variables for sensitive information like API keys.
   
It ensures environment-specific configurations and security practices.

**common_functions.py**

This module provides utility functions for the Braid LMS project, such as directory creation, embedding generation, and API configuration handling.

The `ensure_directory_exists(directory)` function checks if a directory exists at the given path and creates it if it doesn't. This aids in cross-platform directory handling.

The `get_embedding(text, embedding_client, config, model)` function generates an embedding for a provided text using Azure OpenAI, with options to set a specific model and configuration parameters.

Important classes/functions:
- `ensure_directory_exists(directory)`
- `get_embedding(text, embedding_client, config, model)`
- `ApiConfiguration` from `common.ApiConfiguration`

Configuration details and model selection are managed through the provided `ApiConfiguration` and optional model parameter.

