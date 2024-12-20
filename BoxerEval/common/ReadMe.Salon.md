**ApiConfiguration.py**

This module sets up API configurations for both Azure and OpenAI, with conditional logic to differentiate settings based on the `azure` flag.

- **API_TYPE**: Set according to the `azure` flag.
- **API_KEY**: Retrieved safely from environment variables using `os.getenv`.
- **API_VERSION** and **RESOURCE_ENDPOINT**: Defined specifically for both Azure and OpenAI.

The script also fetches the Gemini API key and endpoint.

### Important Class:
- **ApiConfiguration**: Initializes default values for Azure OpenAI and Gemini API parameters, including API keys, resource endpoints, model names, and various settings like `processingThreads`, `openAiRequestTimeout`, and `maxTokens`.

### Constructor:
- **__init__()**: Sets initial values for the class attributes upon creating an instance.

**common_functions.py**

This module manages directories and generates text embeddings using the OpenAI API.

The `ensure_directory_exists` function checks if a specified directory exists and creates it if it doesn't. It takes a directory path as an argument.

The path "data/web" is constructed and passed to `ensure_directory_exists` to ensure the directory structure is present.

The `get_embedding` function takes text, an embedding client, configuration, and an optional model name. It replaces newlines in the text with spaces and selects a model for generating embeddings using the OpenAI API, returning the embedding result.

Key classes/functions: `ensure_directory_exists`, `get_embedding`, `ApiConfiguration`. 

