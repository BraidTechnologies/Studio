**chunk_repository_api.py**

The script defines a Python module to interact with the "Chunk" table in the Braid APIs database.

The `ChunkRepository` class is designed to interact with the Braid Cosmos database, handling operations such as load, save, find, remove, and check existence for chunks of data.

The `__init__` method sets up a requests session with retries and fetches default model IDs from the API.

The `save` method saves a chunk to the database and converts embedded objects to JSON.

The `find` and `load` methods fetch stored chunks by functional key or record ID, respectively, converting JSON responses into Python objects.

The `remove` method deletes a chunk by record ID.

The `exists` method checks if a chunk exists in the database.

**chunk_repository_api_types.py**

This module defines several class structures for storing and querying data related to embeddings and text renderings.

### Important Classes:
1. **IStoredEmbedding**
   - Represents an embedding with attributes `modelId` (model identifier) and `embedding` (list of float values).
   - Initializes attributes from another instance if provided.

2. **IStoredTextRendering**
   - Represents a text rendering with attributes `modelId` (model identifier) and `text` (text content).
   - Initializes attributes from another instance if provided.

3. **IStoredChunk**
   - Inherits from `IStorable` and represents a chunk of data with attributes such as `parentChunkId`, `originalText`, `storedEmbedding`, `storedSummary`, `storedTitle`, `url`, and `relatedChunks`.
   - Initializes from another instance with safe casting for attributes.

### Utility Functions:
1. `create_text_rendering(text: str, model: str) -> IStoredTextRendering`
   - Creates and returns an instance of `IStoredTextRendering`.

2. `create_embedding(embedding: list[float], model: str) -> IStoredEmbedding`
   - Creates and returns an instance of `IStoredEmbedding`.

**comparable_enum.py**

The module extends Python's built-in Enum to include rich comparison operators by defining the `EnumComparable` base class.

The `EnumComparable` class allows for comparisons between its enum members, integers, and strings based on the member's value and name, respectively.

Key comparison operations implemented include `__gt__` (greater than), `__lt__` (less than), `__ge__` (greater than or equal to), `__le__` (less than or equal to), and `__eq__` (equal to).

The comparison operations handle cases where the `other` variable is either another enum member, a number, or a string.

Key class: `EnumComparable`.

**cosine_similarity.py**

The module provides a utility function for vector similarity calculations.

The main function, `cosine_similarity`, computes the cosine similarity between two vectors.

It raises a `ValueError` if the input vectors don't have the same length.

The function calculates the dot product of the vectors, computes the magnitude of each vector, and handles the edge case where either vector has zero magnitude.

Finally, it returns the cosine similarity, a measure of how similar the two vectors are.

**embed_api.py**

The module provides a client for interacting with Braid Technologies' enriched query API endpoints. It includes functionalities for semantic search, question generation, and retrieving enriched text chunks. Key classes and functions in the module include:

- `EmbeddingApi` class: This is the main client interfacing with the embedding API endpoint.
   - `__init__`: Initializes a `Session` object with retry logic for handling network issues.
   - `embed`: Method for generating vector embeddings from given text using AI models. It sends a POST request to the API and returns the response after converting it to an appropriate format.

The module uses the `requests` library for HTTP operations and incorporates logging for tracking execution. Additionally, it uses environment variables to manage session keys securely.

**embed_api_types.py**

This module is for defining types related to the Embed API, which is responsible for text embedding operations.

The `IEmbedRequest` class serves as a request structure for embedding operations, containing the attributes `persona` and `text`.

The `IEmbedResponse` class holds the response from embedding operations, featuring an attribute `embedding` that stores the generated embedding vector as a list of floats. The class's constructor can initialize an instance by copying the `embedding` attribute from another `IEmbedResponse` instance if provided, or set it to `None` otherwise.

**enriched_query_api.py**

This module, "API client for the enriched query service," provides utilities to interact with enriched query API endpoints for semantic search, question generation, and retrieval of enriched text chunks.

The `EnrichedQueryApi` class sets up an API client equipped with retry mechanisms for resilient network communication. It includes methods `generate_question` and `enriched_query` to interact with specific API endpoints.

`generate_question` requests the generation of follow-up questions based on provided text and returns the parsed response.

`enriched_query` performs semantic search and retrieves enriched text chunks, parsing and structuring the response accordingly.

Key dependencies include `requests`, `logging`, `Retry`, and several custom utility modules for safe type casting and object conversion.

**enriched_query_api_types.py**

This module defines interfaces and data structures for the enriched query API, essential for semantic search and retrieval operations.

Key classes include:
- `IEnrichedChunkSummary`: Represents a text chunk's summary with its URL and text.
- `IEnrichedChunk`: Inherits from `IEnrichedChunkSummary` and adds attributes for chunk id and embedding.
- `IRelevantEnrichedChunk`: Contains a summarized chunk and its relevance score.
- `IChunkQuerySpec`: Specifies chunk queries with attributes for repositoryId, maxCount, and similarityThreshold.
- `IModelConversationElement`: Represents elements in a conversation.
- `IEnrichedQueryRequest`: Defines the structure for enriched query requests.
- `IEnrichedResponse`: Structures responses with an answer and a list of relevant enriched chunks.
- `IGenerateQuestionRequest`: Structures the request to generate a question.
- `IQuestionGenerationResponse`: Holds the generated question.

These classes facilitate the management and retrieval of enriched data chunks based on specified queries and parameters.

**model_driver_base.py**

This module provides core abstractions and types for model drivers used in the system.

### Important Classes:

**ModelProvider:** Enum defining supported AI model providers like OpenAI.

**Model:** Enum representing various AI model types and capabilities such as LARGE, SMALL, and REASONING.

**MessageRole:** Enum for roles in chat conversations; includes ASSISTANT, USER, and SYSTEM.

**Message:** Class representing a chat message, which includes a role and its content.

**ChatPrompt:** Class representing a chat prompt, which consists of a system prompt, message history, and user prompt.

**ChatModelDriver:** Base class for chat model drivers to generate responses from AI models.

**EmbeddingModelDriver:** Base class for drivers that provide text embedding capabilities.

**TextChunker:** Class for text chunking aspects, including estimating tokens and chunking text based on specified sizes and overlap.

Each class and enum provides essential functionality and structure for implementing consistent interfaces across different AI model providers.

**model_driver_factories.py**

This code defines a factory module for creating instances of chat model drivers, embedding model drivers, and text chunkers. It supports different configurations based on model types and providers and is primarily focused on OpenAI models.

Key functions include:
- `get_default_chat_model_driver()`: Returns the default GPT4o chat model driver.
- `get_chat_model_driver(model, provider)`: Creates a ChatModelDriver based on specified model type (e.g., LARGE, SMALL, REASONING) and provider (currently only OpenAI).
- `get_default_embedding_model_driver()`: Returns the default Embed-3 embedding model driver.
- `get_embedding_model_driver(model, provider)`: Creates an EmbeddingModelDriver based on specified model type and provider.
- `get_default_text_chunker()`: Returns the default GPT4o text chunker.
- `get_text_chunker(model, provider)`: Creates a TextChunker based on specified model type and provider.

Important classes:
- `ChatModelDriver`, `EmbeddingModelDriver`, `TextChunker`.
- OpenAI related initializers and drivers.

**openai_chat_model_driver.py**

This code defines classes for initializing and driving OpenAI chat models.

**Classes:**
1. **OpenAiChatModelInit:** Defines initialization parameters for OpenAI chat models, including deployment details and model characteristics.

2. **OpenAi4oChatModelInit, OpenAi4oMiniChatModelInit, OpenAiO1ChatModelInit:** Subclasses of `OpenAiChatModelInit` that initialize specific chat model configurations like "GTP4o", "GTP4o-mini", and "o1" with respective deployment names, url elements, and model types.

3. **OpenAIChatModelDriver:** Extends `ChatModelDriver`; manages interaction between application and OpenAI models using initialization parameters from `OpenAiChatModelInit`.

**Functions:**
1. **chat:** Generates a chat response using Azure OpenAI service. It configures a retry strategy, constructs the request message, uses the session to send the required payload, and retrieves the response.

**openai_chunker.py**

This module provides functionality for chunking text to fit within OpenAI model context windows. It includes:
- `Tokenizer`: Handles GPT-4 compatible tokenization using the `tiktoken` library.
- `OpenAITextChunker`: Implements text chunking with configurable sizes and overlap, designed to work within token limits and embedding requirements of OpenAI models.

The `Tokenizer` class includes methods to estimate token count and chunk text into smaller pieces based on token limits. 

The `OpenAITextChunker` class, utilizing initialization parameters from `OpenAiTextChunkerInit`, provides methods to check if text fits within different chunk sizes and a method to split text into overlapping or non-overlapping chunks.

**openai_embedding_model_driver.py**

This module handles the initialization and interaction with OpenAI embedding models. 

**Important Classes:**

1. **OpenAiEmbeddingModelInit**: Initializes and configures parameters for OpenAI embedding model instances, including deployment details and model characteristics.
2. **OpenAiEmbed3EmbeddingModelInit**: Specific initialization for the "Embed-3" large embedding model, derived from OpenAiEmbeddingModelInit.
3. **OpenAiEmbed3SmallEmbeddingModelInit**: Specific initialization for the "Embed-3-Small" small embedding model, derived from OpenAiEmbeddingModelInit.
4. **OpenAIEmbeddingModelDriver**: Configures and manages the embedding driver for OpenAI models, facilitating the embedding process.

**Important Function:**

1. **calculate_embedding**: Calculates embeddings for given text asynchronously, utilizes Azure's OpenAI service, with retry logic to handle rate limiting.

**page_repository_api.py**

**Important Classes and Functions:**
- `PageRepository`: Manages save and load operations for pages in the Braid Cosmos database. 
  - `save(page: IStoredPage) -> bool`: Saves a page object to the database.
  - `load(record_id: str) -> str`: Loads a page's content from the database using a record ID.

- `compress_string(input_str: str) -> str`: Compresses a string using zlib and encodes it in Base64.

- `read_file_to_string(file_path: str) -> str`: Reads a file's content into a string using UTF-8 encoding.

- `make_page_from_file(...) -> IStoredPage`: Creates a `IStoredPage` object from file content, including setting metadata fields like `amended` and `created`. 

The provided code is an API module to store and retrieve data in the Page table of the Braid Apis, utilizing HTTP requests with retry logic and compressing the page content before saving. Logging is set up for monitoring execution, and environmental variables are used for secure configuration.

**page_repository_api_types.py**

This code defines classes for storing and querying data related to embeddings and text renderings. 

The main class defined is `IStoredPage`, which inherits from the `IStorable` class and represents a chunk of data with an additional attribute for HTML content. 

The `IStoredPage` class has an attribute `html` which holds the HTML content of the page and can be either a string or `None`.

The `__init__` method of the `IStoredPage` class initializes this `html` attribute, copying it from another instance if provided, or setting it to `None` by default.

**storable_types.py**

This code defines three classes for managing and querying stored data entities.

**IStorable**: A base class for storable entities, encompassing attributes like `id`, `applicationId`, `contextId`, `functionalSearchKey`, `userId`, `created`, `amended`, `className`, and `schemaVersion`. It initializes these attributes, either from another instance or as `None`.

**IStorableQuerySpec**: This class facilitates specifying query parameters for storables. It includes `id` as the primary key and `functionalSearchKey` as an alternative identifier.

**IStorableOperationResult**: A simple class for storing the results of a storable operation, indicating success or failure with a boolean `ok`.

**type_utilities.py**

The code includes a utility for converting dictionaries to objects, useful for mapping JSON responses to object types after web requests.

The `DictToObject` class converts a dictionary into an object by setting attributes for each key-value pair in the dictionary, enabling attribute-style access to dictionary data.

The `safe_dict_to_object` function safely converts a dictionary into an object, using `DictToObject` to handle conversion and returning a default value if the input is None or if an error occurs.

The `safe_cast` function attempts to cast a value to a specified type, returning a default value if the casting fails due to a `ValueError` or `TypeError`.

Important classes and functions:
- `DictToObject`
- `safe_dict_to_object`
- `safe_cast`

Generated by Salon from Braid Technologies, 24/02/2025