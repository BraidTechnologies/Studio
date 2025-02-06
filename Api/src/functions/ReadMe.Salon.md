**CheckSession.Azure.ts**

The module, `CheckSession`, is an Azure Function providing session validation via an HTTP endpoint, supporting both GET and POST methods. It verifies session keys against environment-configured valid sessions and grants anonymous access, requiring valid session key parameters for authentication.

The function `checkSession` validates session keys provided in request parameters against expected session keys stored in environment variables. Depending on the validity, the function returns either a 200 status, indicating success, or a 401 status, indicating authorization failure, with appropriate log messages.

Important classes or functions:
- `checkSession`
- `app.http`
- `isSessionValid`
- `sessionFailResponse`
- `defaultOkResponse`

**Chunk.Azure.ts**

- **Module Description**: The code defines an Azure Function module named `Chunk`. It provides a service to split input text into smaller, manageable chunks with configurable size and overlapping words. It integrates with the Braid API infrastructure.

- **Deployment and Development**: The function can be deployed via `func azure functionapp publish Braid-Api` and run locally with `npm start`.

- **Session Validation and Error Handling**: The chunking process involves session validation and error handling, returning standardized API responses.

- **Main Functions**:
  - `chunkText()`: Splits the input text into chunks based on specified chunk size and overlapping words.
  - `chunk()`: An asynchronous function that reads the text from the HTTP request, calls `chunkText()`, and returns the chunks in an HTTP response.

- **Utility Imports**: It imports utility functions like `isSessionValid`, `sessionFailResponse`, and `defaultErrorResponse`.

- **Model Usage**: Uses `getDefaultModel` from a shared source to access the chunking logic.

**Classify.Azure.ts**

This code module, `Classify`, is an Azure Function designed to provide text classification services using an AI model from OpenAI. It contains functionality for session validation, error handling, and response formatting.

The `decodeClassification` function translates an initial classification string into a human-readable format, returning "Unknown" if no match is found.

The `singleShotClassify` function asynchronously classifies provided text into predefined subject areas using an AI assistant. It uses the default chat model driver to generate a response and decodes the classification.

The `classify` function handles HTTP requests, validates sessions, processes requests, logs data, and returns a classification or error message. It supports both GET and POST methods with anonymous authentication level.

Key functions: `decodeClassification`, `singleShotClassify`, and `classify`.

**CosmosRepositoryApi.ts**

The CosmosRepositoryApi module provides utility functions for interacting with Azure Cosmos DB.

Important functions include:
- `getAuthorizationTokenUsingMasterKey`: Generates authorization tokens for various HTTP verbs using a master key.
- `storableToken`: Produces tokens to authorize specific HTTP requests to Cosmos DB documents.
- `makeStorableDeleteToken`: Creates a delete operation authorization token using the document ID.
- `makeStorablePostToken`: Produces tokens for POST operations.
- `makePostHeader`: Forms headers for POST requests.
- `makeDeleteHeader`: Generates headers for DELETE requests.
- `makePostQueryHeader`: Produces headers for POST queries, optionally including a continuation token.

These functions help create tokens and headers following Azure Cosmos DB’s authentication standards.


**Embed.Azure.ts**

This code defines an Azure Function module named `Embed` for text embedding using Azure AI services. It converts text into numerical vector representations (embeddings) and can automatically summarize texts that exceed the model's context window. The module includes retry logic for handling rate limiting and network errors and validates session authentication for all requests.

The main classes and functions in this module are as follows:
- `embed(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>`: This function processes requests to embed text data and returns the embeddings or an authorization error.
- Utility functions like `isSessionValid`, `sessionFailResponse`, `defaultErrorResponse`, and `invalidRequestResponse` are imported for session validation and error handling.
- `getDefaultModel` and `getEmbeddingModelDriver` are used to get the default model and its driver for embedding operations.
- The module uses `recursiveSummarize` to reduce text length when necessary. 

This Azure Function can be published using "func azure functionapp publish Braid-Api" or run locally with "npm start".

**EnrichedChunkRepository.ts**

The code defines an in-memory implementation of the `IEnrichedChunkRepository` interface, used to store and query enriched data chunks based on their URLs or summaries. It includes functionality to calculate the cosine similarity between embeddings (vectors) and to determine if two URLs are from the same source, specifically handling YouTube and GitHub URLs.

Key functions include:
- `cosineSimilarity`: Calculates cosine similarity between two vectors.
- `lookLikeSameSource`: Determines if two URLs are from the same source.
- `lowestOfCurrent`: Finds the index of the least relevant chunk.
- `replaceIfBeatsCurrent`: Replaces a current chunk if a candidate chunk is more relevant.

The main class is `EnrichedChunkRepositoryInMemory`, which handles chunks lookup operations using various lookup methods such as `lookupRelevantFromSummary`, `lookupRelevantFromUrl`, and `lookupFromUrl`.

**EnrichedChunkRepositoryDb.ts**

The `EnrichedChunkRepositoryDb` class implements `IEnrichedChunkRepository`, providing a database-backed repository for enriched chunks with an in-memory cache.

The constructor initializes the class, sets up an in-memory repository, and manages data loading asynchronously from a database.

Key methods:
- `lookupRelevantFromSummary`: Searches for chunks relevant to the text in a query's summary.
- `lookupRelevantFromUrl`: Finds chunks relevant to a specific URL.
- `lookupFromUrl`: Retrieves an enriched chunk summary using its URL.

`loadStorables` is used to load chunk data from a database, which is then cached in-memory for faster access.

**EnrichedChunkRepositoryFactory.ts**

The module `EnrichedChunkRepositoryFactory` is designed to create and manage instances of `IEnrichedChunkRepository`. This factory ensures efficient performance by implementing the singleton pattern to create only one instance of each repository type.

The function `getEnrichedChunkRepository` returns an instance of `IEnrichedChunkRepository` based on the specified `EChunkRepository` enum value. For `kWaterfall` and `kBoxer` repository types, it returns an instance of `EnrichedChunkRepositoryDb`. If an instance already exists, the function returns this existing instance to avoid creating a new one.

Important Classes/Functions:
- `getEnrichedChunkRepository`: Retrieves the appropriate repository instance.
- `EnrichedChunkRepositoryDb`: A class representing the repository.
- `IEnrichedChunkRepository`: An interface for repository implementations.
- `EChunkRepository`: An enum for repository types.

**EnumerateModels.Azure.ts**

The code defines an Azure Function titled `EnumerateModels`. It focuses on providing details about installed models, including default, large, and small models, by returning them in a structured JSON format.

The `enumerateModels` function is the key component, handling HTTP requests and validating sessions using the `isSessionValid` function. If the session is valid, it processes the request to retrieve model information via the `getDefaultModel` function and returns it. If an error occurs, it logs the error and returns a default error response. If the session fails validation, it returns a session failure response.

Important imports include `app`, `HttpRequest`, `HttpResponseInit`, `InvocationContext`, `getDefaultModel`, `IEnumerateModelsRequest`, `IEnumerateModelsResponse`, `sessionFailResponse`, and `defaultErrorResponse`. 

The function is published to Azure with `func azure functionapp publish Braid-Api` and can run locally with `npm start`.

**EnumerateRepositories.Azure.ts**

**Important Functions and Classes:**
1. `enumerateRepositories`
2. `app.http`

**Summary:**
The module `EnumerateRepositories` is an Azure Function that retrieves details of installed repositories, namely Boxer and Waterfall repositories. It validates session authentication and handles errors during request processing.

**Function `enumerateRepositories`:**
- Asynchronously processes HTTP requests and validates the session using `isSessionValid`.
- If the session is valid, it logs the request data, constructs a response including repository details, and returns a status 200 response.
- If an error occurs during processing, it logs the error and returns a default error response.
- If the session validation fails, it logs the failure and returns a session failure response.

**Application Setup:**
- The module sets up an HTTP endpoint named `EnumerateRepositories` supporting GET and POST methods with anonymous authentication level using the Azure Function `app.http`.

**FindEnrichedChunks.Azure.ts**

This Azure Function module, named `FindEnrichedChunks`, retrieves enriched chunks based on URL and summary. 

It includes methods for session validation and error handling. 

Key functions are `FindRelevantEnrichedChunksFromSummary`, `FindRelevantEnrichedChunksFromUrl`, and `FindEnrichedChunkFromUrl`, each handling requests to find relevant chunks via HTTP calls. 

The module validates the session using the `isSessionValid` function, retrieves chunks from the `EnrichedChunkRepository`, and returns JSON responses. 

Error responses are managed by the `defaultErrorResponse` function, and `sessionFailResponse` handles invalid sessions. 

The app configuration defines the HTTP endpoints for each function.

**FindTheme.Azure.ts**

This module defines an Azure Function called `FindTheme` that analyzes multiple paragraphs of text to identify a common theme. 

It uses several imported utility functions for session validation (`isSessionValid`), session failure response (`sessionFailResponse`), invalid request response (`invalidRequestResponse`), and error handling (`defaultErrorResponse`). 

The primary function, `findTheme`, processes HTTP requests by reading the text and length criteria, validating the session, and invoking `findThemeCall` to perform the theme extraction. `findThemeCall`, in turn, uses the `modelDriver` API to generate and return the theme based on the provided text.

The function is exposed via HTTP endpoints for `GET` and `POST` requests.

**GenerateFluidToken.Azure.ts**

**GenerateFluidToken** module is an Azure Function that generates a Fluid token for authenticating requests to the Fluid framework.

**generateFluidToken** function:
- Validates session using `isSessionValid`.
- Checks for presence of `tenantId` and `key`.
- Processes the request to extract necessary parameters (`documentId`, `userId`, `userName`).
- Utilizes `generateToken` to generate the Fluid token with required user details and permissions ([ScopeType enum](DocRead, DocWrite, SummaryWrite)).
- Returns the generated token or appropriate error response.

**Utility.Azure** methods:
- `isSessionValid`
- `sessionFailResponse`
- `defaultErrorResponse`

**Dependencies**:
- @azure/functions
- @fluidframework/server-services-client
- Utility.Azure helper methods

**GenerateQuestion.Azure.ts**

This code is part of an Azure Function module named `GenerateQuestion`. It provides a method to generate a question based on a given summary and returns the question in a structured format. 

The main function, `generateQuestion`, handles HTTP requests, checks session validity, processes the request to generate a question, and includes error handling. If the session is valid, it parses the request data and calls the `askModel` function to generate a response.

The `askModel` function interacts with a model driver to generate a question based on a summary provided in the request.

Important classes/functions:
- `generateQuestion`
- `askModel`
- `isSessionValid`
- `sessionFailResponse`
- `defaultErrorResponse`

**IEnrichedChunkRepository.ts**

The module `IEnrichedChunkRepository` defines an interface for querying and retrieving enriched chunks. It provides methods to look up relevant chunks based on either a given summary or a URL.

**Important Methods:**
1. `lookupRelevantFromSummary()`: Takes an instance of `IChunkQueryRelevantToSummarySpec` and returns an array of `IRelevantEnrichedChunk` based on content similarity.
2. `lookupRelevantFromUrl()`: Takes an instance of `IChunkQueryRelevantToUrlSpec` and returns an array of `IRelevantEnrichedChunk` from other sources.
3. `lookupFromUrl()`: Takes an instance of `IChunkQueryRelevantToUrlSpec` and returns an `IEnrichedChunkSummary` or `undefined` for the whole chunk specified by the URL.

Additionally, the module sets default constants for search chunk count and cosine similarity threshold values.

**LoginWithLinkedIn.Azure.ts**

This module provides methods for logging in with LinkedIn through an Azure Function. The main function is `LoginWithLinkedIn`, which manages session validation and redirects users to LinkedIn for authentication. It also has robust error handling to ensure secure session verification.

Another important function, `redirectToLinkedIn`, constructs the LinkedIn authorization URL, incorporating necessary parameters and environment-specific redirect URIs.

The function `redirectBackHomeWithFullPath` processes the LinkedIn authentication response, exchanges the authorization code for an access token, retrieves the user profile, and redirects back to the home page with user details.

Finally, `processAuthFromLinkedIn` handles the post-authentication state, extracting necessary parameters from the request and initiating the redirection process.

Key functions include:
1. `LoginWithLinkedIn`
2. `redirectToLinkedIn`
3. `redirectBackHomeWithFullPath`
4. `processAuthFromLinkedIn`

**QueryModelWithEnrichment.ts**

The `QueryModelWithEnrichment` module allows querying an AI model with and without document enrichment using Azure Functions.

**Classes/Functions:**
1. `askModel`: Asynchronously processes both direct and enriched queries.
2. `queryModelWithEnrichment`: Handles HTTP requests, validates sessions, and processes queries.

The `askModel` function handles:
- Direct and enriched model queries in parallel.
- Document enrichment if the response meets a token threshold.
- Fetching relevant documents based on the enriched response.

The `queryModelWithEnrichment` function:
- Validates session integrity.
- Processes HTTP POST requests to perform model queries.
- Manages errors and logs activities.

Lastly, the Azure Functions setup integrates this into an HTTP endpoint named 'QueryModelWithEnrichment'.

**StorableActivity.Azure.ts**

This module, `StorableActivity`, is an Azure Function that handles CRUD operations for activity records. The primary operations included are retrieving, saving, removing, and fetching recent activities. 

The main functions are:
- `getActivity`: Retrieves and returns an activity based on the request attributes.
- `saveActivity`: Saves an activity record after validating the session key.
- `removeActivity`: Removes an activity record based on the request.
- `getRecentActivities`: Fetches and returns recent activity records.

The `app.http` method sets up HTTP triggers for these functions, allowing them to be invoked via HTTP requests, with all handlers set to be anonymous. The module also incorporates session authentication and error handling. 

Important dependencies include `@azure/functions` and `StorableApi.Cosmos`. The code includes third-party dependencies and built-in imports to ensure proper functioning and extendibility.


**StorableApi.Azure.ts**

The module `AzureStorableApi` defines Azure Functions HTTP endpoints that perform CRUD operations on IStorable objects stored in Azure Cosmos DB, acting as a REST API layer between HTTP clients and the database. 

The key features include session validation, request parsing, response formatting, custom transformers for data manipulation, error handling and logging, ID-based and functional key-based searches, and batch operations for retrieving recent storables.

Important functions in this module:
- `findStorableApi()`
- `getStorableApi()`
- `getStorableApiFromQuery()`
- `getStorableApiCommon()`
- `saveStorableApi()`
- `removeStorableApi()`
- `getRecentStorablesApi()`

These functions handle session validation, querying, transforming, saving, and removing storables, and formatting responses.

**StorableApi.Cosmos.ts**

The `CosmosStorableApi` module provides a high-level API for performing CRUD (Create, Read, Update, Delete) operations on Azure Cosmos DB collections. It also implements functionalities for querying Cosmos DB and supports data transformation during operations.

The module imports various third-party libraries like `axios` for HTTP requests and utilizes internal utility functions. Key constants are defined for partition keys and paths pertinent to different Cosmos DB collections.

`ICosmosStorableParams` and `ILoggingContext` interfaces are used for structuring collection parameters and logging interactions, respectively. The `AzureLogger` and `ConsoleLogger` classes offer logging capabilities to either Azure Functions or console logs.

Notable functions include `findStorable`, `loadStorable`, `saveStorable`, `removeStorable`, `loadRecentStorables`, and `loadStorables`, each designed for specific CRUD operations. These functions interact with Cosmos DB using HTTP requests and include features for optional data transformation through the `StorableTransformer` type.

**StorableChunk.Azure.ts**

The module, named `StorableChunk`, defines an Azure Function for handling chunk records. This module provides methods to retrieve, save, and remove chunk records, and fetch recent chunks. It ensures valid sessions via request query parameter authentication and includes error handling during request processing.

Key imported functions and constants include `chunkStorableAttributes` and APIs such as `findStorableApi`, `removeStorableApi`, `saveStorableApi`, `getStorableApi`, and `getRecentStorablesApi` from `StorableApi.Azure`.

Defined functions are `getChunk`, `findChunk`, `saveChunk`, `removeChunk`, and `getRecentChunks`, all handling specific HTTP requests for chunk operations and returning appropriate HTTP responses.

**StorablePage.Azure.ts**

**Important Classes or Functions:**
- `decompressHtml`
- `sendHtml`
- `getPage`
- `savePage`

**Summary:**
This module, `StorablePage`, is designed for Azure Functions to manage storable pages, providing methods for retrieving, saving, and removing page records. 

The module imports necessary libraries and internal methods for handling requests and interactions with Cosmos DB and Azure. It includes session authentication validation and error handling mechanisms.

The `decompressHtml` function decompresses the HTML content of a storable page, while the `sendHtml` function constructs and sends an HTTP response with the HTML content.

`GetPage` and `SavePage` functions handle HTTP requests for fetching and saving pages. They validate session keys, process JSON requests, and return HTTP responses accordingly.

**StudioForTeams.Azure.ts**

This code module, `StudioForTeams`, integrates Boxer's AI with Microsoft Teams via Azure Functions endpoints. It facilitates the processing of natural language queries from Teams, converting these requests to Boxer API formats, and returning enriched responses tailored for Teams users.

The main function, `boxerQuery`, handles HTTP requests, processes queries, and generates enriched responses, including document links and summaries. It uses the `askModel` function to interface with the Boxer backend.

A utility function `makeIconPath` generates favicon URLs for given source URLs. The module includes deployment commands for Azure and local environments, and it supports HTTP methods `GET` and `POST`.

**Summarize.Azure.ts**

This module, `Summarize.Azure`, provides the Azure Functions implementation for a text summarization API.

It handles HTTP requests, validates session tokens, and processes requests through the core summarization functionality using the `Summarize` module.

The `summarize` function is the main handler which processes the incoming HTTP request, validates sessions, parses input, invokes the text summarization, and returns the result to the client.

Key dependencies include `@azure/functions` for Azure Functions runtime, `./Summarize` for the core summarization logic, and `./Utility` for session validation and error handling.

The module supports both GET and POST methods for handling the summarization requests.

**Summarize.ts**

This code module provides functionality for text summarization using AI models. It includes features to split large texts into smaller, processable chunks with configurable overlap.

Key classes/functions:
1. `chunkText(text: string, overlapWords: number)`: Takes a piece of text and splits it into smaller chunks for easier processing.
2. `singleShotSummarize(persona: EPromptPersona, text: string, words: number)`: Summarizes the given text based on the specified persona and word count using an AI assistant.
3. `recursiveSummarize(persona: EPromptPersona, text: string, level: number, words: number)`: Generates a summary recursively to handle large documents and provides a concise summary.

Additional features include handling multiple summarization personas, managing API rate limits and retries, and input text validation. Deployment instructions are also provided for Azure and local execution.

**TestForSummariseFail.Azure.ts**

This module, `TestForSummariseFail`, validates the quality of AI-generated summaries by detecting failures such as incomplete text or error messages instead of proper summaries. It does so by analyzing the provided text and determining whether a valid summary can be produced.

The core functionality includes:
- The `testForSummariseFailCall` function, which sends a POST request to an Azure endpoint to analyze the text and utilizes retries for rate limits.
- The `testForSummariseFail` function, which validates session keys, processes HTTP requests, and returns the summary validation status or errors.

Deployment methods include publishing to Azure using `func azure functionapp publish Braid-Api` and running locally using `npm start`.

Key components involved are `app`, `HttpRequest`, `HttpResponseInit`, `InvocationContext` from "@azure/functions", and supporting functions/utilities from `Utility.Azure`.

**Utility.Azure.ts**

This module, named `Utility`, provides common utility functions for Azure Functions endpoints, including session validation, error responses, and standard HTTP response formatting. 

Key functions:

1. **isSessionValid**: Validates if a session provided in the HTTP request matches the session keys stored in environment variables, and logs the validation result.

2. **sessionFailResponse**: Returns an HTTP response with status code 401, indicating authorization failure.

3. **defaultOkResponse**: Returns a standard HTTP response with status code 200 (Ok).

4. **defaultErrorResponse**: Returns an HTTP response with status code 500, indicating a server error.

5. **invalidRequestResponse**: Returns an HTTP response for bad requests with status code 400, including a custom message.

6. **notFoundResponse**: Returns an HTTP response with status code 404, indicating a resource was not found.

Deployment can be done using the command `func azure functionapp publish Braid-Api` for Azure, or `npm start` for local execution.

