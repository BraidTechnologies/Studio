**ApiConfiguration.py**

This module sets up configuration options for connecting to either Azure OpenAI or OpenAI based on the `azure` flag.

It defines the `ApiConfiguration` class, which initializes several key parameters such as `apiKey`, `apiVersion`, `resourceEndpoint`, `azureDeploymentName`, `azureEmbedDeploymentName`, `modelName`, `embedModelName`, `processingThreads`, `openAiRequestTimeout`, `summaryWordCount`, `chunkDurationMins`, `maxTokens`, and `discardIfBelow`.

Environment variables are safely retrieved for `API_KEY` using `os.getenv`, ensuring compatibility across Windows and Unix systems. The default deployment names, model names, and various thresholds for requests and processing are also defined within the class.

**common_functions.py**

### Important Classes or Functions:

1. **ensure_directory_exists(directory)**: 
   - Checks if a specified directory exists. If not, it creates the directory.

2. **get_embedding(text : str, client : AzureOpenAI, config : ApiConfiguration)**: 
   - Cleans up input text by removing newline characters.
   - Uses `client.embeddings.create` to create an embedding of the text using the configuration from `ApiConfiguration`.
   - Returns the embedding.

### Summary:

This code imports necessary modules and configuration settings. It defines a function, `ensure_directory_exists`, to check for or create a directory. It ensures the existence of a specific directory, `data/web`. Another function, `get_embedding`, processes input text to create and return an embedding using the AzureOpenAI client and API configurations.

**Urls.py**

This Python script logs and processes hit counts on various URLs categorized into YouTube videos, GitHub repositories, and web articles.

Key sections include:
- `youTubeUrls`, `gitHubUrls`, `webUrls`: Store URLs and their descriptions.
- `UrlHit` class: Stores URL details and hit counts.
- `countUrlHits(destinationDir, urls, input_filename, output_filename)` function: Reads a JSON file with hit data, counts occurrences of URL paths, and logs results.
- The function reads the `input_filename` from `destinationDir`, processes hits, then outputs the counts into `output_filename`.
- Error handling and logging are integral throughout for robustness.



