**ApiConfiguration.py**

This code enables the configuration of the Azure OpenAI and Gemini APIs. Initially, the script sets up environment-specific variables based on whether the Azure flag is set to True or False. It retrieves the appropriate API keys, versions, and endpoints which are needed to interface with these services.

The `ApiConfiguration` class is used to initialize default values for various parameters associated with Azure OpenAI and Gemini APIs. These include API keys, endpoints, deployment names, model configurations, and request parameters such as timeouts, token limits, and summarization settings. 

Important functions or classes:
1. `ApiConfiguration` class and its `__init__` method for initializing default API configurations.

**common_functions.py**

The code imports necessary libraries including `os` for file operations and `AzureOpenAI` for interacting with the Azure OpenAI service. It also imports a custom `ApiConfiguration` class from `common.ApiConfiguration`.

The `ensure_directory_exists` function checks if a specified directory exists; if not, it creates the directory using `os.makedirs`.

The global variable `HTML_DESTINATION_DIR` is set to the path "data/web" for cross-platform compatibility, and the `ensure_directory_exists` function is called to ensure this directory exists.

The `get_embedding` function takes text, an AzureOpenAI client, an API configuration, and an optional model name to generate text embeddings. Text is cleaned by replacing newlines with spaces, and the embedding is generated using the specified (or default) model and configuration. The function then returns the embedding data.

