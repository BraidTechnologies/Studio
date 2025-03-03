**ActivityRepositoryApi.ts**

The `ActivityRepositoryApi` class provides a wrapper for managing activity records.  It uses the `StorableRepositoryApi` for core CRUD operations (Create, Read, Update, Delete) and interacts with environment-specific API endpoints. Key methods include `load` to retrieve a specific activity by ID, `find` to search by a functional key, `save` to store new or updated activities, `remove` to delete activities, and `recent` to fetch a list of recent activities based on query specifications.  All operations require a session key for authentication.


**Api.ts**

This TypeScript code defines an abstract `Api` base class using the `axios` library for API interactions. It serves as a blueprint for other API classes by storing common properties like `environment` (an interface `IEnvironment`) and `sessionKey` (a string).  The constructor initializes these properties.  Getter methods provide access to the `environment` and `sessionKey`.  This class isn't meant to be used directly, but rather extended by specific API classes to inherit its functionality.  It promotes code reusability and consistency across different API interactions.


**Asserts.ts**

This code defines a TypeScript module called `Asserts` that provides helper functions for runtime type checking.  These functions, `throwIfUndefined`, `throwIfNull`, and `throwIfFalse`, accept values that might be undefined, null, or false respectively. If the checked condition is met, the functions throw an `AssertionFailedError`.  Importantly, these functions use TypeScript's `asserts` keyword to narrow the type of the variable after a successful check, improving code clarity and enabling more precise type checking.  For example, after calling `throwIfUndefined(x)`, the TypeScript compiler knows that `x` is not undefined.


**ChunkApi.Types.ts**

This code defines TypeScript interfaces for a Chunk API used in text segmentation.  `IChunkRequest` specifies the input: `text` (required), `chunkSize` (in tokens), and `overlapWords` (between chunks).  `IChunkResponse` defines the output: an array of string `chunks`.  The API allows developers to split text into smaller pieces with configurable chunk sizes and overlap, facilitating text processing.  These types improve code clarity and maintainability by defining the expected data structures.


**ChunkRepositoryApi.ts**

The `ChunkRepositoryApi` class provides a wrapper for managing text chunks stored in a repository.  It uses the `StorableRepostoryApi` for core CRUD operations (Create, Read, Update, Delete) and interacts with environment-specific API endpoints.  Key methods include `load` (by ID), `find` (by search key), `save`, `remove`, and `recent` (retrieves chunks based on query specifications).  All operations require a session key for authentication and construct URLs using the provided environment settings.  This class simplifies interacting with the chunk repository by handling API communication details.


**ChunkRepositoryApi.Types.ts**

This code defines TypeScript interfaces for a chunk storage system.  `IStoredEmbedding` stores vector embeddings with their model ID. `IStoredTextRendering` stores generated text and its model ID.  `IStoredChunk` is the core interface, holding the actual text chunk (`originalText`), its embedding (`storedEmbedding`), a generated summary (`storedSummary`), a generated title (`storedTitle`), related chunk IDs (`relatedChunks`), a parent chunk ID (`parentChunkId`), and a source URL (`url`).  It extends `IStorable`, suggesting a base interface for persistent storage.  The `storedChunkClassName` constant likely helps identify these objects in storage.  The code is well-documented, explaining each field's purpose.


**ClassifyApi.Types.ts**

This code defines TypeScript interfaces for a text classification API.  `IClassifyRequest` specifies the structure of requests, requiring `text` to classify and an array of possible `classifications`. `IClassifyResponse` outlines the response format, containing the resulting `classification` string. These interfaces enhance type safety when interacting with the classification API, helping developers catch errors early during development.  They are part of the `ClassifyApi.Types` module and copyrighted by Braid Technologies.


**Compress.ts**

This code defines a compression module using the `pako` library's deflate algorithm, working in both Node.js and browser environments.  `compressString` takes a string, encodes it to a Uint8Array, deflates it using `pako`, and returns a base64-encoded string.  `decompressString` reverses this process: it takes the base64-encoded string, decodes it based on the environment, inflates it using `pako`, and returns the original string.  Error handling is included in `decompressString` for invalid input.


**EmbedApi.Types.ts**

This code defines TypeScript interfaces for an Embed API, used for text embedding operations.  `IEmbedRequest` specifies the structure of requests, including a `persona` (from an enum `EPromptPersona`) and the `text` to embed.  `IEmbedResponse` describes the API's response, containing the resulting `embedding` as an array of numbers.  These interfaces clarify the data flow between clients and the embedding service, ensuring type safety and clear communication.  The code is copyrighted by Braid Technologies.


**EnrichedChunk.ts**

This code defines the core data structures for a Chunk API, used for storing and retrieving content based on semantic similarity.  `EChunkRepository` lists available storage locations (Boxer, Waterfall). `kDefaultSimilarityThreshold` sets a default relevance score of 0.5 for content retrieval.  The code also includes interfaces (not shown in this excerpt) for representing enriched chunks, which are the fundamental units of content, both in detailed (`IEnrichedChunk`) and summarized (`IEnrichedChunkSummary`) forms, and for specifying chunk retrieval queries (`IChunkQuerySpec`).


**EnrichedQuery.Api.Types.py**

This code defines Python type hints (TypedDicts) for various data structures used in a question-answering system.  It leverages the `ts2python` library to translate TypeScript types into Python.  The code includes types for enriched chunks of text with summaries and embeddings, relevance scores, query specifications for retrieving chunks, enriched query requests with conversation history, and question generation requests and responses.  It handles compatibility with different Python versions and optional dependencies like `typing_extensions` and `ts2python.typeddict_shim` for improved type checking.  Essentially, it sets up the data structures needed for the application to work with text chunks, queries, and generated questions.


**EnrichedQuery.Api.Types.ts**

This code defines interfaces for an AI-powered query API that handles enriched conversations.  It includes interfaces for chunks of text (`IEnrichedChunk`), including summarized versions (`IEnrichedChunkSummary`) and relevance scores (`IRelevantEnrichedChunk`).  It also specifies how to query for chunks (`IChunkQuerySpec` and extensions) based on different criteria.  The core interaction is represented by `IEnrichedQueryRequest` (holding conversation history, question, etc.) and `IEnrichedResponse` (containing the AI's answer and relevant chunks). Finally, interfaces for question generation (`IGenerateQuestionRequest` and `IQuestionGenerationResponse`) are also defined.  The code uses TypeScript interfaces for type safety.


**EnumerateModelsApi.Types.ts**

This code defines TypeScript interfaces for interacting with EnumerateModels and EnumerateRepositories APIs.  `IEnumerateModelsRequest` and `IEnumerateModelsResponse` handle requests and responses for listing available AI models, including IDs for default, large, and small models, along with their embedding IDs.  `IEnumerateRepositoriesRequest` and `IEnumerateReposotoriesResponse` manage requests and responses for listing available chunk repositories, with the response providing an array of repository IDs of type `EChunkRepository`. These interfaces facilitate communication with the APIs by specifying the expected data structures.


**Environment.ts**

This code defines three environment classes: `DevelopmentEnvironment`, `StagingEnvironment`, and `ProductionEnvironment`.  Each implements the `IEnvironment` interface, providing different API endpoints for various functionalities like summarization, classification, chunking, embedding, user activity tracking, and Fluid integration.  `DevelopmentEnvironment` points to `localhost` for testing, while `StagingEnvironment` and `ProductionEnvironment` use the same Azure website.  They differ in their boxerHome and Fluid API URLs, with Staging using a placeholder for now.  Each environment class provides methods to retrieve the appropriate URL for each API endpoint based on the environment.


**Errors.ts**

This code defines custom error classes for a Braid application.  Each class extends the base JavaScript `Error` object and provides specialized error types like `InvalidParameterError`, `ConnectionError`, and `EnvironmentError`.  Each custom error constructor takes an optional message string.  Crucially, they restore the prototype chain for proper TypeScript usage and log the error using either `logCoreError` or `logApiError` functions. This helps maintain consistent error handling and reporting throughout the application.  The commented-out section at the end suggests planned but currently unused error types.


**FindEnrichedChunkApi.ts**

The `FindEnrichedChunkApi` class provides methods to find enriched text chunks related to URLs or summaries.  It uses `axios` to make POST requests to API endpoints specified by an `IEnvironment` object.  The constructor requires an environment and a session key for authentication.  `findChunkFromUrl` retrieves a single chunk summary for a given URL.  `findRelevantChunksFromUrl` and `findRelevantChunksFromSummary` return arrays of relevant chunks based on a URL or summary query, respectively.  All methods handle errors and return empty results if API calls fail.


**FindThemeApi.Types.ts**

This code defines TypeScript types for a FindTheme API.  `IFindThemeRequest` specifies the structure of requests sent to the API, including `text` (the content to analyze) and `length`.  `IFindThemeResponse` describes the API's response, which contains the identified `theme` as a string.  These interfaces improve code clarity and maintainability by ensuring type safety when interacting with the FindTheme API.  The module-level comments and copyright notice provide additional context.


**Fluid.ts**

This code defines interfaces for Fluid Framework token authentication.  `IFluidUser` represents a user, including properties for local development and user ID/name. `IFluidTokenRequest`, extending `IFluidUser`, adds a `documentId` for token requests. `IFluidTokenResponse` represents the response, containing the generated `token`. These interfaces standardize data exchange for token-based authentication within the Fluid Framework, supporting both local and production environments.  They enable consistent handling of user information and document access.


**FluidApi.ts**

The `FluidApi` class provides a simplified way to generate Fluid Framework tokens.  It uses provided environment settings and a session key for authentication.  The core function, `generateToken`, takes a request object with `documentId`, `userId`, and `userName` and makes a POST request to a Fluid service endpoint.  It uses `axios` for HTTP requests and `axios-retry` to handle potential network issues or rate limiting with up to 5 retries.  The function returns the generated token if successful or `undefined` if an error occurs.  Error information is logged to the console.


**FluidTokenProvider.ts**

This code provides tools for connecting to Azure Fluid Relay services.  The `FluidTokenProvider` class handles token generation and management, interacting with a Fluid API endpoint.  `FluidConnectionConfig` sets up connection parameters like endpoint and tenant ID based on a provided environment (local or remote).  `FluidClientProps` combines these, packaging connection details for the Azure Fluid client.  The code supports authentication via session keys and user information, facilitating secure access to Fluid Relay.  It also offers flexibility in targeting different environments (local/production) for development and deployment.


**GeneratedBoxerPromptNames.ts**

This code defines string constants representing prompt IDs used to access prompts from a prompt repository.  `developerAssistantPromptId`, `developerImaginedAnswerGeneratorPromptId`, and `developerQuestionGeneratorPromptId` store UUIDs (Universally Unique Identifiers) for different prompt types.  The comment indicates this file is auto-generated and should not be manually modified.  These IDs likely serve as keys to retrieve specific prompt templates or configurations from a separate storage system.


**GeneratedPromptNames.ts**

This code defines a set of constants representing IDs for different types of prompts.  These IDs are likely used to retrieve specific prompts from a prompt repository.  The code emphasizes that this file is auto-generated and should not be manually modified. Each constant is assigned a unique UUID string, corresponding to a specific prompt function, such as summarizing articles, generating developer questions, or classifying articles by theme.  The `defaultPromptId` may serve as a fallback or general-purpose prompt.


**GeneratedSalonPromptNames.ts**

This code defines constants representing prompt IDs used for accessing specific prompts, like "code summarization" and "C4 diagram generation," from a prompt repository.  The IDs are UUID strings.  Crucially, this file is auto-generated, meaning developers shouldn't modify it manually; any changes should be made through the process that generates this file.  This approach centralizes prompt management and ensures consistency across the application.


**GeneratedWaterfallPromptNames.ts**

This code defines a set of constant string variables representing IDs for different prompts used in a prompt repository.  Each variable name clearly indicates the prompt's purpose, such as summarizing articles, classifying articles, finding themes, or summarizing surveys.  These IDs are likely used to retrieve the actual prompt content from a database or other storage.  The comment at the top emphasizes that this file is auto-generated and should not be manually modified.


**IEnvironment.ts**

This code defines an interface, `IEnvironment`, for managing environment-specific configurations in a Braid application.  It uses an enum `EEnvironment` to represent Local, Staging, and Production environments.  `IEnvironment` specifies methods to retrieve URLs for various API endpoints, including authentication, content operations (summarization, classification, embedding), activity tracking, chunk/page management, and integrations with services like LinkedIn and Fluid.  The `BRAID_ENVIRONMENT_KEY` constant likely holds the active environment setting.  This structure allows the application to easily switch between different environments without hardcoding URLs.


**IEnvironmentFactory.ts**

This code defines an environment factory that creates environment instances (Development, Staging, Production) based on the current context (browser, Node.js).  `getDefaultEnvironment()` returns a Production environment by default, or Development if running in Node.js with `BRAID_ENVIRONMENT` set to 'Local'. `getDefaultFluidEnvironment()` and `getDefaultLoginEnvironment()` prioritize a Development environment if running on `localhost` in a browser, otherwise defaulting to the standard default environment.  `getEnvironment()` allows explicit environment selection based on an `EEnvironment` enum value.


**IModelDriver.ts**

This code defines interfaces and enums for model-driven conversations.  `EModel` and `EModelProvider` specify model sizes and providers. `EModelConversationRole` defines roles like "system", "assistant", and "user".  `IModelConversationElement` structures individual messages with a role and content. `IModelConversationPrompt` combines conversation history and the current prompt.  `IEmbeddingModelDriver` and `IChatModelDriver` define interfaces for embedding and chat functionalities, respectively.  `ITextChunker` handles text chunking for different providers and models, including size estimations and fitting checks.  The code provides a structured approach to interacting with AI models in conversational contexts.


**IModelFactory.ts**

This code defines a model factory, `IModelFactory`, that creates instances of different AI models based on enums `EModel` (model size/type) and `EModelProvider` (provider like OpenAI or DeepSeek).  It offers default models (e.g., GPT4o for text chunking) via functions like `getDefaultTextChunker()` and `getDefaultChatModelDriver()`.  More specific model instantiation is handled by functions like `getTextChunker()`, `getEmbeddingModelDriver()`, and `getChatModelDriver()`, which take the model and provider type as arguments. The factory uses a switch statement to determine the appropriate model implementation based on the input parameters, abstracting the model creation details from the rest of the application.


**IPromptPersona.ts**

This code defines an enum `EPromptPersona` and an interface `IPromptPersona` for managing AI prompt personas used in summarization tasks.  `EPromptPersona` lists various persona types like `ArticleSummariser`, `CodeSummariser`, and `SurveySummariser`.  The `IPromptPersona` interface specifies a `name`, `systemPrompt`, and `userPrompt` for each persona. This structure allows developers to easily configure and switch between different prompting strategies for various summarization contexts by providing predefined persona types and a standardized structure for their configuration.


**IPromptPersonaFactory.ts**

This code defines a prompt persona factory, which retrieves and customizes prompts for various AI tasks.  It loads prompt templates from JSON files (Default, Boxer, Waterfall, Salon), categorized by functionality like code summarization, article analysis, developer assistance, and survey processing.  The `getChatPersona` function takes a persona type and user input, processes the corresponding template by replacing placeholders like word count and user input, and returns a formatted prompt object.  Helper functions handle specific prompt types, like classifiers and C4 diagram generators, managing their unique placeholders.  The factory uses a repository to manage loaded prompts and provides default values for parameters like word count.


**IPromptRepository.ts**

This code defines a system for managing and retrieving AI prompts.  It uses interfaces (`IStoredPrompt`, `IPromptRepository`) to define how prompts are stored and accessed.  `IStoredPrompt` describes the structure of a prompt, including metadata. `IPromptRepository` provides an abstraction for retrieving prompts by ID.  A concrete implementation, `PromptFileRepository`, loads prompts from a JSON file.  Additionally, the `replacePromptPlaceholders` function substitutes placeholders within prompt templates with provided values. A second implementation, `PromptInMemoryRepository`, allows for prompts to be stored in memory.


**IStorable.ts**

This code defines interfaces and types for persistent storage.  The `IStorable` interface outlines the structure of storable objects, including an ID, application ID, timestamps, and a schema version.  `EStorableApplicationIds` is an enum listing the supported applications.  The `IStorableMultiQuerySpec` and `IStorableQuerySpec` interfaces specify search criteria for retrieving multiple and single records, respectively, while `IStorableOperationResult` indicates operation success.  These components ensure consistent data storage and retrieval across different applications.


**Logging.ts**

This JavaScript module provides logging utilities for different application areas: core system, database, and API.  It defines four functions: `logCoreError`, `logDbError`, and `logApiError` for logging errors, and `logApiInfo` for informational API logs. Each function accepts a description and details argument, outputting a formatted error or info message to the console.  This module promotes consistent logging and simplifies debugging by categorizing logs by domain.


**LoginApi.ts**

The `LoginApi` class handles user login via LinkedIn.  It extends a base `Api` class, using provided environment settings and a session key.  The core function, `login()`, makes a POST request to a LinkedIn API endpoint.  A successful login (status 200) returns "Redirecting...". Errors during the API call are logged to the console, and an empty string is returned.  The class uses `axios` for HTTP requests and relies on interfaces like `IEnvironment` for configuration.


**LooseObject.ts**

This code defines a TypeScript interface called `LooseObject`.  It uses an index signature (`[key: string]: any`) to allow any string as a key and any data type as its value.  This creates a flexible, schema-less object type.  Essentially, a `LooseObject` can hold arbitrary key-value pairs, making it useful for situations where the structure of the data isn't known beforehand.  This is similar to a JavaScript object literal or a Python dictionary.


**ModelDrivers.DpSk.ts**

This code provides a DeepSeek-specific implementation for interacting with language models.  It defines a `DeepSeekR1ChatModelDriver` that uses the Groq SDK to communicate with DeepSeek's "deepseek-r1-distill-llama-70b" model. The driver generates responses based on a provided persona, prompt, and parameters.  Helper functions `stripTextBetweenThink` and `stripLeadingCRLF` clean the model's output by removing content within `<think>` tags and leading carriage return/line feed characters. The `chat` function constructs the conversation history for the model, sends the request to DeepSeek via the Groq SDK, and returns the processed response.  Initialization parameters for the model and text chunking are also defined.


**ModelDrivers.OpAi.ts**

This code provides drivers for interacting with OpenAI's embedding and chat models, specifically through Azure OpenAI.  `OpenAIEmbeddingModelDriver` calculates text embeddings using a specified deployment.  `OpenAIChatModelDriver` handles chat interactions, generating responses based on conversation history and a chosen persona.  Both leverage `axios` for API calls and implement retry logic for handling rate limits.  Additionally, `OpenAITextChunker` helps manage text splitting for optimal model input, considering context window sizes and optional overlap.  Helper functions like `calculateEmbedding` and `chat` abstract the API interaction details.  Several initialization classes offer pre-configured settings for different OpenAI model variants.


**PageRepositoryApi.ts**

The `PageRepositoryApi` class manages saving and compressing page data.  It uses the `StorableRepositoryApi` for storage operations, sending data to a URL defined by the `IEnvironment`.  The constructor requires an environment and session key.  The `save` method takes an `IStorable` object and saves it after authentication.  It includes `compressString` and `decompressString` methods for efficient storage, utilizing a deflate algorithm and Base64 encoding. This class implements `IStorablePageRepostoryApiWrapper` and extends the base `Api` class.


**PageRepositoryApi.Types.ts**

This code defines TypeScript interfaces for a PageRepository API.  `IStoredPage` represents a web page, containing its HTML content (`html`). It extends `IStorable`, suggesting a generic storage mechanism.  `IStoredPageRequest` and `IStoredPageResponse` are interfaces for API requests and responses respectively. They exist primarily to aid code generation for testing, with the request extending  `IStorableQuerySpec` to support queries.  The module aims to provide type-safe interactions with the PageRepository.


**QueryEnrichedModelApi.ts**

The `QueryModelApi` class provides an interface for querying models with data enrichment and generating questions.  It uses `axios` to make `POST` requests to specified API endpoints.  The constructor takes an `IEnvironment` object and a session key for authentication.  `queryModelWithEnrichment` sends an enrichment query and returns the response or `undefined` if an error occurs.  `generateQuestion` sends a question generation request, returning the generated question or `undefined` on error. Both methods handle HTTP errors and log them to the console.


**SessionApi.ts**

The `SessionApi` class manages user sessions and authentication.  It extends a base `Api` class and uses Axios to make API calls.  The constructor takes an environment and a session key.  The core function, `checkSessionKey`, sends a POST request to a session API endpoint to validate the provided key.  A successful response (status 200) returns the response data. Errors, including non-200 statuses and exceptions, are logged to the console, and an empty string is returned.


**StorableRepositoryApi.ts**

This code defines a `StorableRepostoryApi` class for interacting with a data repository.  It uses `axios` to make HTTP requests for saving, removing, loading, finding, and retrieving recent records.  The API interacts with objects implementing the `IStorable` interface.  Several interfaces, like `IStorableRepostoryApiWrapper` and `IStorablePageRepostoryApiWrapper`, define contracts for repository interactions.  Each method in `StorableRepostoryApi` takes a URL for flexibility.  Error handling is included with console logging for debugging.  The code supports querying by ID and `functionalSearchKey`.


**StudioApi.Types.ts**

This code defines TypeScript interfaces for the Studio API, specifically for requests and responses related to the "Studio Boxer" feature.  `IStudioBoxerRequest` specifies that boxer requests must contain a `question` string.  `IStudioBoxerResponseEnrichment` describes the structure of enrichment data included in boxer responses. This enrichment data may include an `id`, `summary`, optional `title`, `url`, and `iconUrl`. These interfaces ensure type safety when interacting with the Studio API.


**SummariseApi.ts**

The `SummariseApi` class provides text summarization functionality using a backend service.  It extends a base `Api` class, inheriting authentication and environment management.  The `summarise` method allows text summarization with different personas, while `summariseContext` adds context-aware summarization. Both methods send POST requests to specific API endpoints, handling responses and potential errors.  The class uses TypeScript interfaces for type safety and relies on `axios` for HTTP communication.


**SummariseApi.Types.ts**

This code defines TypeScript interfaces for a text summarization API.  `ISummariseRequest` specifies the persona, text input, and optional word count for a summary. `ISummariseContextRequest` adds a `context` and `chunk` field, likely for processing text in segments.  `ISummariseResponse` simply contains the generated `summary` string.  These interfaces, part of the `SummariseApi.Types` module, ensure type safety for the API's operations.  The `EPromptPersona` enum, imported from another file, likely dictates the style or tone of the summaries.


**TestForSummariseFailApi.Types.ts**

This code defines types for a "TestForSummariseFail" API.  `ITestForSummariseFailRequest` specifies the structure of requests, including `text` (required) and an optional `lengthInWords`.  The `ETestForSummariseFail` enum defines possible validation outcomes: `kSummaryFailed` or `kSummarySucceeded`.  `ITestForSummariseFailResponse` indicates the validation result using the `isValidSummary` field, which holds one of the enum values.  These types ensure type-safe validation of generated summaries within the associated `TestForSummariseFailApi` module.


**ThemeApi.ts**

This code defines the data structures for a theme detection API.  The `ThemeApi` module provides types for requests and responses related to finding themes.  The core interface, `IFindThemeRequest`, specifies the criteria for a theme search.  It includes `text` (the input string) and `length` (likely desired theme length or some related metric). This structure ensures type safety when making requests to analyze and identify themes within text content.  It's part of Braid Technologies' code, copyrighted in 2024 and 2025.


Generated by Salon from Braid Technologies, 28/02/2025