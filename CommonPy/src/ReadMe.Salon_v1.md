**chunk_repository_api.py**

This code defines a `ChunkRepository` class for interacting with a Braid API to store and retrieve data chunks.  It uses the `requests` library to make HTTP POST requests to API endpoints for saving, loading, finding, removing, and checking the existence of chunks.  The class initializes with a session key and retrieves default model IDs from the API.  Chunk data is serialized to JSON before being sent to the API, and received JSON responses are deserialized into Python objects.  The code includes logging for debugging and error handling.  Several methods like `save`, `find`, `load`, `remove`, and `exists` provide the core functionality for managing chunks.


**chunk_repository_api_types.py**

This code defines data structures for storing and querying text and embeddings.  `IStoredEmbedding` and `IStoredTextRendering` store embedding vectors and text respectively, both associated with a `modelId`. `IStoredChunk` represents a data chunk, holding original text, optional embeddings, summaries, titles, a URL, related chunk IDs, and a parent chunk ID. It inherits from `IStorable`.  Helper functions `create_text_rendering` and `create_embedding` simplify instance creation.  `IStoredChunkQuerySpec`, though not shown, is used for querying these chunks.  Essentially, these classes provide a structured way to organize and access text data and their corresponding vector representations.


**comparable_enum.py**

This code defines `EnumComparable`, a class extending Python's `Enum` to enable comparisons between enum members, numbers, and strings.  It overloads comparison operators (>, <, >=, <=, ==) to compare enum values numerically.  If compared to a number, the enum's value is used. If compared to a string, the enum's name is used for equality checks.  This allows for intuitive comparisons like `MyEnum.ONE > 1` or `MyEnum.ONE == "ONE"`.  If comparison isn't supported, it returns `NotImplemented`.


**cosine_similarity.py**

This code defines a utility function `cosine_similarity` to calculate the cosine similarity between two vectors.  It takes two lists of floats (`vector1`, `vector2`) as input and returns a float representing the cosine similarity.  The function first checks if the input vectors have the same length, raising a ValueError if they don't. It then calculates the dot product and magnitudes of the vectors.  If either magnitude is zero, it returns 0. Otherwise, it returns the dot product divided by the product of the magnitudes. This result represents the cosine of the angle between the two vectors, indicating their directional similarity.


**embed_api.py**

This code defines an API client (`EmbeddingApi`) for generating text embeddings. It uses the `requests` library to interact with an embedding API endpoint.  The client includes retry logic for handling server errors. The `embed` method takes an `IEmbedRequest` object, sends it to the API, and returns an `IEmbedResponse` object if successful.  The API key is retrieved from the `BRAID_SESSION_KEY` environment variable.  Logging is configured for debugging purposes.  The client communicates with a local or cloud-based API endpoint for embedding generation.


**embed_api_types.py**

This code defines the structure for requests and responses to a text embedding API.  `IEmbedRequest` specifies the format for embedding requests, requiring a `persona` (string) and the `text` (string) to be embedded. `IEmbedResponse` outlines the response structure, which contains the resulting `embedding` as a list of floats. It also includes an initializer allowing creation from another `IEmbedResponse` instance or an empty response.  These types ensure clear communication between clients and the embedding service.


**enriched_query_api.py**

This code defines an API client (`EnrichedQueryApi`) for interacting with an enriched query service.  It uses the `requests` library to make HTTP POST requests to API endpoints for question generation and semantic search.  The client handles retries for common server errors and deserializes JSON responses into typed objects.  The `generate_question` method sends a question request and receives generated questions. The `enriched_query` method performs a semantic search based on a provided question and returns enriched text chunks with relevance scores.  A session key from environment variables authenticates API calls.


**enriched_query_api_types.py**

This code defines data structures for an enriched query API using Python type hinting.  `IEnrichedChunk` represents a text chunk with its ID, embedding, URL, text, and summary.  `IRelevantEnrichedChunk` adds a relevance score.  Query specifications (`IChunkQuerySpec` and its subtypes) define parameters for chunk retrieval.  `IModelConversationElement` structures conversation history.  Request/response types are defined for enriched queries (`IEnrichedQueryRequest`, `IEnrichedResponse`), question generation (`IGenerateQuestionRequest`, `IQuestionGenerationResponse`), and ideal answer generation (`IGenerateIdealAnswerRequest`, `IGenerateIdealAnswerResponse`). Each class uses an initializer to handle optional instantiation from another object.


**generated_boxer_prompt_names.py**

This code defines string constants representing prompt IDs used to access prompts from a prompt repository.  `developer_assistant_prompt_id`, `developer_imagined_answer_generator_prompt_id`, and `developer_question_generator_prompt_id` are GUIDs (Globally Unique Identifiers) corresponding to specific prompts, likely related to a developer assistant tool. The file is auto-generated and should not be manually modified.  This approach allows the system to reference prompts by ID rather than embedding the prompt text directly, simplifying management and updates.


**generated_prompt_names.py**

This code defines a set of constant string variables representing prompt IDs.  These IDs likely correspond to pre-written prompts stored in a separate prompt repository.  Each variable is named descriptively, indicating the intended use case of the associated prompt (e.g., `article_summariser_prompt_id` for article summarization).  The `default_prompt_id` suggests a general-purpose prompt.  The comment at the beginning emphasizes that this file is automatically generated and should not be manually modified.


**generated_salon_prompt_names.py**

This code defines string variables storing prompt IDs. `code_summariser_prompt_id` and `c4_diagrammer_prompt_id` hold unique identifiers, likely used to retrieve specific prompts from a prompt repository.  The file is auto-generated and should not be manually modified.  This suggests a system where prompts are stored centrally and accessed via their IDs, likely to manage and version different prompt variations for tasks like code summarization and C4 diagram generation.


**generated_waterfall_prompt_names.py**

This code defines a set of constant IDs for accessing different prompts from a prompt repository.  Each ID is a UUID string and is associated with a specific prompt function, such as article summarization, classification, or theme finding.  The file is auto-generated and should not be manually modified.  These IDs are likely used as keys to retrieve the actual prompt content from a database or other storage.  This approach allows for managing and versioning prompts separately from the code that uses them.


**model_driver_base.py**

This module defines core components for interacting with AI models.  It introduces enums for model providers (`ModelProvider` like OpenAI), model types (`Model`), and message roles (`MessageRole`) in chat conversations.  The `Message` class represents a chat message with role and content.  `ChatPrompt` encapsulates system prompts, message history, and user prompts.  Abstract base classes `ChatModelDriver`, `EmbeddingModelDriver`, and `TextChunker` provide a consistent interface for diverse model operations, including response generation, text embedding, and text chunking.  Concrete implementations must subclass these base classes.


**model_driver_factories.py**

This code defines a factory module for creating chat model, embedding model, and text chunker drivers, primarily using OpenAI.  It provides default functions (using GPT-4, Embed-3, and GPT-4 respectively) and customizable functions where you can specify the model size (large, small, reasoning) and provider (currently only OpenAI). Each `get` function returns a specific driver instance based on the provided `Model` and `ModelProvider` enums.  The factory simplifies creating different model drivers with specific configurations.


**openai_chat_model_driver.py**

This code defines a driver for interacting with OpenAI chat models, specifically on Azure.  It uses inheritance to define different model initialization parameters (GTP4o, GTP4o-mini, o1) with varying deployment names and model sizes.  The `OpenAIChatModelDriver` class handles the interaction with the OpenAI API.  The `chat` function constructs the message payload with system prompt, message history, and user prompt, then sends a POST request to the Azure OpenAI endpoint.  It includes retry logic for handling rate limiting. The API key is retrieved from environment variables.  Error handling is implemented to catch and raise exceptions during the API call.


**openai_chunker.py**

This code provides a text chunking module for OpenAI models, managing text splitting to fit within model context windows. It uses `tiktoken` for GPT-4 compatible tokenization.  The `Tokenizer` class estimates and chunks text based on token counts.  `OpenAITextChunker` handles chunking with configurable sizes and overlap, including specific configurations for different OpenAI models (small, large, reasoning).  It checks if text fits within various chunk size limits (default, maximum, embedding) with buffers.  Chunking can be performed with or without overlap, ensuring efficient text processing for OpenAI API calls.


**openai_embedding_model_driver.py**

This code defines a driver for interacting with OpenAI embedding models hosted on Azure.  It uses inheritance to define specific model initialization parameters (e.g., `OpenAiEmbed3EmbeddingModelInit` for the "Embed-3" model).  The `OpenAIEmbeddingModelDriver` class handles embedding calculations by calling `calculate_embedding`. This function makes a POST request to the Azure OpenAI API with the input text and retrieves the resulting embedding vector.  It includes retry logic for handling rate limiting (429 errors).  The code retrieves the Azure API key from the environment.


**page_repository_api.py**

This Python code defines a `PageRepository` class for interacting with a Braid API to store and retrieve web page data.  The `save` method sends page content (represented by the `IStoredPage` type) to the API, including metadata like ID, timestamps, and compressed HTML content. The `load` method retrieves page content by ID.  Utility functions handle string compression, file reading, and creation of `IStoredPage` objects from files.  The code uses environment variables for API keys and includes retry logic for handling potential network issues.  Logging provides debugging information.


**page_repository_api_types.py**

This code defines the `IStoredPage` class, which represents a stored data chunk with HTML content.  It inherits from `IStorable` (implying basic storage functionality) and adds an `html` attribute of type string or None.  The constructor allows initialization from another `IStoredPage` instance (copying its `html` value) or creates a new instance with `html` set to `None`.  Essentially, it's a structure for storing data alongside its HTML representation.


**storable_types.py**

This code defines three classes related to data storage and retrieval.  `IStorable` serves as a base class for data entities, holding common attributes like identifiers (`id`, `applicationId`, `contextId`, `userId`), timestamps (`created`, `amended`), and schema information (`className`, `schemaVersion`).  `IStorableQuerySpec` specifies query parameters, allowing searches by `id` or `functionalSearchKey`. Finally, `IStorableOperationResult` represents the outcome of a storage operation with a simple boolean `ok` flag. Each class includes a constructor that supports initialization from another object of the same type.


**type_utilities.py**

This code provides utility functions for converting dictionaries to objects and safely casting values to different types.  `DictToObject` transforms a dictionary into an object, assigning dictionary keys as object attributes.  `safe_dict_to_object` provides a wrapper around this conversion, handling potential errors and returning a default value if the conversion fails or the input is None. Similarly, `safe_cast` attempts to cast a value to a given type, returning a default value upon failure.  This is useful when dealing with data from external sources like web requests, where data types might be unpredictable.


Generated by Salon from Braid Technologies, 28/02/2025