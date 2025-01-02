**ActivityRepositoryApi.ts**

The `ActivityRepositoryApi` class extends `Api` and implements `IStorableRepositoryApiWrapper`, providing methods to interact with an activity repository API. This class is initialized with an `IEnvironment` environment and a session key for authentication, and it composes an instance of `StorableRepositoryApi` for underlying API operations.

Key methods include:
- `save(record: IStorable)`: Saves an activity record.
- `remove(recordId: string)`: Removes an activity record.
- `load(recordId: string)`: Loads an activity record.
- `find(functionalSearchKey: string)`: Finds an activity record.
- `recent(querySpec: IStorableMultiQuerySpec)`: Retrieves recent activity records.

These methods construct appropriate API URLs using environment settings and invoke corresponding methods on the `StorableRepositoryApi` instance.

**Api.ts**

This code defines a class, `Api`, that interacts with a specified environment and uses a session key for authentication.

The `Api` class constructor takes two parameters: `environment_`, which is of type `IEnvironment`, and `sessionKey_`, a string utilized for authentication.

The class stores these parameters as private properties `_environment` and `_sessionKey`.

Two public `get` methods, `environment` and `sessionKey`, provide access to these private properties.

This class acts as a base class for more functional API classes by holding common data elements like environment and session key.

Important Classes/Functions:
1. `Api` class
2. `constructor` method
3. `environment` getter
4. `sessionKey` getter

**Asserts.ts**

The module imports `AssertionFailedError` from a local `Errors` file.

The `throwIfUndefined` function checks if a given value `x` is `undefined`. If it is, the function throws an `AssertionFailedError` with the message "Object is undefined."

The `throwIfNull` function checks if a given value `x` is `null`. If it is, it throws an `AssertionFailedError` with the message "Object is null."

The `throwIfFalse` function checks if a given boolean value `x` is `false`. If it is, the function throws an `AssertionFailedError` with the message "Value is false."

Key functions: `throwIfUndefined`, `throwIfNull`, `throwIfFalse`.

**ChunkApi.Types.ts**

The code is for a chunk request API from Braid Technologies Ltd.

The `IChunkRequest` interface defines the properties for a chunk request:
- `text`: The text content that needs to be chunked.
- `chunkSize` (optional): The number of tokens per chunk.
- `overlapWords` (optional): The number of overlapping words between chunks.

The `IChunkResponse` interface defines the return type of the chunk request:
- `chunks`: An array of strings, each representing a chunk of the original text.

**ChunkRepositoryApi.ts**

`ChunkRepostoryApi` extends an `Api` class and implements `IStorableRepostoryApiWrapper`, offering methods to interact with a chunk repository API, including `save`, `remove`, `load`, `find`, and `recent` records. 

The class is initialized with an environment and session key, leveraging `StorableRepostoryApi` for actual API calls. Methods construct API URLs using environment and session key for authentication.

- **save**: Saves a chunk record.
- **remove**: Removes a chunk record by its ID.
- **load**: Loads a chunk record by its ID.
- **find**: Searches for a chunk record.
- **recent**: Retrieves recent records based on query specifications.

Main classes and functions:
- `ChunkRepostoryApi`
- `save`
- `remove`
- `load`
- `find`
- `recent`

**ChunkRepositoryApi.Types.ts**

This code defines type structures and interfaces for a ChunkRepository API developed by Braid Technologies Ltd.

**Important classes/interfaces:**
1. **IStorable**: An imported interface that likely defines a common structure or functionality for storable objects.
2. **IStoredEmbedding**: An interface for storing embeddings containing a `modelId` and an array of numbers representing the embedding.
3. **IStoredTextRendering**: Defines the structure for storing text renderings, including a `modelId` and a `text`.
4. **IStoredChunk**: Extends `IStorable` and represents a chunk of data including properties such as `parentChunkId`, `originalText`, `url`, `storedEmbedding`, `storedSummary`, `storedTitle`, and `relatedChunks`.

**Additional variables:**
- **storedChunkClassName**: A constant string, `"Chunk"`, possibly used for identification or referencing within the system.

**ClassifyApi.Types.ts**

This code defines TypeScript interfaces for a Chunk API as part of Braid Technologies Ltd in 2024.

**IClassifyRequest**: Represents the structure of a classification request object, containing a `text` property of type string and `classifications` which is an array of strings.

**IClassifyResponse**: Represents the structure of a classification response object, containing a single `classification` property of type string.

These interfaces serve as TypeScript definitions to ensure strong typing and clear structure when implementing the API's request and response handling.

**Compress.ts**

This code provides two main functions: `compressString` and `decompressString`. 

The `compressString` function compresses a given input string using the deflate algorithm provided by the `pako` library and returns a base64 encoded string. It handles both Node.js and browser environments for base64 encoding.

The `decompressString` function reverses this process. It takes a base64 encoded compressed string, decodes it appropriately for the environment (Node.js or browser), decompresses it, and returns the original string. It also includes error handling for invalid input. 

Important functions: `compressString` and `decompressString`.

**EmbedApi.Types.ts**

This code defines data structures for an Embed API.

The `IEmbedRequest` interface outlines the structure for embedding requests, containing two properties: `persona` of type `EPromptPersona` and `text` of type `string`.

The `IEmbedResponse` interface defines the structure for embedding responses, with a single property `embedding`, which is an array of numbers.

The important classes or functions in this module are `IEmbedRequest` and `IEmbedResponse`. The code imports `EPromptPersona` from another module to use in the `IEmbedRequest` persona property.

**EnrichedChunk.ts**

The module defines an `EChunkRepository` enumeration to differentiate between various chunk repositories such as 'Boxer' and 'Waterfall'.

The constant `kDefaultSimilarityThreshold` is set to 0.5 to filter out chunks that are less than 50% relevant.

The `IEnrichedChunkSummary` interface represents a summary of a chunk with properties like `url`, `text`, and `summary`.

The `IEnrichedChunk` interface extends `IEnrichedChunkSummary` to include `id` and an array of numbers named `embedding`, meant for server-side storage.

The `IRelevantEnrichedChunk` interface associates a chunk with a relevance score.

`IChunkQuerySpec` specifies the structure for chunk query objects, including `repositoryId`, `maxCount`, and `similarityThreshold`.

The `IChunkQueryRelevantToUrlSpec` and `IChunkQueryRelevantToSummarySpec` interfaces extend `IChunkQuerySpec` to include `url` and `summary` properties respectively.

**EnrichedQuery.ts**

The module provides definitions for the data elements of the Query API.

It imports the `EChunkRepository` and `IRelevantEnrichedChunk` classes from the `EnrichedChunk` module.

The `EConversationRole` enum defines different roles within a conversation element: `kSystem`, `kAssistant`, and `kUser`.

The `EStandardPrompts` enum includes predefined prompts for different scenarios in an AI assistant, helping an application developer understand generative AI with strict guidelines on responses.

The `IConversationElement` interface defines the structure for a conversation element with a role and content.

The `IEnrichedQuery` interface outlines the structure for an enriched query object, including repository information, prompts, and history.

The `IEnrichedResponse` interface defines the structure for an enriched response object with `answer` and `chunks`.

The `IGenerateQuestionQuery` interface defines the structure for a question generation query.

The `IQuestionGenerationResponse` interface defines the structure for the response to a generated question query.

**EnumerateModelsApi.Types.ts**

This code defines TypeScript interfaces for the EnumerateModels API, owned by Braid Technologies Ltd, for the year 2024.

The `IEnumerateModelsRequest` interface represents the request object for fetching models, while the `IEnumerateModelsResponse` interface represents the response object, containing properties like defaultId, defaultEmbeddingId, largeId, largeEmbeddingId, smallId, and smallEmbeddingId.

Similarly, `IEnumerateRepositoriesRequest` defines the request object for fetching repositories, and the `IEnumerateReposotoriesResponse` interface represents the response, containing an array of `EChunkRepository` objects.

The `EChunkRepository` is imported from an external module `EnrichedChunk`.

**Environment.ts**

This code defines classes for the DevelopmentEnvironment, StagingEnvironment, and ProductionEnvironment, each implementing the IEnvironment interface.

Each class includes methods to retrieve various API endpoints specific to each environment. For example, the DevelopmentEnvironment class uses localhost URLs, while the StagingEnvironment and ProductionEnvironment use URLs pointing to a hosted API service.

The important classes in this module are DevelopmentEnvironment, StagingEnvironment, and ProductionEnvironment.

Key functions include checkSessionApi, summariseApi, findThemeApi, classifyApi, chunkApi, embedApi, and others, each returning the corresponding API endpoint URL. There is also a boxerHome function returning the URL of a boxer HTML page, among other endpoint functions.

**Errors.ts**

This module defines custom error classes representing different types of application errors. The main classes are `InvalidParameterError`, `InvalidOperationError`, `InvalidStateError`, `ConnectionError`, `EnvironmentError`, and `AssertionFailedError`.

Each class extends the built-in `Error` class and takes an optional message parameter. They set their prototype chain correctly using `Object.setPrototypeOf` to ensure stack traces are accurate. The class names are also set for proper display in stack traces.

Logging functions (`logCoreError` and `logApiError`) are called within each constructor to log the error details, aiding in debugging and error tracking.

**FindEnrichedChunkApi.ts**

The `FindEnrichedChunkApi` class extends the `Api` class to provide methods for finding enriched chunks. 

The constructor initializes the class with an environment and a session key. 

The `findChunkFromUrl` function takes a URL query and returns an enriched chunk summary if available. It makes an asynchronous POST request to an API endpoint and handles the response.

The `findRelevantChunksFromUrl` function accepts a URL query and returns an array of relevant enriched chunks by making an asynchronous POST request to another API endpoint.

The `findRelevantChunksFromSummary` function takes a summary query and returns relevant enriched chunks, similar to the previous methods. 

Important functions include `findChunkFromUrl`, `findRelevantChunksFromUrl`, and `findRelevantChunksFromSummary`.

**FindThemeApi.Types.ts**

This code defines TypeScript interfaces for a FindTheme API used by Braid Technologies Ltd. 

The `IFindThemeRequest` interface represents the request object that includes two properties: `text`, a string containing the input data, and `length`, a number indicating the length of the text. 

The `IFindThemeResponse` interface represents the response object with a single property: `theme`, a string representing the identified theme from the input text.

Key classes/interfaces: `IFindThemeRequest`, `IFindThemeResponse`.

**Fluid.ts**

This code defines TypeScript interfaces for the Fluid Token API.

The `IFluidUser` interface represents a user and includes properties for `local` (indicating if the application runs locally), `userId` (user's ID), and `userName` (user's name).

The `IFluidTokenRequest` interface extends `IFluidUser` and adds the `documentId` property to represent the request for a Fluid token. This includes all properties from `IFluidUser` along with the document ID for which the token is requested.

The `IFluidTokenResponse` interface represents the response to a Fluid token request and contains a single property `token`, which is the token itself.

Important classes or functions: `IFluidUser`, `IFluidTokenRequest`, `IFluidTokenResponse`.

**FluidApi.ts**

**Important Classes/Functions:**
1. `FluidApi`
2. `generateToken`

The `FluidApi` class extends the `Api` class and is responsible for interacting with an API related to fluid tokens. 

The constructor (`constructor`) initializes an instance with the provided `IEnvironment` and session key for authentication.

The `generateToken` method asynchronously generates a token using the provided query parameters, making a POST request to the API. 

Retries up to 5 times are managed using the `axiosRetry` module configured with exponential backoff for retrying on specific conditions.

 Error handling is incorporated to log any issues and ensure undefined is returned if the process is unsuccessful.

**FluidTokenProvider.ts**

The code provides an implementation of an API for establishing Fluid connections, specifically using Azure.

The `FluidTokenProvider` class implements the `ITokenProvider` interface to retrieve tokens required for connecting to Azure Fluid Relay. It uses the `FluidApi` class to generate tokens and manages user details with the `IFluidUser` interface. 

The `FluidConnectionConfig` class implements `AzureRemoteConnectionConfig` and is responsible for setting up connection configurations, such as endpoint, tenant ID, and token provider, based on the specified environment and session key.

The `FluidClientProps` class implements `AzureClientProps`, and it initializes a new Fluid connection using `FluidConnectionConfig`, based on the given session key, token request, and environment settings.

Key classes:
- `FluidTokenProvider`
- `FluidConnectionConfig`
- `FluidClientProps`

Important functions:
- `FluidTokenProvider.fetchOrdererToken()`
- `FluidTokenProvider.fetchStorageToken()`
- `FluidTokenProvider.getToken()`

**IEnvironment.ts**

The code defines a constant `BRAID_ENVIRONMENT_KEY` with the value "BRAID_ENVIRONMENT".

It declares an enumeration `EEnvironment` with values `kLocal`, `kStaging`, and `kProduction`, representing different environments.

An interface `IEnvironment` is defined with multiple method signatures related to API interactions. Each method returns a string and appears to represent different API endpoint paths and operations, such as checking sessions, summarization, finding themes, and handling activities, chunks, and pages.

Classes and functions:
1. `BRAID_ENVIRONMENT_KEY` (constant)
2. `EEnvironment` (enum)
3. `IEnvironment` (interface with various methods)

These components support environment configuration and interactions with various backend API endpoints in a scalable manner.

**IEnvironmentFactory.ts**

This module manages the selection of environment configurations for an application.

- The main classes and functions are `getDefaultEnvironment`, `getDefaultFluidEnvironment`, `getDefaultLoginEnvironment`, and `getEnvironment`.
- `getDefaultEnvironment` returns an environment instance based on the current execution context. It defaults to `DevelopmentEnvironment` if the `BRAID_ENVIRONMENT` environment variable is set to 'Local', otherwise defaults to `ProductionEnvironment`.
- `getDefaultFluidEnvironment` and `getDefaultLoginEnvironment` functions work similarly but prioritize `DevelopmentEnvironment` if running in a browser on `localhost`.
- `getEnvironment` function returns the environment instance (`DevelopmentEnvironment`, `StagingEnvironment`, or `ProductionEnvironment`) based on the string passed to it.

**IModel.ts**

This code defines an enumeration `EModel` with two possible values (`kSmall` and `kLarge`) representing different model sizes.

It also defines an interface `IModel` which outlines the structure that a model object should follow. This interface includes properties for deployment details (`deploymentName`, `embeddingDeploymentName`) and `contextWindowSize`.

The interface `IModel` also requires implementing three methods: `fitsInContext()` to check if the given text fits within the context window size, `chunkText()` to split text into chunks considering chunk size and overlap, and `estimateTokens()` to estimate the number of tokens in the text.

Important entities:
- `EModel` (enum)
- `IModel` (interface)

**IModelFactory.ts**

This code provides functionality to retrieve AI models, primarily using instances of the `GPT4` class.

The `getDefaultModel` function returns a default instance of the `GPT4` model.

The `getModel` function returns an instance of a specific model based on an `EModel` type, currently defaulting to return `GPT4`.

Key classes and functions include:
- `GPT4`: Represents the model class being instantiated and returned.
- `getDefaultModel`: Fetches the default `GPT4` model.
- `getModel`: Fetches the specified model based on the `EModel` type, with the default also being `GPT4`.

**IPromptPersona.ts**

This code defines an enumeration and an interface used primarily for summarisation tasks by different personas. 

**Classes and Functions:**
1. **EPromptPersona:** An enumeration that lists different types of personas (e.g. Article Summariser, Code Summariser, Survey Summariser). Each persona corresponds to a specific summarisation functionality.
2. **IPromptPersona:** An interface that outlines the structure of a summarisation persona. It contains three properties: `name` (a string representing the persona's name), `systemPrompt` (a string with the system-level prompt), and `itemPrompt` (a string with the prompt used for individual items).

These components facilitate organized and flexible summarisation by categorizing and structuring the personas and their prompts.

**IStorable.ts**

The code defines several TypeScript enums and interfaces that are designed to manage and interact with storable objects within an application context.

The `EStorableApplicationIds` enum represents the names of the applications (`Boxer` and `Waterfall`) that can generate and use stored objects.

The `IStorable` interface outlines the structure of storable objects, including properties such as `id`, `applicationId`, `contextId`, `userId`, `functionalSearchKey`, `created`, `amended`, `className`, and `schemaVersion`.

The `IStorableMultiQuerySpec` interface defines a specification for querying multiple records, specifying the `limit` and `className` of the records to return.

The `IStorableQuerySpec` interface defines a specification for querying a single record, specifying the `id` and optionally a `functionalSearchKey`.

The `IStorableOperationResult` interface indicates whether an operation on a storable object succeeded with a boolean `ok` property.

**Logging.ts**

This module provides four functions to log different types of messages.

The `logCoreError` function logs core errors with a given description and additional details using `console.error`.

The `logDbError` function logs database-related errors using `console.error` with a specified description and extra details.

The `logApiError` function logs API-specific errors with a provided description and details using `console.error`.

The `logApiInfo` function logs general information related to APIs using `console.log`, specifying a description and relevant details.

Key functions in the module are `logCoreError`, `logDbError`, `logApiError`, and `logApiInfo`.

**LoginApi.ts**

This code defines a `LoginApi` class for handling login operations, specifically with LinkedIn API, by extending an `Api` base class.

The `LoginApi` class constructor initializes an instance with the environment settings and a session key for authentication, which it passes to the `Api` base class.

The `login` method constructs the API URL using the LinkedIn login API and the session key. It then makes a POST request to the URL using axios. If the response status is 200, it returns "Redirecting...". Otherwise, it logs the error status or error message and returns an empty string.

Key Class: `LoginApi`
Key Method: `login`

**Model.ts**

The module defines a `GPT4` class that implements the `IModel` interface, simulating a model with specific deployment settings and context window sizes used for handling textual data.

The class constructor initializes four properties: `deploymentName`, `embeddingDeploymentName`, `contextWindowSize`, and `contextWindowSizeWithBuffer`.

The `fitsInContext` method checks whether a given text fits within the predefined context window size with a buffer, using the `GPT4Tokenizer` to estimate token count.

The `chunkText` method splits input text into chunks based on a specified chunk size and optional overlapping words, throwing an error if the overlap exceeds the chunk size.

The `estimateTokens` method estimates the number of tokens in a text using the tokenizer.

**Important classes/functions**: `GPT4` class, `fitsInContext`, `chunkText`, `estimateTokens` functions.

**PageRepositoryApi.ts**

**Important Classes/Functions:**

- `PageRepostoryApi`: Represents an API for the Page repository, extends `Api` and implements `IStorablePageRepostoryApiWrapper`.
- `save`: Asynchronously saves a record to the Page repository API.
- `compressString`: Compresses a string using the deflate algorithm and returns a Base64-encoded compressed string.
- `decompressString`: Decompresses a string that was compressed using `compressString` and returns the original string.

**Summary:**

The `PageRepostoryApi` class extends the `Api` class and implements the `IStorablePageRepostoryApiWrapper`. It takes an environment and a session key as parameters for initialization. The class includes a method `save` which saves a record that implements `IStorable` to the Page repository API asynchronously. Additionally, it provides methods `compressString` and `decompressString` for compressing and decompressing strings respectively, using the deflate algorithm.

**PageRepositoryApi.Types.ts**

This TypeScript module defines interfaces relevant to the `PageRepository` API, which deals with storing web pages.

The `IStoredPage` interface extends `IStorable` and represents a stored web page, containing the HTML content as a string.

The `IStoredPageRequest` interface extends `IStorableQuerySpec` and represents the request type for fetching or querying stored web pages.

The `IStoredPageResponse` interface extends `IStoredPage` and represents the response type for providing stored web page details.

These explicit type definitions allow code generators to identify and generate test code for both the input and output of page-related API operations.

**QueryModelApi.ts**

This code defines a `QueryModelApi` class that extends from `Api` and interact with a specified environment to query models and generate questions. It uses the axios library to make HTTP requests.

The constructor method initializes a new instance of the class with the provided environment settings and session key for authentication.

The `queryModelWithEnrichment` function asynchronously sends enriched query data to a specified API endpoint and returns the enriched response data if the request is successful, otherwise it logs the error and returns `undefined`.

The `generateQuestion` function asynchronously generates a question based on the provided query data, following a similar pattern to handle responses and errors. 

Key classes and functions:
- `QueryModelApi` class
- `constructor`
- `queryModelWithEnrichment`
- `generateQuestion`

**SessionApi.ts**

The `SessionApi` class extends the `Api` class to handle session-related tasks.

In the constructor, it accepts an environment configuration (of type `IEnvironment`) and a session key, which are passed to the parent `Api` class's constructor.

The `checkSessionKey` method sends a POST request to validate the session key using `axios`. It constructs the endpoint URL by appending the session key. If the response status is 200, it returns the response data, otherwise, it logs the error status and returns an empty string.

Important classes or functions:
- `SessionApi`
- `constructor`
- `checkSessionKey`

**StorableRepositoryApi.ts**

The code defines an interface and a class for interacting with a repository of storable objects using Axios for HTTP requests.

`IStorablePageRepostoryApiWrapper` interface provides a method `save(record: IStorable): Promise<boolean>` to save storable records.

`IStorableRepostoryApiWrapper` interface extends the previous one, adding methods `remove(recordId: string): Promise<boolean>`, `load(recordId: string): Promise<IStorable | undefined>`, `find(functionalSearchKey: string): Promise<IStorable | undefined>`, and `recent(querySpec: IStorablesQuerySpec, url: string): Promise<Array<IStorable>>`.

`StorableRepostoryApi` class implements methods to handle API calls: `save`, `remove`, `load`, `find`, and `recent`.

`save` sends a POST request to save a record and returns true if successful.

`remove` sends a POST request to delete a record by ID and returns a boolean status.

`load` sends a POST request to retrieve a record by ID and returns the record or undefined.

`find` sends a POST request to find a record using a functional search key and returns the record.

`recent` sends a POST request with query specifications to retrieve recent records and returns an array of records.

**StudioApi.Types.ts**

This code defines the data structures for the Studio API by declaring interfaces for request and response objects.

The `IStudioBoxerRequest` interface represents a request object that contains a single property `question` of type `string`.

The `IStudioBoxerResponseEnrichment` interface represents a response object with several properties: `id` (string), `summary` (string), and optional `title`, `url`, and `iconUrl` (all strings, may be undefined).

Important interfaces: `IStudioBoxerRequest`, `IStudioBoxerResponseEnrichment`.

**SummariseApi.Types.ts**

This code defines the data structures for the Summarise API.

There is an `ISummariseRequest` interface that specifies the format for a summarisation request, including properties for `persona` (of type `EPromptPersona`), `text` (the content to be summarised), and an optional `lengthInWords`.

There is an `ISummariseResponse` interface which represents the structure for the response of the summarisation request, containing a single property, `summary`, which is a string.

The `EPromptPersona` is imported from another module, indicating that it defines various personas that can be used in the request.

Key interfaces: `ISummariseRequest` and `ISummariseResponse`.

**TestForSummariseFailApi.Types.ts**

This code defines the data elements for the `SuppressSummariseFail` API.

The `ITestForSummariseFailRequest` interface specifies the structure of a request object with a required `text` property and an optional `lengthInWords` property.

The `ETestForSummariseFail` enum contains two values: `kSummaryFailed`, indicating that a summary attempt failed, and `kSummarySucceeded`, indicating that a summary attempt was successful.

The `ITestForSummariseFailResponse` interface specifies the structure of a response object with an `isValidSummary` property, which uses the `ETestForSummariseFail` enum to indicate whether the summary was successful or not.

**ThemeApi.ts**

This code is part of the FindTheme API developed by Braid Technologies Ltd in 2024.

It defines an interface named `IFindThemeRequest`.

The `IFindThemeRequest` interface contains two properties: a `text` property of type `string` and a `length` property of type `number`.

The interface is used for specifying the criteria needed to find a theme within the API.

