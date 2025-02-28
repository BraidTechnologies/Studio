**ActivityRepositoryApi.ts**

The `ActivityRepositoryApi` class provides a wrapper for interacting with an activity records API.  It uses a `StorableRepositoryApi` instance to handle common CRUD operations like loading, finding, saving, and removing activity records.  Each function constructs the appropriate API URL using the provided environment and session key.  The class implements the `IStorableRepostoryApiWrapper` interface and extends the base `Api` class.  It simplifies access to activity data by abstracting away the underlying API calls.


**Api.ts**

This TypeScript code defines an abstract `Api` base class for interacting with APIs. It uses `axios` for requests and depends on an `IEnvironment` interface.  The `Api` class stores the environment and a session key, providing access to them via getter methods.  It serves as a foundation for specific API classes, handling common properties like authentication and environment details.  Subclasses would implement actual API interaction logic.  The code is well-documented with comments explaining the purpose and usage.


**Asserts.ts**

This code defines a TypeScript module called `Asserts` which provides helper functions for runtime type checking.  It includes `throwIfUndefined`, `throwIfNull`, and `throwIfFalse`. Each function takes a value and throws an `AssertionFailedError` if the value is undefined, null, or false respectively.  These functions also use TypeScript's `asserts` keyword to narrow the type of the variable after a successful check, improving type safety.  The `AssertionFailedError` is imported from a custom `Errors` module.


**ChunkApi.Types.ts**

This code defines TypeScript interfaces for a Chunk API used in text segmentation.  `IChunkRequest` specifies the input: `text` (required), `chunkSize` in tokens, and `overlapWords` between chunks (both optional). `IChunkResponse` defines the output: an array of text `chunks`.  The API allows developers to split text into smaller pieces with configurable chunk sizes and overlap, facilitating text processing operations.  The module is documented for developers and includes copyright information for Braid Technologies.


**ChunkRepositoryApi.ts**

The `ChunkRepositoryApi` class provides a wrapper for managing text chunks stored in a repository.  It uses the `Api` base class and implements the `IStorableRepostoryApiWrapper` interface for standard CRUD operations (create, read, update, delete).  Key functionalities include loading, finding, saving, removing, and retrieving recent chunks.  Each function interacts with environment-specific API endpoints, using a provided session key for authentication.  Internally, it leverages a `StorableRepostoryApi` instance to handle the core API interactions.


**ChunkRepositoryApi.Types.ts**

This code defines TypeScript interfaces for a chunk storage system.  `IStoredEmbedding` stores vector embeddings with a model ID. `IStoredTextRendering` stores generated text with its model ID.  `IStoredChunk` is the core interface, holding the actual text chunk (`originalText`), its embedding (`storedEmbedding`), a generated summary (`storedSummary`), a title (`storedTitle`), related chunk IDs (`relatedChunks`), a parent chunk ID (`parentChunkId`), and a source URL (`url`).  It extends `IStorable`, suggesting a standardized storage mechanism.  These types facilitate organized storage and retrieval of text chunks and their associated metadata.


**ClassifyApi.Types.ts**

This code defines TypeScript interfaces for a text classification API.  `IClassifyRequest` specifies the structure of requests, requiring `text` to classify and an array of possible `classifications`.  `IClassifyResponse` describes the API's response, containing the resulting `classification` string. These interfaces improve type safety when interacting with the classification API, ensuring that requests and responses conform to expected structures.  They are part of the `ClassifyApi.Types` module and copyrighted by Braid Technologies.


**Compress.ts**

This code defines a compression module using the `pako` library's deflate algorithm, working in both Node.js and browser environments.  `compressString` takes a string, encodes it to a Uint8Array, deflates it using `pako`, and returns a base64-encoded string.  The encoding method differs slightly between Node.js (using `Buffer`) and browsers (using `btoa`). `decompressString` reverses this process, decoding the base64, inflating the data with `pako`, and returning the original string.  Error handling is included for invalid input.


**EmbedApi.Types.ts**

This code defines TypeScript interfaces for an Embed API, which handles text embedding.  `IEmbedRequest` specifies the structure of requests, including a `persona` (using the `EPromptPersona` enum) and the `text` to embed.  `IEmbedResponse` describes the response, containing an `embedding` represented as an array of numbers.  These interfaces ensure clear communication between clients and the embedding service by defining the expected data structures.  The code is part of a larger project with copyright attributed to Braid Technologies.


**EnrichedChunk.ts**

This code defines the core data structures for a Chunk API, which handles semantically similar content chunks.  It introduces TypeScript types and interfaces for managing these chunks. `EChunkRepository` lists available storage locations (Boxer, Waterfall). `IEnrichedChunk` and `IEnrichedChunkSummary` represent detailed and simplified chunk versions, respectively.  `IChunkQuerySpec` defines parameters for retrieving chunks.  A default similarity threshold of 0.5 is set for relevance filtering.  The code establishes the basic building blocks for storing, querying, and retrieving content chunks based on semantic meaning.


**EnrichedQuery.Api.Types.py**

This code defines Python type hints (TypedDicts) for various data structures used in a question-answering system.  It leverages the `ts2python` library to translate TypeScript types into Python.  Several TypedDicts represent chunks of text with summaries, embeddings, and relevance scores (`IEnrichedChunk`, `IRelevantEnrichedChunk`). Others specify query parameters for retrieving chunks (`IChunkQuerySpec`, `IChunkQueryRelevantTo...Spec`).  The code also defines types for question generation requests and responses (`IGenerateQuestionRequest`, `IQuestionGenerationResponse`) and for enriched query requests and responses which include relevant chunks and an answer (`IEnrichedQueryRequest`, `IEnrichedResponse`).  The code handles compatibility with different Python versions and optional dependencies.


**EnrichedQuery.Api.Types.ts**

This code defines TypeScript interfaces for an AI-powered query API.  It centers around enriching conversations with relevant chunks of information.  `IEnrichedChunk` represents a chunk of text with an ID, embedding, URL, full text, and summary.  `IEnrichedQueryRequest` specifies how to query, including repository, similarity threshold, conversation history, and the question itself.  `IEnrichedResponse` returns an answer and relevant chunks.  The code also supports generating questions from summaries using `IGenerateQuestionRequest` and receiving them via `IQuestionGenerationResponse`.  Several interfaces cater to different query specifications and chunk relevance scoring.  The interfaces ensure type safety across the application when dealing with AI-driven conversations and queries.


**EnumerateModelsApi.Types.ts**

This code defines TypeScript interfaces for the EnumerateModels and EnumerateRepositories APIs. `IEnumerateModelsRequest` and `IEnumerateModelsResponse` handle requests and responses for listing available AI models, providing IDs for default, large, and small models, along with their embedding IDs.  `IEnumerateRepositoriesRequest` and `IEnumerateReposotoriesResponse` manage requests and responses for listing available chunk repositories. The `IEnumerateReposotoriesResponse` includes an array of `EChunkRepository` enums representing the repository IDs.  These interfaces clarify the expected data structures for interacting with these APIs.


**Environment.ts**

This code defines three environment classes: `DevelopmentEnvironment`, `StagingEnvironment`, and `ProductionEnvironment`.  Each implements the `IEnvironment` interface, providing different API endpoint URLs based on the deployment environment.  `DevelopmentEnvironment` points to `localhost` for local development.  `StagingEnvironment` and `ProductionEnvironment` use the same base URL (`braid-api.azurewebsites.net`) but may differ in other configurations.  Each class provides methods like `summarizeApi`, `chunkApi`, `embedApi`, and others, returning the specific URL for that function in the given environment.  This allows the application to easily switch between environments without modifying core logic.


**Errors.ts**

This code defines custom error classes for a Braid application, extending the base JavaScript `Error` class.  Each class like `InvalidParameterError`, `ConnectionError`, etc., represents a specific error type for better error handling.  They ensure correct prototype chaining for TypeScript compatibility and log errors using `logCoreError` or `logApiError`.  Each error constructor takes an optional message and sets the error name for clear stack traces.  The commented-out section shows examples of additional custom errors that can be easily implemented following the same pattern.


**FindEnrichedChunkApi.ts**

The `FindEnrichedChunkApi` class provides methods for retrieving enriched chunk data.  It uses `axios` to make POST requests to API endpoints defined in an `IEnvironment` object.  The constructor requires an environment and a session key.  `findChunkFromUrl` retrieves a single chunk summary by URL.  `findRelevantChunksFromUrl` and `findRelevantChunksFromSummary` return arrays of relevant chunks based on a URL or summary query, respectively. All methods handle errors and return empty arrays or undefined if requests fail.


**FindThemeApi.Types.ts**

This code defines the types for a FindTheme API.  `IFindThemeRequest` and `IFindThemeResponse` are interfaces specifying the structure of data sent to and received from the API.  A request (`IFindThemeRequest`) includes the `text` to analyze and its `length`. The response (`IFindThemeResponse`) contains the identified `theme` of the provided text.  These interfaces improve code clarity and maintainability by ensuring consistent data structures throughout the FindTheme API.  The copyright indicates ownership by Braid Technologies.


**Fluid.ts**

This code defines interfaces for Fluid Framework token authentication.  `IFluidUser` represents a user, including their ID, name, and a flag for local development. `IFluidTokenRequest`, extending `IFluidUser`, adds a `documentId` for token requests.  `IFluidTokenResponse` represents the response containing the generated token. These interfaces ensure consistent data structures for user authentication and token exchange within the Fluid Framework, supporting both local and production environments.  The copyright indicates ownership by Braid Technologies.


**FluidApi.ts**

The `FluidApi` class provides a simplified way to generate Fluid Framework tokens.  It uses provided environment settings and a session key for authentication.  The core function, `generateToken`, accepts a request object with document, user, and username details.  It makes a POST request to a Fluid service endpoint.  The function uses `axios-retry` to handle potential network issues or rate limiting with up to five retries.  A successful response (status 200) returns the generated token; otherwise, it logs the error and returns `undefined`.


**FluidTokenProvider.ts**

This code provides tools for connecting to Azure Fluid Relay.  The `FluidTokenProvider` class handles token generation using a provided `FluidApi` instance and user information.  It implements the `ITokenProvider` interface, fetching orderer and storage tokens.  `FluidConnectionConfig` sets up connection parameters like endpoint, tenant ID, and document ID, using a `FluidTokenProvider` for authentication.  Finally, `FluidClientProps` wraps the connection configuration for use with Azure Fluid clients.  The code supports both local and remote environments, configurable via a provided environment setting.


**GeneratedBoxerPromptNames.ts**

This code defines string constants representing prompt IDs used to access different prompts from a prompt repository.  `developerAssistantPromptId` likely refers to a general developer assistant prompt. `developerImaginedAnswerGeneratorPromptId` is used for generating potential answers, and `developerQuestionGeneratorPromptId` is for generating questions.  The comment indicates this file is automatically generated and should not be manually modified.  Instead of editing, changes should be made to the prompt generation process that updates this file.


**GeneratedPromptNames.ts**

This code defines a set of constant string variables representing IDs for different types of prompts.  These IDs are likely used to retrieve specific prompts from a prompt repository.  The code explicitly states that it's auto-generated and should not be manually modified.  Each constant is named descriptively, indicating the intended use of the corresponding prompt, such as "articleSummariser" or "developerAssistant".  This approach allows for easy access and management of various prompts within an application.


**GeneratedSalonPromptNames.ts**

This code defines constants representing prompt IDs used for retrieving specific prompts from a prompt repository.  `codeSummariserPromptId` and `c4DiagrammerPromptId` store GUIDs (Globally Unique Identifiers) corresponding to prompts for code summarization and C4 diagram generation, respectively.  The file is automatically generated and should not be manually modified. This approach centralizes prompt management, allowing updates to the underlying prompts without changing the code that uses them.  Developers can use these IDs to access the intended prompts.


**GeneratedWaterfallPromptNames.ts**

This code defines a set of constant string variables that store prompt IDs. These IDs are used to retrieve specific prompts from a prompt repository.  Each variable name clearly indicates the purpose of the prompt, such as summarizing articles, classifying articles, finding themes, or testing for summarization failures.  This file is automatically generated and should not be manually modified.  This approach centralizes prompt management and makes it easy to update or reuse prompts across different parts of the application.


**IEnvironment.ts**

This code defines an interface (`IEnvironment`) for managing environment-specific configurations in the Braid application. It uses an enum `EEnvironment` to represent different environments (Local, Staging, Production).  The interface specifies methods to retrieve URLs for various API endpoints, including authentication, content operations (summarization, classification, embedding), activity tracking, chunk/page management, and integrations with services like LinkedIn and Fluid.  The `BRAID_ENVIRONMENT_KEY` constant likely serves as a key for accessing environment settings.  This structure allows the application to easily switch between different environments without hardcoding URLs.


**IEnvironmentFactory.ts**

This code defines an environment factory for creating environment instances (Development, Staging, Production) based on the execution context (browser or Node.js).  `getDefaultEnvironment()` returns a Production environment by default, or Development if running in Node.js with the environment variable `BRAID_ENVIRONMENT` set to 'Local'.  `getDefaultFluidEnvironment()` and `getDefaultLoginEnvironment()`  primarily use the default environment but switch to Development if running on `localhost` in a browser. `getEnvironment()` allows explicit environment selection based on the provided `EEnvironment` enum value.


**IModelDriver.ts**

This code defines interfaces and enums for model-driven conversations.  `EModel` and `EModelProvider` specify model sizes and providers. `EModelConversationRole` defines roles like "system", "assistant", and "user".  `IModelConversationElement` structures individual messages with a role and content. `IModelConversationPrompt` encapsulates conversation history and the current prompt.  `IEmbeddingModelDriver` and `IChatModelDriver` define interfaces for embedding and chat functionalities, respectively, including methods for embedding text and generating responses.  `ITextChunker` handles text chunking for different providers and model types.  The code uses TypeScript interfaces and enums for type safety and clarity.


**IModelFactory.ts**

This code defines a factory module (`IModelFactory`) for creating AI model instances based on enums `EModel` (model size) and `EModelProvider` (provider like OpenAI or DeepSeek).  It offers functions to get default models (e.g., `getDefaultTextChunker`, which returns a GPT4o text chunker) and specific models based on input parameters (e.g., `getTextChunker`, `getEmbeddingModelDriver`, `getChatModelDriver`). The factory uses a switch statement to determine the appropriate model implementation for the requested type and provider, abstracting instantiation details from the rest of the application.  It currently supports OpenAI and DeepSeek models.


**IPromptPersona.ts**

This code defines an enum `EPromptPersona` and an interface `IPromptPersona` for managing AI prompt personas used in summarization tasks.  `EPromptPersona` lists various persona types like `ArticleSummariser`, `CodeSummariser`, and `SurveySummariser`. The `IPromptPersona` interface specifies a `name`, `systemPrompt`, and `userPrompt` for each persona. This structure allows developers to configure different prompts for various summarization contexts, enabling specialized AI behavior based on the chosen persona.  The comments explain the purpose and usage of these types.


**IPromptPersonaFactory.ts**

This code defines a prompt persona factory that creates specialized AI prompts for various conversational tasks. It loads prompt templates from JSON files (Default, Boxer, Waterfall, Salon) and uses them to generate prompts for tasks like code summarization, C4 diagram generation, article summarization and classification, developer Q&A, and survey processing.  The factory's `getChatPersona` function takes a persona type, user input, and optional parameters (like word count and classifications) to create a customized prompt.  Helper functions handle placeholder replacement within the prompt templates, tailoring them for specific use cases.


**IPromptRepository.ts**

This code provides a system for managing and retrieving AI prompts.  It defines interfaces (`IStoredPrompt`, `IPromptRepository`) for consistent prompt handling and metadata storage.  A `PromptFileRepository` class implements file-based prompt storage, loading prompts from a JSON file. The `replacePromptPlaceholders` function substitutes placeholders within prompt templates.  A `PromptInMemoryRepository` is also provided for in-memory prompt management.  The code is well-documented and uses TypeScript interfaces for type safety.


**IStorable.ts**

This code defines interfaces and types for persistent storage.  The `IStorable` interface outlines the properties of storable objects, including identifiers (`id`, `applicationId`, `contextId`, `userId`), timestamps (`created`, `amended`), and schema information (`className`, `schemaVersion`).  `EStorableApplicationIds` enum lists the supported applications.  The `IStorableMultiQuerySpec` and `IStorableQuerySpec` interfaces define query structures for retrieving multiple and single records, respectively. Finally, `IStorableOperationResult` indicates the success of a storage operation.  These components provide a consistent and flexible approach to data persistence across different applications.


**Logging.ts**

This JavaScript module provides logging functions for different application areas: core system, database, and API.  It uses `console.error` for logging errors and `console.log` for API information. Each function takes a `description` and `details` parameter to provide context.  `logCoreError`, `logDbError`, and `logApiError` handle respective error types, while `logApiInfo` logs general API information.  The module aims to standardize logging and simplify debugging by categorizing error sources.


**LoginApi.ts**

The `LoginApi` class handles user login via LinkedIn.  It extends a base `Api` class, using provided environment settings (`IEnvironment`) and a session key.  The core function, `login()`, makes a POST request to the LinkedIn API endpoint.  A successful login (status 200) returns "Redirecting...". Errors during the API call are logged to the console, and an empty string is returned.  The class uses `axios` for HTTP requests.


**LooseObject.ts**

This code defines a TypeScript `interface` called `LooseObject`.  It's designed to represent a JavaScript object with arbitrary key-value pairs, where keys are strings and values can be of any type (`any`).  This is useful when you need a flexible data structure without a predefined schema.  Essentially, `LooseObject` describes a plain JavaScript object where you can add properties dynamically.  The copyright notice attributes ownership to Braid Technologies.


**ModelDrivers.DpSk.ts**

This code provides a DeepSeek-specific implementation for interacting with large language models (LLMs).  It defines a `DeepSeekR1ChatModelDriver` that uses the Groq SDK to communicate with DeepSeek's chat completion service.  The driver constructs chat messages with system, user, and historical context, then sends them to the DeepSeek API.  Received responses are processed to remove any `<think>` tags and leading carriage return/line feed characters before being returned.  The code also includes initialization classes for the chat model and a text chunker, and utility functions for text manipulation.  The module supports different prompt personas via a `getChatPersona` function and manages the API key for Groq.


**ModelDrivers.OpAi.ts**

This code defines a set of classes for interacting with OpenAI's embedding and chat models through Azure.  `OpenAIEmbeddingModelDriver` and `OpenAIChatModelDriver` handle embedding calculations and chat responses, respectively.  They use `calculateEmbedding` and `chat` functions which make API calls to Azure OpenAI services, including retry logic for rate limiting.  Also included are initialization classes for different model sizes (e.g., "GTP4o", "Embed-3-Small").  `OpenAITextChunker` helps manage text splitting for these models, considering token limits and optional overlap, using the `gpt4-tokenizer` library.  The code relies on environment variables for API keys.


**PageRepositoryApi.ts**

The `PageRepositoryApi` class manages saving and compressing page data.  It uses the `StorableRepositoryApi` for storage operations and inherits from the `Api` class for basic functionality like environment and session management.  The `save` method handles saving page data by calling the parent `StorableRepositoryApi`'s save method with the provided record and a generated API URL.  Additionally, the class provides `compressString` and `decompressString` methods for efficient storage, using a deflate compression algorithm and Base64 encoding.  It implements the `IStorablePageRepostoryApiWrapper` interface for standardized interactions.


**PageRepositoryApi.Types.ts**

This code defines TypeScript interfaces for a PageRepository API, focusing on data types for storing and retrieving web pages.  `IStoredPage` represents a stored page containing HTML content and inherits from `IStorable`.  `IStoredPageRequest` and `IStoredPageResponse`, extending `IStorableQuerySpec` and `IStoredPage` respectively, are used for type-safe communication with the API.  These interfaces, documented with JSDoc comments, enhance code clarity and enable tools like code generators to create test code automatically.  The module ensures type safety for page storage and retrieval operations within the PageRepository API.


**QueryEnrichedModelApi.ts**

The `QueryModelApi` class provides an interface for querying models with data enrichment and generating questions.  It uses `axios` to make `POST` requests to specified API endpoints.  The constructor takes an `IEnvironment` object and a session key for authentication.  `queryModelWithEnrichment` sends an enrichment query and returns an `IEnrichedResponse`.  `generateQuestion` sends a question generation request, including persona, prompt, and summary information, and returns an `IQuestionGenerationResponse`. Both methods handle errors and return `undefined` if a problem occurs.


**SessionApi.ts**

The `SessionApi` class manages user sessions and authentication.  It extends a base `Api` class and uses Axios to interact with a session API endpoint.  The constructor takes an environment configuration and a session key.  The core function, `checkSessionKey`, sends a POST request to the API to validate the provided session key.  A successful response (status 200) returns the response data.  Errors, including non-200 responses and network issues, are logged to the console, and an empty string is returned.


**StorableRepositoryApi.ts**

This code defines a `StorableRepostoryApi` class for interacting with a storage API for objects implementing the `IStorable` interface.  It uses `axios` to make HTTP requests.  The class provides methods for saving, removing, loading, finding, and retrieving recent `IStorable` objects. Each method takes a URL  pointing to the relevant API endpoint.  Error handling and logging are included.  The code also defines interfaces (`IStorablePageRepostoryApiWrapper`, `IStorableRepostoryApiWrapper`) outlining different interaction patterns with storable object repositories.


**StudioApi.Types.ts**

This code defines TypeScript interfaces for interacting with a Studio API, likely related to a "boxer" functionality.  `IStudioBoxerRequest` specifies the structure of requests, containing a `question` string.  `IStudioBoxerResponseEnrichment` describes the enriched response data, which includes an `id`, `summary`, optional `title`, `url`, and `iconUrl`. These interfaces enhance type safety when using the Studio API, ensuring that requests and responses conform to expected structures.  The comments explain the module's purpose and the role of each interface.


**SummariseApi.ts**

The `SummariseApi` class provides text summarization functionality using a backend service.  It extends the `Api` class, inheriting basic API interaction logic.  Key methods include `summarise` and `summariseContext`.  `summarise` allows text summarization with a specified persona (e.g., article, bullet points). `summariseContext` adds context-aware summarization by including a context string. Both methods use Axios to send POST requests to respective API endpoints and return a summarization response or undefined if an error occurs.  The class uses TypeScript interfaces for type safety and improved code clarity.


**SummariseApi.Types.ts**

This code defines TypeScript interfaces for a text summarization API.  `ISummariseRequest` specifies the persona, text to summarize, and optional length. `ISummariseContextRequest` adds a `context` and `chunk` for summarizing text within a larger context.  `ISummariseResponse` simply contains the generated `summary`.  These interfaces, part of the `SummariseApi.Types` module, ensure type safety when using the summarization API.  The `EPromptPersona` enum, imported from another file, likely defines different summarization styles.


**TestForSummariseFailApi.Types.ts**

This code defines types for a "TestForSummariseFail" API.  `ITestForSummariseFailRequest` specifies the request structure, including `text` (required) and an optional `lengthInWords`.  `ETestForSummariseFail` is an enum representing the possible validation results: `kSummaryFailed` or `kSummarySucceeded`.  `ITestForSummariseFailResponse` defines the response structure, containing `isValidSummary` which holds the validation result.  These types ensure type-safe validation of generated summaries within the `TestForSummariseFailApi` module.


**ThemeApi.ts**

This code defines the data structures for a FindTheme API, specifically the `IFindThemeRequest` interface.  This API helps with theme detection and analysis. The `IFindThemeRequest` interface specifies the criteria for finding a theme within a text.  It includes two properties: `text` (the input string to analyze) and `length` (likely related to the desired length of the returned theme or analysis). The module's documentation explains its purpose and the interfaces it provides for theme-related operations.


Generated by Salon from Braid Technologies, 28/02/2025