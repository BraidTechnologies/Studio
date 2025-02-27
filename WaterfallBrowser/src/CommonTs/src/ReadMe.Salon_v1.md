**ActivityRepositoryApi.ts**

The `ActivityRepositoryApi` class provides a wrapper for interacting with an activity record repository.  It uses a `StorableRepositoryApi` instance to handle standard CRUD operations (Create, Read, Update, Delete) like loading, finding, saving, and removing activity records.  Each function constructs the appropriate API URL using the provided environment and session key.  The class implements the `IStorableRepostoryApiWrapper` interface and extends the base `Api` class.  It simplifies access to activity data by abstracting away the underlying API calls.


**Api.ts**

This code defines a base API class for interacting with a specified environment using a provided session key.  It uses the `axios` library for making HTTP requests.  The `Api` class stores the environment and session key privately, providing public getter methods for access.  It serves as a superclass for other API classes, offering common properties and methods like `environment` and `sessionKey`, but doesn't implement any specific API functionality itself.  It depends on an `IEnvironment` interface. This structure promotes code reuse and consistency across different API interactions.


**Asserts.ts**

This code defines a TypeScript module called `Asserts` that provides helper functions for runtime type checking.  It includes `throwIfUndefined`, `throwIfNull`, and `throwIfFalse`, each designed to throw an `AssertionFailedError` if a given condition isn't met.  These functions also use TypeScript's `asserts` keyword to narrow down the type of the variable after a successful check, improving type safety.  For example, after calling `throwIfUndefined`, the TypeScript compiler knows the variable is not undefined.  The `AssertionFailedError` is imported from a custom `Errors` module.


**ChunkApi.Types.ts**

This code defines TypeScript interfaces for a Chunk API used in text splitting.  `IChunkRequest` specifies the input: `text` (required), `chunkSize` (in tokens), and `overlapWords` (between chunks).  `IChunkResponse` defines the output: an array of string `chunks`.  These interfaces clarify the expected data structure for requests and responses when interacting with the Chunk API, which segments text into smaller pieces with optional size and overlap control.


**ChunkRepositoryApi.ts**

The `ChunkRepositoryApi` class provides a wrapper for interacting with a text chunk storage API.  It handles standard CRUD operations (Create, Read, Update, Delete) for text chunks, including loading, finding, saving, removing, and retrieving recent chunks.  It uses a `StorableRepostoryApi` for core functionality and relies on an `IEnvironment` object for API endpoint URLs and a session key for authentication.  Each API call constructs the appropriate URL with the session key and leverages the underlying `StorableRepostoryApi` methods for communication.


**ChunkRepositoryApi.Types.ts**

This code defines TypeScript interfaces for a chunk storage system.  `IStoredEmbedding` stores vector embeddings with their model ID. `IStoredTextRendering` stores generated text with its model ID.  `IStoredChunk` is the core interface, holding the actual text chunk (`originalText`), its embedding (`storedEmbedding`), a generated summary and title (`storedSummary`, `storedTitle`), a URL if applicable, and IDs of related chunks (`relatedChunks`).  It also includes a `parentChunkId` to link chunks to a parent document.  These interfaces ensure consistent data structure for storing and managing text fragments and their associated metadata.


**ClassifyApi.Types.ts**

This code defines TypeScript interfaces for a text classification API.  `IClassifyRequest` specifies the structure of requests, requiring `text` to classify and an array of possible `classifications`.  `IClassifyResponse` describes the API's response, containing the resulting `classification`. These interfaces, part of the `ClassifyApi.Types` module, improve type safety and code clarity when interacting with the classification system.  They are copyrighted by Braid Technologies.


**Compress.ts**

This code defines a compression module using the `pako` library's deflate algorithm, working in both Node.js and browsers.  `compressString` takes a string, encodes it to a Uint8Array, deflates it using `pako`, and returns a base64-encoded string.  The encoding differs slightly between Node.js (using `Buffer`) and browser (using `btoa`). `decompressString` reverses this process: it decodes the base64 string, inflates the data using `pako`, and returns the original string.  Error handling is included for invalid input.


**EmbedApi.Types.ts**

This code defines TypeScript interfaces for an Embed API, used for generating text embeddings.  `IEmbedRequest` specifies the input: `persona` (an enum from `IPromptPersona`) and the `text` string to embed.  `IEmbedResponse` describes the output: an `embedding` represented as a numerical array.  These interfaces clarify the data exchanged between clients and the embedding service, facilitating communication and ensuring type safety.  The code is copyrighted by Braid Technologies.


**EnrichedChunk.ts**

This code defines the core data structures for a Chunk API, used for managing content chunks based on semantic similarity.  It introduces TypeScript types and interfaces for representing these chunks, including `IEnrichedChunk` (full chunk with embeddings) and `IEnrichedChunkSummary` (simplified representation).  `EChunkRepository` lists available storage locations (Boxer, Waterfall).  `kDefaultSimilarityThreshold` sets a default relevance score of 0.5 for chunk retrieval.  This module provides the basic building blocks for storing and querying content chunks.


**EnrichedQuery.Api.Types.py**

This code defines TypeScript interfaces using Python's `typing` module for type hinting.  It imports necessary modules for type annotations, including handling optional dependencies for TypedDicts.  The code primarily defines several TypedDicts representing data structures like `IEnrichedChunk`, `IChunkQuerySpec`, and `IEnrichedQueryRequest`. These TypedDicts specify the expected types for various fields, such as URLs, text summaries, embeddings, and relevance scores.  The code also includes compatibility measures for different Python versions and handles potential import errors gracefully.  Essentially, this code translates TypeScript interfaces into Python for static type checking purposes.


**EnrichedQuery.Api.Types.ts**

This code defines interfaces for an AI-powered query API that handles enriched conversations.  It outlines structures for requests and responses, including conversation elements, chunk management, and question generation.  `IEnrichedChunk` represents a chunk of text with an ID and embedding, while `IEnrichedChunkSummary` provides a client-friendly version.  `IEnrichedQueryRequest` specifies how to query, including repository, thresholds, and conversation history. `IEnrichedResponse` encapsulates the AI's answer and relevant chunks.  The code also supports generating questions from summaries using `IGenerateQuestionRequest` and `IQuestionGenerationResponse`.  These interfaces ensure type safety across the application.


**EnumerateModelsApi.Types.ts**

This code defines TypeScript interfaces for the EnumerateModels and EnumerateRepositories APIs. `IEnumerateModelsRequest` and `IEnumerateModelsResponse` handle requests and responses for listing available AI models, providing IDs for default, large, and small models, along with their embedding IDs.  `IEnumerateRepositoriesRequest` and `IEnumerateReposotoriesResponse` manage requests and responses for listing available chunk repositories, returning an array of repository IDs of type `EChunkRepository`. These interfaces facilitate structured data exchange for these operations.


**Environment.ts**

This code defines three environment classes: `DevelopmentEnvironment`, `StagingEnvironment`, and `ProductionEnvironment`.  Each class implements the `IEnvironment` interface and provides methods for accessing various API endpoints.  These endpoints cover functionality such as session management, summarization, classification, chunking, embedding, activity tracking, LinkedIn login, and Fluid integration.  The main difference between the classes is the base URL used for the API endpoints: `localhost` for development, and `braid-api.azurewebsites.net` for both staging and production.  The Fluid API endpoint and tenant ID are consistent across all environments, however the `boxerHome()` endpoint differs for Development.


**Errors.ts**

This code defines custom error classes for a Braid application, extending the base JavaScript `Error` class.  Each class, like `InvalidParameterError`, `ConnectionError`, and `EnvironmentError`, targets a specific error category.  They ensure proper error handling within TypeScript by restoring the prototype chain and logging errors using `logCoreError` or `logApiError`.  This standardized approach helps in debugging by providing informative stack traces and logged error messages.  The commented-out section shows examples of additional custom error classes that could be implemented.


**FindEnrichedChunkApi.ts**

The `FindEnrichedChunkApi` class provides methods to find information chunks enriched with metadata.  It uses `axios` to make `POST` requests to API endpoints specified by an `IEnvironment` object.  A session key is required for authentication.  The API can find a single chunk summary by URL,  find relevant chunks by URL, and find relevant chunks based on a summary query. Each method returns data if the request is successful (status 200) or an empty array/undefined if it fails, logging the error to the console.


**FindThemeApi.Types.ts**

This code defines TypeScript types for the FindTheme API, which analyzes text and identifies its main theme.  `IFindThemeRequest` specifies the input: `text` (the content to analyze) and `length` (likely a maximum character limit).  `IFindThemeResponse` specifies the output: `theme` (the identified primary theme as a string). These interfaces clarify the expected data structure for requests and responses when interacting with the FindTheme API.  The copyright notice indicates ownership by Braid Technologies.


**Fluid.ts**

This code defines interfaces for Fluid Framework token authentication.  `IFluidUser` represents a user, including properties for local development, user ID, and username. `IFluidTokenRequest`, extending `IFluidUser`, adds a `documentId` property for token requests. `IFluidTokenResponse` represents the token response, containing the generated `token`. These interfaces facilitate secure communication between client applications and the Fluid service, handling user identification and document access.  They support both local and production environments, indicated by the `local` property in `IFluidUser`.


**FluidApi.ts**

The `FluidApi` class provides a simplified way to generate Fluid Framework tokens.  It uses provided environment settings and a session key for authentication.  The core function, `generateToken`, accepts a request object with document, user, and username details.  It makes a POST request to a Fluid service endpoint, using axios.  The function includes retry logic for handling network issues or rate limiting (429 errors), attempting up to five retries with exponential backoff.  A successful response (status 200) returns the generated token; otherwise, it logs the error and returns undefined.


**FluidTokenProvider.ts**

This code provides tools for connecting to Azure Fluid Relay services.  The `FluidTokenProvider` class handles token generation and management, interacting with a Fluid API endpoint.  `FluidConnectionConfig` manages connection settings like endpoint and tenant ID, using the token provider for authentication.  `FluidClientProps` bundles connection configurations for the Fluid client.  The code supports local and remote environments, configurable via environment settings, and uses session keys for authentication.  It leverages the `@fluidframework/azure-client` library for core Fluid functionality.


**IEnvironment.ts**

This code defines the `IEnvironment` interface and related types for configuring different Braid application environments (Local, Staging, Production).  `EEnvironment` enum lists the possible environments. The `IEnvironment` interface specifies methods to get environment-specific URLs for various API endpoints, including authentication, content operations (summarization, classification, embedding), activity tracking, chunk/page management, and integrations with services like LinkedIn and Fluid.  The `BRAID_ENVIRONMENT_KEY` constant likely holds the currently active environment. This structure allows the application to easily switch between different environments without hardcoding URLs.


**IEnvironmentFactory.ts**

This code defines an environment factory that creates environment instances (Development, Staging, Production) based on the current context (browser, Node.js) and configuration.  `getDefaultEnvironment()` returns a Production environment by default, or Development if running in Node.js with `BRAID_ENVIRONMENT` set to 'Local'.  `getDefaultFluidEnvironment()` and `getDefaultLoginEnvironment()` return the default environment unless running on localhost in the browser, in which case they return a Development environment. `getEnvironment()` allows explicit environment selection based on an `EEnvironment` enum value.


**IModelDriver.ts**

This code defines interfaces and enums for model-driven conversations.  It establishes roles (system, assistant, user) for conversation participants and structures for individual messages (`IModelConversationElement`) and entire conversation contexts (`IModelConversationPrompt`).  Enums specify model sizes (`EModel`) and providers (`EModelProvider`).  The `IChatModelDriver` interface outlines a `generateResponse` function, accepting a persona, prompt, and optional parameters.  The `IEmbeddingModelDriver` interface handles text embedding. Finally, the `ITextChunker` interface manages aspects of text chunking for different providers and models.


**IModelFactory.ts**

This code defines a model factory, `IModelFactory`, that creates instances of different AI models based on enums `EModel` (model size) and `EModelProvider` (provider like OpenAI or DeepSeek).  It provides default models for text chunking, embedding, and chat.  The `get` functions return specific model drivers based on input enums.  For example, `getTextChunker` can return different OpenAI text chunkers (GPT4o, GPT4o-Mini, or based on O1) or a DeepSeekR1 chunker. Similarly, other `get` functions provide corresponding embedding and chat model drivers from chosen providers.  The factory simplifies model instantiation and hides implementation details.


**IPromptPersona.ts**

This code defines an enum `EPromptPersona` and an interface `IPromptPersona` for managing AI prompt personas used in summarization tasks.  `EPromptPersona` lists various persona types like `ArticleSummariser`, `CodeSummariser`, and `SurveySummariser`.  The `IPromptPersona` interface specifies a `name`, `systemPrompt`, and `itemPrompt` for each persona. This structure allows developers to configure different prompts for system-level instructions and individual item processing during summarization, enabling specialized behavior for different content types.


**IPromptPersonaFactory.ts**

This code defines a module for generating AI prompt personas for different summarization tasks (articles, code, surveys).  It exports predefined persona templates like `CodeSummariserPersona` and a `getChatPersona` function. This function takes a persona type, user prompt, and parameters (like word count) as input.  Inside `getChatPersona`, a `switch` statement selects the appropriate persona template. It then populates the `systemPrompt` and `itemPrompt` fields of the chosen template based on the provided parameters and user prompt, returning the configured persona.  Each persona's `systemPrompt` instructs the AI on its role and desired output format.


**IStorable.ts**

This code defines interfaces and types for persistent storage.  The `IStorable` interface outlines the structure of storable objects, including an ID, application ID, timestamps, and a schema version.  `EStorableApplicationIds` is an enum listing the supported applications.  The code also provides interfaces for querying stored objects: `IStorableQuerySpec` for single-record queries by ID or functional search key, `IStorableMultiQuerySpec` for multiple-record queries with a limit and class name filter, and `IStorableOperationResult` indicating operation success.  This module aims to standardize data storage across different applications.


**Logging.ts**

This code provides a logging module with functions for logging errors and information related to different application areas: core system, database, and API.  Each function (`logCoreError`, `logDbError`, `logApiError`, and `logApiInfo`) accepts a description and details argument, which are then formatted and output to the console.  This module promotes consistent logging throughout the application and helps categorize errors by domain for easier debugging.  It uses `console.error` for errors and `console.log` for informational API logs.


**LoginApi.ts**

The `LoginApi` class handles user login via LinkedIn.  It extends a base `Api` class, using provided environment settings (`IEnvironment`) and a session key.  The core function, `login()`, makes a POST request to a LinkedIn login endpoint.  A successful login (status 200) returns "Redirecting...". Errors during the API call are logged to the console, and an empty string is returned.  The class uses `axios` for HTTP requests.


**LooseObject.ts**

This code defines a TypeScript interface called `LooseObject`.  It uses an index signature (`[key: string]: any`) to allow any string as a key and any data type as its value.  This creates a flexible, schema-less object type.  Essentially, a `LooseObject` can hold arbitrary key-value pairs, making it useful for situations where the structure of the data isn't known beforehand.  The comments explain the purpose and usage of this type alias.


**ModelDrivers.DpSk.ts**

This code implements a DeepSeek chat model driver for text embedding and chat responses.  It defines classes for initialization and the driver itself, adhering to interfaces like `IChatModelDriver`. The `DeepSeekR1ChatModelDriver` uses the Groq SDK to interact with the DeepSeek API. The `chat` function constructs the conversation messages, including system, user, and historical context, then sends them to the DeepSeek API for completion.  Helper functions `stripTextBetweenThink` and `stripLeadingCRLF` clean the output by removing internal processing tags and leading whitespace.  The module supports different prompt personas through the `IPromptPersona` interface and uses environment variables for the Groq API key.


**ModelDrivers.OpAi.ts**

This code provides drivers for interacting with OpenAI's embedding and chat models, specifically through Azure OpenAI.  `OpenAIEmbeddingModelDriver` calculates text embeddings using a specified deployment.  `OpenAIChatModelDriver` handles chat interactions, supporting different personas and managing conversation history.  Both drivers use `axios` for API calls and implement retry logic for handling rate limits.  The code also includes `OpenAITextChunker` to split text into manageable chunks for processing, considering token limits and optional overlap.  Several interfaces and initialization classes offer configuration options for different OpenAI model deployments and sizes.


**PageRepositoryApi.ts**

The `PageRepositoryApi` class manages saving and compressing page data.  It extends the `Api` class and implements the `IStorablePageRepositoryApiWrapper` interface.  The constructor takes an environment and session key, initializing a `StorableRepositoryApi` object. The `save` method saves a given `IStorable` record by calling the `save` method of the internal `StorableRepositoryApi` instance, using a URL constructed from the environment and session key.  It also provides `compressString` and `decompressString` methods for efficient storage.  Notably, loading is handled directly by the browser, so no `load` method is provided.


**PageRepositoryApi.Types.ts**

This code defines TypeScript interfaces for a PageRepository API.  `IStoredPage` represents a web page, containing its HTML content and inheriting storage-related properties from `IStorable`.  `IStoredPageRequest` and `IStoredPageResponse` specify the input and output types for API operations, extending `IStorableQuerySpec` and `IStoredPage` respectively. These interfaces, part of the `PageRepositoryApi.Types` module, aim to provide type safety for page storage and retrieval.  They also aid code generation for testing purposes.


**QueryEnrichedModelApi.ts**

The `QueryModelApi` class provides an interface for querying models and generating questions.  It uses Axios to make POST requests to specified API endpoints.  The constructor takes an environment and session key for authentication. `queryModelWithEnrichment` sends an enriched query request and returns an enriched response or undefined if an error occurs.  `generateQuestion` sends a request containing persona, question generation prompt, and summary information, returning a generated question response or undefined upon error. Both methods handle HTTP errors and log error messages to the console.


**SessionApi.ts**

The `SessionApi` class manages user sessions and authentication.  It extends a base `Api` class and uses Axios to make HTTP requests.  The constructor takes an environment configuration and a session key.  The core function, `checkSessionKey`, sends a POST request to a session API endpoint to validate the provided key.  A successful response (status 200) returns the response data.  Errors are logged to the console, and an empty string is returned if the session key is invalid or a network error occurs.


**StorableRepositoryApi.ts**

This code defines a `StorableRepostoryApi` class for interacting with a persistent storage service.  It uses `axios` to make HTTP requests for saving, removing, loading, finding, and retrieving recent records.  The API interacts with "storable" objects implementing the `IStorable` interface.  Several interfaces, such as `IStorableRepostoryApiWrapper` and `IStorablePageRepostoryApiWrapper`, define contracts for different repository interactions.  Each method in `StorableRepostoryApi` takes a URL, indicating a flexible approach to targeting different storage endpoints.  Error handling and logging are included within each asynchronous method.


**StudioApi.Types.ts**

This code defines TypeScript interfaces for the Studio API, specifically for requests and responses related to the "Studio Boxer" feature.  `IStudioBoxerRequest` specifies that boxer requests must contain a `question` string. `IStudioBoxerResponseEnrichment` describes the enriched data returned in a response, including an `id`, `summary`, optional `title`, `url`, and `iconUrl`. These interfaces enhance type safety when interacting with the Studio API.  The comments explain the module's purpose and the role of each interface.


**SummariseApi.ts**

The `SummariseApi` class provides text summarization functionality using a backend service.  It extends a base `Api` class, inheriting authentication and environment management.  The `summarise` method allows summarization with a specified persona (e.g., article, bullet points), while `summariseContext` adds context-aware summarization.  Both methods send POST requests to specific API endpoints, handling responses and potential errors.  The class utilizes TypeScript interfaces for type safety and `axios` for HTTP communication.


**SummariseApi.Types.ts**

This code defines TypeScript interfaces for a text summarization API.  `ISummariseRequest` specifies the structure for summarizing text directly, requiring a persona and the text itself, with an optional word count. `ISummariseContextRequest` adds a `context` field, presumably for summarizing chunks of text within a larger context.  Both request types use an enum `EPromptPersona` (defined elsewhere) to define the summarization style. `ISummariseResponse` simply provides the resulting summary string. These interfaces ensure type safety when interacting with the summarization API.


**TestForSummariseFailApi.Types.ts**

This code defines types for a "TestForSummariseFail" API.  The `ITestForSummariseFailRequest` interface specifies the structure of requests, including `text` and an optional `lengthInWords`.  The `ETestForSummariseFail` enum defines two possible validation outcomes: `kSummaryFailed` or `kSummarySucceeded`.  The `ITestForSummariseFailResponse` interface structures the API response, containing the `isValidSummary` field, which holds an `ETestForSummariseFail` value indicating the validation result.  These types ensure type-safe validation of generated summaries.


**ThemeApi.ts**

This code defines the data structures for a FindTheme API, specifically the `IFindThemeRequest` interface.  The `ThemeApi` module aids in theme detection and analysis.  `IFindThemeRequest` specifies the criteria for finding a theme within a text.  It includes two properties: `text` (the input string to analyze) and `length` (presumably the desired length of the returned theme or related data).  This interface enforces type safety for theme-related operations.  The comments thoroughly document the module and interface purpose.


Generated by Salon from Braid Technologies, 27/02/2025