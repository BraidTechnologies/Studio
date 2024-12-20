**AzureStorableApi.ts**

The `AzureStorableApi` module provides HTTP endpoints to perform CRUD operations on `IStorable` objects stored in Azure Cosmos DB via Azure Functions. 

Classes/Functions:
- `applyTransformer` and `applyArrayTransformer`: Apply a transformer function to storable objects or arrays.
- `findStorableApi`, `getStorableApi`, `getStorableApiFromQuery`, `getStorableApiCommon`: Retrieve storable objects from Azure Cosmos DB with optional data transformation and session validation.
- `saveStorableApi`: Validate session keys and save storable objects, logging the operation status.
- `removeStorableApi`: Validate session keys and remove storable objects, logging the operation status.
- `getRecentStorablesApi`: Retrieve recent storable objects with an option to transform data and log the operation.

**CheckSession.ts**

**Important Functions and Modules:**
1. `checkSession(request: HttpRequest, context: InvocationContext)`: This function validates the session key from the query parameters of the request. It checks if the session key matches the expected values stored in environment variables. Based on the validity, it returns a 200 status with the session key or a 401 status with an authorization failure message.

2. `app.http('CheckSession', { methods: ['GET', 'POST'], authLevel: 'anonymous', handler: checkSession })`: This code configures an HTTP endpoint named "CheckSession" that supports GET and POST methods, sets anonymous access, and handles requests using the `checkSession` function.

**Summary:**
- This Azure Function module validates session keys against environment-configured valid sessions.
- It supports GET and POST methods.
- The `checkSession` function handles session validation, returning different responses based on session validity.
- The function is publicly accessible but requires a valid session key for successful authentication.

**Chunk.ts**

### Functionality
The code defines an Azure Function module for text chunking, which splits input text into manageable chunks with configurable size and overlap settings.

### Important Classes/Functions
- **chunkText**: Utilizes the `model.chunkText` method to split input text based on specified chunk size and overlap words.
- **chunk**: Asynchronous function that handles HTTP requests, validates session, and returns text chunks or error messages.

### Key Points
- The module is part of Braid API infrastructure and ensures authenticated sessions.
- The `chunk` function parses the HTTP request, validates the session, and processes the input text if valid.
- In case of errors, it returns standardized error responses.
- The Azure Function configuration is specified for anonymous access and supports GET and POST methods.

**Classify.ts**

This module, **Classify**, is an Azure Function that provides text classification services using the OpenAI API. 

The **`decodeClassification`** function converts initial classification results into human-readable formats.

The **`singleShotClassify`** function classifies input text into predefined categories using OpenAI's model. It retries up to five times on network errors or rate limit hits.

The **`classify`** function handles text classification requests. It validates the session, reads the request JSON, and uses the `singleShotClassify` function to classify the text. It then returns the classification result or an appropriate error message.

The main module imports necessary functions and sets up the Azure HTTP handler with authentication level set to 'anonymous'.

**CosmosRepositoryApi.ts**

The `CosmosRepositoryApi` module provides utility functions for interacting with Azure Cosmos DB. It generates authorization tokens and headers compliant with Microsoft's authentication requirements.

**Key Functions:**

1. `getAuthorizationTokenUsingMasterKey`: Generates authorization tokens using an HTTP request's verb, resource type, resource ID, date, and master key.
2. `storableToken`: Creates tokens for various storage operations using the master key.
3. `makeStorableDeleteToken`: Generates tokens for delete operations.
4. `makeStorablePostToken`: Generates tokens for post operations.
5. `makePostHeader`: Creates headers for POST requests to Azure Cosmos DB.
6. `makeDeleteHeader`: Creates headers for delete requests.
7. `makePostQueryHeader`: Generates headers for query operations, supporting continuation tokens.

These functions utilize the `crypto` module to generate necessary signatures and authorization tokens for secure communication with Azure Cosmos DB's REST API.

**CosmosStorableApi.ts**

The code provides a high-level API for interacting with Azure Cosmos DB storage, implementing CRUD operations and query capabilities for storable objects.

**Important Classes/Functions:**
1. **Interfaces and Constants:**
   - `ICosmosStorableParams` and `ILoggingContext`: Define parameters and logging methods.
   - Constants for partition keys and collection paths like `chunkPartitionKey`, `chunkCollectionPath`.

2. **Logging Classes:**
   - `AzureLogger` and `ConsoleLogger`: Implement different logging functionalities using Azure Functions or Console.

3. **Utility Functions:**
   - `applyTransformer`: Applies an optional transformation to storable objects.

4. **Asynchronous CRUD Functions:**
   - `findStorable`, `loadStorable`, `saveStorable`, `removeStorable`: Perform database operations (find, load, save, and remove).

5. **Query Functions:**
   - `loadRecentStorables`, `loadStorables`: Load multiple storable objects from the database based on query specifications.

Overall, the module highlights usage of Azure Cosmos DB for data storage, ensuring efficient query execution while maintaining robust logging capabilities.

**Embed.ts**

The code is an Azure Function for embedding text via the Azure AI service.

**Key Functions and Classes:**
1. **calculateEmbedding**:
   - Asynchronously calculates the embedding of given text.
   - Uses `axios` with retries managed by `axiosRetry` in case of rate limits (HTTP 429) or network errors.
   - Sends a POST request to the Azure AI service and extracts the embedding from the response.

2. **embed**:
   - Handles HTTP requests to embed text data.
   - Validates session using `isSessionValid`.
   - Extracts and processes the text from the request.
   - Summarizes text if it exceeds context window size using `recursiveSummarize`.
   - Obtains embeddings via `calculateEmbedding`.
   - Returns the embedding in the HTTP response or appropriate error responses.

3. **app.http**:
   - Defines HTTP endpoint 'Embed' for GET and POST methods with anonymous authentication, handling requests using the `embed` function.

**Utilities and Helper Imports:**
- `isSessionValid`, `sessionFailResponse`, `defaultErrorResponse`, `invalidRequestResponse`: Utility functions for session validation and error handling.
- `getDefaultModel`: Fetches default model settings.
- `recursiveSummarize`: Summarizes text when necessary.

**Summary:**
This module defines an Azure Function `embed` that processes incoming HTTP requests, validates the session, optionally summarizes the input text, and calculates an embedding using a remote AI service, returning the result or appropriate errors based on the flow and validations.

**EnrichedChunkRepository.ts**

The code provides a module for handling and querying enriched chunks of data from memory using various criteria.

**Important functions and classes:**

1. `cosineSimilarity`: Computes the cosine similarity between two vectors, used for assessing relevance.
2. `lookLikeSameSource`: Compares two URLs to determine if they are from the same source, handling specific rules for YouTube and GitHub URLs.
3. `lowestOfCurrent`: Finds the index of the least relevant chunk in an array, optionally considering URL similarities.
4. `replaceIfBeatsCurrent`: Decides whether a candidate chunk should replace an existing chunk in an array based on relevance.
5. `EnrichedChunkRepositoryInMemory`: The main class storing chunks and providing methods to query chunks relevant to a summary or URL.

**Methods in EnrichedChunkRepositoryInMemory:**
1. `lookupRelevantFromSummary`: Finds relevant chunks by comparing a summary.
2. `lookupRelevantFromUrl`: Finds relevant chunks by comparing embeddings from a URL.
3. `lookupFromUrl`: Retrieves detailed information about a chunk matching a specific URL.

The code also leverages assert functions, calculates embeddings, and sorts results based on relevance.

**EnrichedChunkRepositoryDb.ts**

The `EnrichedChunkRepositoryDb` class implements the `IEnrichedChunkRepository` interface and manages enriched chunks both in an in-memory repository and through asynchronous data loading from a database.

The class constructor initializes the in-memory repository by loading chunk data from the database and setting up a semaphore to handle asynchronous operations.

Key methods include:
- `lookupRelevantFromSummary`: Searches for enriched chunks relevant to the summary in the query.
- `lookupRelevantFromUrl`: Searches for relevant enriched chunks based on a given URL.
- `lookupFromUrl`: Retrieves the summary of an enriched chunk by its URL.

Important classes and functions in the module:
- `EnrichedChunkRepositoryDb`
- `lookupRelevantFromSummary`
- `lookupRelevantFromUrl`
- `lookupFromUrl`

**EnrichedChunkRepositoryFactory.ts**

The code defines a function called `getEnrichedChunkRepository` which returns an instance of `IEnrichedChunkRepository` based on the provided `repository` type, specified by the `EChunkRepository` enumeration.

The function implements a singleton pattern, ensuring that only one instance of `EnrichedChunkRepositoryDb` is created and reused. This is important because repository instances are relatively expensive to create.

The function checks the repository type and creates an instance of `EnrichedChunkRepositoryDb` if it hasn’t been created already, and returns this instance. Currently, it handles `kWaterfall` and `kBoxer` repository types in the same way, but the structure allows for future extension.

**EnumerateModels.ts**

This code defines an Azure Function that handles HTTP requests and returns details of installed models. 

It imports required modules from `@azure/functions`, custom utilities, and types from a common TypeScript source.

A model is retrieved using `getDefaultModel()`.

The `enumerateModels` function is the key function utilized here. It checks if the session is valid with `isSessionValid(request, context)`. If valid, it processes the HTTP request, logs the details, and returns model specifications in JSON format. If any error occurs, it logs the error and sends a default error response.

The `app.http` method registers the `enumerateModels` function for handling 'GET' and 'POST' requests anonymously.

Important functions: `enumerateModels`.

Key modules: `@azure/functions`, `getDefaultModel`, `IEnumerateModelsRequest`, `IEnumerateModelsResponse`, `sessionFailResponse`, `defaultErrorResponse`, `isSessionValid`.

**EnumerateRepositories.ts**

The code defines an Azure Function named `enumerateRepositories` within a Node.js module.

The `enumerateRepositories` function is an asynchronous HTTP-triggered function that sends back details of installed repositories. It accepts `HttpRequest` and `InvocationContext` objects as parameters and returns an `HttpResponseInit` object.

The function checks if the session is valid using the `isSessionValid` utility function. If valid, it processes the JSON request and returns a response containing the repository details. If an error occurs, it logs the error and returns the default error response. If the session is invalid, a session failure response is returned.

The function is registered with the Azure Function app, supporting both GET and POST methods and having anonymous authentication level. 

Important functions: `enumerateRepositories`.

**FindEnrichedChunks.ts**

This module contains functions for an Azure Function App to search for enriched chunks of data based on query specifications.

**Key Functions:**
1. **FindRelevantEnrichedChunksFromSummary:** Validates the session and retrieves chunks relevant to the summary specification provided in the request.
2. **FindRelevantEnrichedChunksFromUrl:** Validates the session and retrieves chunks relevant to the URL specification in the request.
3. **FindEnrichedChunkFromUrl:** Validates the session and retrieves single chunks from the URL specification in the request.

**Utility Functions:** 
1. **isSessionValid, sessionFailResponse, defaultErrorResponse**: Handle session validation and response generation.
2. **getEnrichedChunkRepository**: Retrieves the repository for data operations.

HTTP endpoints for these functions are registered using `app.http()`.

**FindTheme.ts**

### Important Classes/Functions
- `findThemeCall`
- `findTheme`
- `app.http`

### Code Summary
The code defines an Azure Function to find a common theme in given text. The `findThemeCall` function asynchronously makes a POST request to an Azure endpoint using `axios` to retrieve the theme, with `axiosRetry` providing up to 5 retries for rate limit errors.

The `findTheme` function processes HTTP requests, validates the session key, extracts text and length from the request, ensures the text meets the minimum length, and calls `findThemeCall` to get the theme. The result is returned in an HTTP response, with appropriate error handling for validation, exceptions, and invalid requests.

**GenerateFluidToken.ts**

This code defines an Azure Function for generating Fluid tokens.

The initial setup imports necessary modules from Azure Functions and custom utility functions that check session validity and handle responses. It also imports the `generateToken` function from the Fluid Framework server services.

The `ScopeType` enum is redefined to include specific access levels for the Fluid container/document.

The main function, `generateFluidToken`, validates the session by calling `isSessionValid`. It checks for the presence of necessary credentials (tenantId and key). If valid, it processes the request, extracts relevant data, generates a Fluid token using `generateToken`, and returns the token.

Finally, the function is configured with HTTP methods (GET, POST) and its handler in the Azure function app. 

Important functions and classes include:
- `generateFluidToken`
- `isSessionValid`
- `sessionFailResponse`
- `defaultErrorResponse`
- `generateToken`
- `ScopeType` enum.

**GenerateQuestion.ts**

This module provides an Azure Function that generates questions based on user inputs by interacting with OpenAI's StudioLarge model.

**Important Classes or Functions:**
1. `askModel(query: IGenerateQuestionQuery)`: Makes an HTTP POST request to OpenAI's API with retries on rate-limiting or network errors. It composes the prompt from the `personaPrompt` and `questionGenerationPrompt` within the `query` and returns the generated question.
2. `generateQuestion(request: HttpRequest, context: InvocationContext)`: Handles HTTP requests to the Azure Function. It validates the session, parses the request, logs the input and output, calls `askModel` to get the question, and returns the result. If there's an error, it logs the error and returns a default error response.
3. `isSessionValid`, `sessionFailResponse`, and `defaultErrorResponse` (imported from `./Utility`): Utility functions for session validation and error handling.

The Azure Function can be published using 'func azure functionapp publish Braid-Api' or run locally with 'npm start'.

**IEnrichedChunkRepository.ts**

This code defines constants and interfaces for managing enriched content chunks.

`kDefaultSearchChunkCount` is a constant specifying the default number of chunks to search, set to 2. `kDefaultMinimumCosineSimilarity` specifies the minimum cosine similarity threshold for content comparison, set to 0.5.

The `IEnrichedChunkRepository` interface outlines three main methods: 
1. `lookupRelevantFromSummary`, which retrieves an array of relevant enriched chunks based on summary specifications.
2. `lookupRelevantFromUrl`, which retrieves relevant enriched chunks from other sources using URL specifications.
3. `lookupFromUrl`, which fetches an entire chunk summary given a URL.

Important classes or functions in the module:
- IEnrichedChunkRepository
- lookupRelevantFromSummary
- lookupRelevantFromUrl
- lookupFromUrl

**IPromptPersonaFactory.ts**

This code defines and exports a function `getSummariser` that returns a specific summariser persona configuration based on the input parameters.

Three summariser personas are defined using the `IPromptPersona` interface:
- `ArticleSummariserPersona`
- `CodeSummariserPersona`
- `SurveySummariserPersona`

Each persona has `name`, `systemPrompt`, and `itemPrompt` properties.

The `getSummariser` function receives three parameters: `persona`, `wordTarget`, and `textToSummarise`. It returns an IPromptPersona object with customized `systemPrompt` and `itemPrompt` based on `persona` type:
- `kSurveySummariser` for survey summaries.
- `kCodeSummariser` for code summaries.
- `kArticleSummariser` for general text summaries.

**LoginWithLinkedIn.ts**

This module is an Azure Function application that allows users to log in using their LinkedIn credentials.

The main function, `LoginWithLinkedIn`, validates a session key from the request parameters and redirects eligible users to LinkedIn for authentication.

The helper function, `redirectToLinkedIn`, constructs the LinkedIn authorization URL with required query parameters and facilitates the redirection.

`processAuthFromLinkedIn` handles the callback from LinkedIn, processing the authorization code, and redirects the user back to the home page with specific session details.

`redirectBackHomeWithFullPath` retrieves the access token and user profile information from LinkedIn and constructs the redirection URL to the application's home page with necessary details.

Key functions include `LoginWithLinkedIn`, `redirectToLinkedIn`, `processAuthFromLinkedIn`, and `redirectBackHomeWithFullPath`.

**QueryModelWithEnrichment.ts**

This module is designed to handle enriched queries via an Azure function app.

The `askModel` function sends an enriched query to an AI model, processes the responses, and retrieves relevant enriched chunks if specific criteria are met. It supports up to five retries for network issues or rate limiting and uses Axios for HTTP requests.

The `queryModelWithEnrichment` function validates the session, processes the HTTP request, logs the query, calls `askModel`, and returns the result as an HTTP response or handles errors appropriately.

Important functions:
1. `askModel(query: IEnrichedQuery)`: Processes and retrieves responses to an enriched query.
2. `queryModelWithEnrichment(request: HttpRequest, context: InvocationContext)`: Handles HTTP requests, validates the session, and returns the enriched query results.

**StorableActivity.ts**

This module defines endpoints for an Azure Functions application to handle activity records.

The `GetActivity`, `SaveActivity`, `RemoveActivity`, and `GetActivities` endpoints are configured using `app.http` allowing them to process HTTP requests.

`getActivity` is an asynchronous function that retrieves activity records and processes the HTTP request using `getStorableApi`.

`saveActivity` validates the session key, processes the JSON request to save activity records using `saveStorableApi`.

`removeActivity` removes the specified activity records using the `removeStorableApi` function.

`getRecentActivities` retrieves recent activity records using `getRecentStorablesApi`.

The important classes and functions are `app`, `HttpRequest`, `HttpResponseInit`, `InvocationContext`, `getActivity`, `saveActivity`, `removeActivity`, and `getRecentActivities`.

**StorableChunk.ts**

The provided module defines several Azure HTTP functions within an `app` object, designed to handle CRUD operations for "Chunk" records.

`getChunk`, `findChunk`, `saveChunk`, `removeChunk`, and `getRecentChunks` are the primary functions in this module, each mapped to their respective HTTP routes using `app.http`.

Each function validates the session key from the request query parameters, processes the JSON request, and interacts with various helper functions (`getStorableApi`, `findStorableApi`, `saveStorableApi`, `removeStorableApi`, and `getRecentStorablesApi`) imported from internal modules for performing database operations.

The handlers return a properly formatted HTTP response with either the operation result or an error message.

**StorablePage.ts**

This code defines an Azure Function app that handles HTTP requests to get or save page data. 

It imports necessary modules and methods from Azure Functions and some custom internal utilities, including `decompressString`, `pageStorableAttributes`, `getStorableApiFromQuery`, `saveStorableApi`, and various types from common modules.

Two transformer functions, `decompressHtml` and `sendHtml`, are provided to process page data: decompressing HTML content and sending it as an HTTP response, respectively.

The `getPage` function fetches a page record according to query parameters, decompresses its HTML, and returns it, while the `savePage` function saves a page record from the request's JSON payload.

Important classes or functions: 
- `decompressHtml`
- `sendHtml`
- `getPage`
- `savePage`

**StudioForTeams.ts**

- The code is a module for an Azure Function App to handle HTTP queries for a Boxer application.
  
- It uses imports from `@azure/functions`, including `app`, `HttpRequest`, `HttpResponseInit`, and `InvocationContext`.

- Key functions and constants are imported from other modules, like `askModel` from `./QueryModelWithEnrichment`, and various types from `StudioApi.Types` and `EnrichedQuery`.

- The `makeIconPath` function constructs a URL to fetch a website’s favicon.

- The main function, `boxerQuery`, processes HTTP requests with a question query parameter, and generates a response with enriched data using `askModel`.

- The function formats the response into an array of `IStudioBoxerResponseEnrichment` objects before returning it.

- The function setup is registered with the Azure Function App using `app.http`.

**Summarize.ts**

1. **Essential Imports and Setup:**
   The code imports necessary modules such as `axios`, and `axiosRetry` for HTTP requests, and various Azure Functions utilities. It uses TypeScript and enforces “strict mode”.

2. **Text Chunking:**
   The `chunkText` function splits input text into smaller chunks suitable for processing, taking into account an overlap between chunks.

3. **Single-shot Summarization:**
   The `singleShotSummarize` function performs asynchronous summarization of a text. It uses a specified persona and makes HTTP requests to an AI service for summarization, with retry logic for handling rate limits.

4. **Recursive Summarization:**
   The `recursiveSummarize` function performs hierarchical, multi-level summarization by breaking long texts into chunks, summarizing each, and potentially summarizing the combined summary again if needed.

5. **HTTP Handler:**
   The `summarize` function is an HTTP handler for processing HTTP requests to summarize text. It validates sessions, processes input, and calls `recursiveSummarize` to return the summarized text or error responses.

6. **Azure Function Binding:**
   The code finally binds the `summarize` function to the HTTP endpoint "Summarize", handling both GET and POST requests with anonymous authentication.

**Important functions and classes include:**
- `chunkText`
- `singleShotSummarize`
- `recursiveSummarize`
- `summarize`


**TestForSummariseFail.ts**

This code defines a serverless application using Azure Functions to test if a summary correctly conveys the main body of a given text.

**Important Classes/Functions:**
1. `testForSummariseFailCall`: Asynchronously sends a POST request to an Azure endpoint to determine if a summary fails or succeeds. It retries the request up to five times if rate limit errors occur.
2. `testForSummariseFail`: Handles HTTP requests, validates sessions, and uses `testForSummariseFailCall` to process the text and determine if the summary is valid.

**Key Points:**
- Uses `axios` for HTTP requests and `axiosRetry` for retrying failed requests.
- Validates session keys using `isSessionValid`.
- Returns specific error responses with `sessionFailResponse` and `defaultErrorResponse`.
- Configures Azure Functions with defined HTTP methods and authentication levels.

**Utility.ts**

This module is designed for use with Azure Functions and provides several utility functions to handle HTTP responses and session validation. 

The `isSessionValid` function checks if a session provided in the request matches one of the valid session keys stored in the environment variables. It returns `true` if the session is valid and logs the validation result using the provided context.

The `sessionFailResponse` function generates an HTTP response with a status code of 401 (Unauthorized) indicating that the session validation failed.

The `defaultOkResponse` function creates an HTTP response with status code 200 (OK) and a body of "Ok".

The `defaultErrorResponse` function produces an HTTP response with status code 500 (Server Error) to indicate unexpected server issues.

The `invalidRequestResponse` function returns a 400 (Bad Request) status with a custom error message.

The `notFoundResponse` function generates a 404 (Not Found) response with an empty body.

Important functions: `isSessionValid`, `sessionFailResponse`, `defaultOkResponse`, `defaultErrorResponse`, `invalidRequestResponse`, `notFoundResponse`.

