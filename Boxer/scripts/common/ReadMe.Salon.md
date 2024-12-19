**ApiConfiguration.py**

This code configures API settings dynamically based on whether the Azure platform is being used or not.

Important Classes:
1. **ApiConfiguration**: Initializes essential parameters for API interaction, such as `apiKey`, `apiVersion`, `resourceEndpoint`, `azureDeploymentName`, `azureEmbedDeploymentName`, `modelName`, `embedModelName`, and various configuration settings like `processingThreads`, `openAiRequestTimeout`, `summaryWordCount`, `chunkDurationMins`, `maxTokens`, and `discardIfBelow`.

The configuration distinguishes between Azure and an open AI setup, ensuring compatibility with both environments by using environmental variables and predefined constants for parameters.

**common_functions.py**

This module imports necessary libraries and initializes an `ApiConfiguration` instance named `config`.

The function `ensure_directory_exists(directory)` checks if a directory exists at the specified path. If it doesn't, it creates the directory, ensuring it works across different platforms using `os.path.join()`.

The script sets the `HTML_DESTINATION_DIR` to the path "data/web" and ensures this directory exists by calling `ensure_directory_exists(HTML_DESTINATION_DIR)`.

The function `get_embedding(text : str, client : AzureOpenAI, config : ApiConfiguration)` takes a string, replaces newlines with spaces, and generates an embedding using the Azure OpenAI service. It relies on the `config` for model specifics and timeout settings.

**Important Classes/Functions:**
- `ApiConfiguration`
- `ensure_directory_exists(directory)`
- `get_embedding(text, client, config)`

**Urls.py**

The script begins by importing necessary libraries and configuring logging.

It contains a list of YouTube, GitHub, and web URLs, each with a description and other relevant metadata.

The `UrlHit` class defines an entity to store information about URLs including path, description, and hit count.

The `countUrlHits` function calculates the hits for each URL by examining the chunks from an input JSON file. It accumulates the hit counts and logs error messages for missing input files or loading issues.

The results are printed to the console and saved to an output JSON file. Key functions include `countUrlHits` and the constructor for `UrlHit` class.

