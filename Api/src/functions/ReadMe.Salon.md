**AzureStorableApi.ts**

The module handles HTTP requests to manage `Storable` objects in Azure CosmosDB.

Important functions:
1. `findStorableApi`: Validates session, logs actions, and retrieves a storable based on a query. Utilizes helper `applyTransformer`.
2. `getStorableApi`: Similar to `findStorableApi`, but the actual processing is delegated to `getStorableApiCommon`.
3. `getStorableApiFromQuery`: Retrieves storable using query parameters without session validation.
4. `getStorableApiCommon`: Common retrieval logic for `getStorableApi` and `getStorableApiFromQuery`.
5. `saveStorableApi`: Validates session, processes request JSON, logs, and saves the storable.
6. `removeStorableApi`: Validates session, processes request JSON, logs, and removes the storable.
7. `getRecentStorablesApi`: Validates session and retrieves recent storables.

Helper functions:
- `applyTransformer` and `applyArrayTransformer`: Apply optional transformer functions to storable(s).

Key imports include Azure functions, utilities for session validation, responses, and handling storables with CosmosDB operations.

**CheckSession.ts**

The code defines a function called `checkSession` which validates a session key provided in HTTP request query parameters. 

If the session key is valid, it logs a success message and returns a 200 status response with the session key. If the session key is invalid, it logs a failure message and returns a 401 status response indicating authorization failure.

The `app.http` function sets up an HTTP trigger for the Azure Function named `CheckSession`, allowing GET and POST methods with anonymous authentication.

Key imports: `app`, `HttpRequest`, `HttpResponseInit`, `InvocationContext` from "@azure/functions" and utility functions `isSessionValid`, `sessionFailResponse`, `defaultOkResponse` from "./Utility".

**Chunk.ts**

The module is for an Azure Function app, designed to deploy using 'func azure functionapp publish Braid-Api' or run locally with 'npm start'.

The main function `chunk` processes HTTP requests for text chunking, using the auxiliary function `chunkText` to split input text into chunks based on specified size and overlap.

`chunkText` utilizes `model.chunkText` to divide the text accordingly, returning an array of strings.

The `chunk` function validates the session using `isSessionValid` before processing, handles requests to extract and chunk the text, and returns a response with either the chunks or an error.

Classes/functions: `chunkText`, `chunk`, `isSessionValid`, `sessionFailResponse`, `defaultErrorResponse`.

The `app.http` binds the `chunk` handler to HTTP methods 'GET' and 'POST' for the 'Chunk' endpoint.

**Classify.ts**

This code provides an Azure Function-based classification service for textual data, using an AI assistant. 

The `decodeClassification` function decodes an initial classification string to a human-readable format. 

The `singleShotClassify` function classifies the given text into predefined subject areas, leveraging OpenAI's API with retry logic for network or rate-limit errors.

The `classify` function serves as the main handler for HTTP requests. It validates the session, processes the input text and classification parameters, invokes the classification function, and constructs an HTTP response with the result or error information.

Important classes and functions:
1. `decodeClassification`
2. `singleShotClassify`
3. `classify`
4. `sessionFailResponse`, `defaultErrorResponse`, `invalidRequestResponse` (from Utility module)

**CosmosRepositoryApi.ts**

This module provides several functions to generate authorization tokens and headers for HTTP requests to a Cosmos DB based on specific parameters such as verb, resource type, resourceId, and date.

1. `getAuthorizationTokenUsingMasterKey`: Generates a base64-encoded authorization token using a master key and HTTP request details.
2. `storableToken`: Generates an activity token for authorization using `getAuthorizationTokenUsingMasterKey`.
3. `makeStorableDeleteToken`: Generates a token specifically for delete operations in Cosmos DB.
4. `makeStorablePostToken`: Generates a post activity token.
5. `makePostHeader`: Creates headers required for a POST request to Cosmos DB.
6. `makeDeleteHeader`: Creates headers needed for a delete request.
7. `makePostQueryHeader`: Creates headers for a POST query.

The `crypto` module is utilized for HMAC SHA-256 hashing, and the structure relies on specific date formats, HTTP verbs, and key-based authentication.

**CosmosStorableApi.ts**

This module interacts with Microsoft's Azure Cosmos DB to perform CRUD operations on "storable" records.

**Important Classes and Functions:**

1. **Cosmos Functions**:
    - `findStorable`
    - `loadStorable`
    - `saveStorable`
    - `removeStorable`
    - `loadRecentStorables`
    - `loadStorables`

These functions support finding, loading, saving, removing, and querying records.

2. **Helper Functions**:
    - `applyTransformer` - Applies transformations to storable records.

3. **Logger Classes**:
    - `AzureLogger`
    - `ConsoleLogger`

These log actions and errors to different contexts (Azure and console).

4. **Configuration Objects**:
    - `chunkStorableAttributes`
    - `activityStorableAttributes`
    - `pageStorableAttributes`

These objects store configurations (keys, paths) for different collections.

**Embed.ts**

This code defines an Azure Function that processes embedding requests for text data using the Azure AI service.

The `calculateEmbedding` function takes a text input, sends a POST request to the Azure AI service, and returns the embedding as an array of numbers. It also includes retry logic for handling rate limits and network errors.

The `embed` function handles HTTP requests for embedding text data. It validates the session, processes the request, and potentially summarizes the text if it exceeds context window size before calling `calculateEmbedding` to generate the embedding. Responses are constructed based on session validation and processing outcomes.

Key Functions:
1. `calculateEmbedding`
2. `embed`

Key Classes:
1. `HttpRequest`
2. `HttpResponseInit`
3. `InvocationContext`

Important Modules from the Import Section:
1. `axios`
2. `axiosRetry`
3. `isSessionValid`, `sessionFailResponse`, `defaultErrorResponse`, `invalidRequestResponse` (from "Utility")
4. `getDefaultModel` (from "IModelFactory")
5. `recursiveSummarize` (from "Summarize")
6. `IEmbedRequest`, `IEmbedResponse` (from "EmbedApi.Types")

**EnrichedChunkRepository.ts**

This code provides a module for managing and querying enriched chunks, which are enhanced pieces of content with metadata such as embeddings.

The `cosineSimilarity` function calculates the cosine similarity between two numerical vectors, determining the similarity score between them.

The `lookLikeSameSource` function compares two URLs to see if they originate from the same source, specifically handling YouTube video IDs and GitHub repositories.

The `lowestOfCurrent` function finds the index of the entry with the lowest relevance in an array, and optionally checks if it is from the same source as a given URL.

The `replaceIfBeatsCurrent` function replaces a candidate enriched chunk in a current array if the candidate meets certain criteria, ensuring the array does not have multiple references to the same source.

The `EnrichedChunkRepositoryInMemory` class manages in-memory storage of enriched chunks and provides methods for querying relevant chunks based on text summaries (`lookupRelevantFromSummary`) and URLs (`lookupRelevantFromUrl`), and for finding a chunk summary based on a URL (`lookupFromUrl`). This class ensures that chunks are selected based on relevance and similarity criteria.

**EnrichedChunkRepositoryDb.ts**

The `EnrichedChunkRepositoryDb` class implements the `IEnrichedChunkRepository` interface and initializes an in-memory repository of enriched chunks while managing asynchronous data loading from a database. 

The constructor sets up an instance of the in-memory repository with an initial empty array and a semaphore for handling data loading. It uses a logger and interacts with the `loadStorables` function to fetch chunk data.

The `lookupRelevantFromSummary` method searches for chunks relevant to the text in the summary field of the query. 

The `lookupRelevantFromUrl` method searches for chunks relevant to a given URL from other sources.

The `lookupFromUrl` method retrieves a chunk summary given its URL.

Important classes and functions include `EnrichedChunkRepositoryDb` (class), `lookupRelevantFromSummary` (method), `lookupRelevantFromUrl` (method), and `lookupFromUrl` (method).

**EnrichedChunkRepositoryFactory.ts**

This module provides functionality to retrieve a repository instance that implements `IEnrichedChunkRepository`.

The `getEnrichedChunkRepository` function accepts a parameter `repository` of type `EChunkRepository`. Based on the `repository` type, it returns an instance of `EnrichedChunkRepositoryDb`. 

Currently, both `kWaterfall` and `kBoxer` repository types return an instance of `EnrichedChunkRepositoryDb`.

The code ensures that only one instance of `EnrichedChunkRepositoryDb` is created and reused (singleton pattern). This design is used to manage the expensive nature of repository creation.

Important classes/functions: `getEnrichedChunkRepository`, `IEnrichedChunkRepository`, `EnrichedChunkRepositoryDb`, `EChunkRepository`.

**EnumerateModels.ts**

This code defines an Azure Function that enumerates installed models, keeping Python code consistent with TypeScript.

The `enumerateModels` function is asynchronous and handles HTTP requests. It checks if the session is valid and processes the request to return model details. If the session is invalid, it logs an error message and returns a session failure response.

Key imported modules include `app`, `HttpRequest`, and `HttpResponseInit` from "@azure/functions", and utility functions `sessionFailResponse`, `defaultErrorResponse`, and `isSessionValid` from "./Utility".

The `app.http` function registers the `enumerateModels` function as an HTTP trigger for GET and POST requests with open access.

**EnumerateRepositories.ts**

This module defines an Azure Function that lists installed repositories.

It imports the necessary modules from `@azure/functions`, common types and utility functions from local files.

The main function `enumerateRepositories` handles HTTP requests. It checks if a session is valid using the `isSessionValid` function.  

If the session is valid, it parses the JSON request, logs it, and provides a hard-coded response with repository details.

In case of an error, it logs the error and returns a default error response from `Utility`.

The function is exported and configured to handle both `GET` and `POST` requests with anonymous authentication through the `app.http` method from `@azure/functions`.

**FindEnrichedChunks.ts**

This module provides Azure Functions to handle HTTP requests for retrieving enriched chunks of data.

The function `FindRelevantEnrichedChunksFromSummary` processes HTTP requests to find chunks relevant to a summary. It validates the session, parses the request body for specifications, queries the appropriate repository, and returns the results or an error response.

`FindRelevantEnrichedChunksFromUrl` works similarly, but retrieves chunks relevant to a URL instead.

`FindEnrichedChunkFromUrl` fetches specific chunks directly from the URL provided in the request, following a similar process.

The `app.http` configurations map these functions to HTTP endpoints, allowing anonymous access through GET and POST methods. 

Important classes/functions: `FindRelevantEnrichedChunksFromSummary`, `FindRelevantEnrichedChunksFromUrl`, `FindEnrichedChunkFromUrl`, `isSessionValid`, `sessionFailResponse`, `defaultErrorResponse`.

**FindTheme.ts**

The module is an Azure Function App that processes HTTP requests to determine a common theme from specified text. The important components and functions include:

1. `findThemeCall`: An asynchronous function that makes an HTTP POST request to an Azure endpoint using `axios` and `axiosRetry` for retrying requests up to 5 times in case of rate limit errors. It sends the text paragraphs and requests the most common theme from the specified text length.

2. `findTheme`: An HTTP handler function that validates the session key and checks if the input text meets the minimum length requirement. It calls `findThemeCall` and formats the theme response.

Key Imports:
- `app`, `HttpRequest`, `HttpResponseInit`, `InvocationContext` from `@azure/functions`
- `axios`, `axiosRetry`
- Utility functions: `sessionFailResponse`, `defaultErrorResponse`, `isSessionValid`, `invalidRequestResponse`
- Type Definitions: `IFindThemeRequest`, `IFindThemeResponse`

**GenerateFluidToken.ts**

This code defines an Azure Function that generates a Fluid token for authentication in Fluid framework applications.

The main function, `generateFluidToken`, checks if a session is valid using the `isSessionValid` function. If valid, it processes the request to generate a Fluid token. Required parameters for token generation include `tenantId`, `documentId`, `userId`, and `userName`.

The Fluid token is created using the `generateToken` function with specific `ScopeType` permissions and user information. 

Key dependencies include the `@azure/functions`, `@fluidframework/server-services-client`, and a few utility functions from `./Utility`.

The Azure function endpoints are set up to accept `GET` and `POST` methods with anonymous access.

**GenerateQuestion.ts**

The code is designed to run an Azure Function that generates questions using OpenAI's Chat Completion API.

**Important functions:**
- **askModel(query: IGenerateQuestionQuery)**: Formats input data, including retry logic for API requests, and sends a POST request to the OpenAI API to generate a question based on the input prompt.
- **generateQuestion(request: HttpRequest, context: InvocationContext)**: Handles HTTP requests, verifies session validity, processes the input, invokes `askModel`, and returns the response or error.

**Important imports:**
- `axios` and `axiosRetry` for making HTTP requests and handling retries.
- Custom types and utility functions for session validation and error handling.

The function is designed to be deployable to Azure and runnable locally.

**IEnrichedChunkRepository.ts**

This module imports specific interfaces (`IRelevantEnrichedChunk`, `IChunkQueryRelevantToSummarySpec`, `IEnrichedChunkSummary`, `IChunkQueryRelevantToUrlSpec`) from another module to manage enriched chunk data.

The constants `kDefaultSearchChunkCount` and `kDefaultMinimumCosineSimilarity` are defined to set default values for search chunk count and minimum cosine similarity, respectively.

The `IEnrichedChunkRepository` interface outlines three asynchronous methods:
1. `lookupRelevantFromSummary`: Retrieves similar content based on a summary specification.
2. `lookupRelevantFromUrl`: Finds similar content from other sources based on a URL specification.
3. `lookupFromUrl`: Retrieves an entire chunk of data given its URL.

These methods return promises that resolve to either arrays of relevant chunks or an optional chunk summary.

**IPromptPersonaFactory.ts**

The provided code defines a module for summarising different types of text, including articles, code, and survey responses.

**Important Classes or Functions:**
- **ArticleSummariserPersona:** Defines the persona for summarising articles.
- **CodeSummariserPersona:** Defines the persona for summarising code.
- **SurveySummariserPersona:** Defines the persona for summarising survey responses.
- **getSummariser():** Function that accepts a persona type, a word target for the summary, and the text to summarise. It returns an appropriate persona with prompts set based on the input. This switch statement configures the `systemPrompt` and `itemPrompt` for each persona type.

Each persona is an implementation of the `IPromptPersona` interface.

**LoginWithLinkedIn.ts**

This module contains an Azure Function API for LinkedIn authentication. 

The `LoginWithLinkedIn` function validates an incoming session key and redirects users to LinkedIn for authentication using the `redirectToLinkedIn` function if the session key is valid. 

`redirectToLinkedIn` constructs the LinkedIn authentication URL and redirects the user.

`processAuthFromLinkedIn` processes the authentication response from LinkedIn, extracting parameters from the query and calling `redirectBackHomeWithFullPath` to manage the completion of the authentication. 

`redirectBackHomeWithFullPath` exchanges the authorization code for an access token, retrieves the user's profile information, and redirects the user back to the home page with the necessary query parameters.

Important functions: `LoginWithLinkedIn`, `redirectToLinkedIn`, `processAuthFromLinkedIn`, `redirectBackHomeWithFullPath`.

**QueryModelWithEnrichment.ts**

This code is used to handle and respond to HTTP requests in an Azure Function App with query enrichment aspects.

The `askModel` function asynchronously sends an enriched query to an AI model using the `axios` library, with a retry mechanism in case of rate limits or network issues. It combines the query and historic conversation elements, making both a direct query and an enriched prompt query to the model, and processes the responses.

The `queryModelWithEnrichment` function validates the incoming session, processes the request by calling the `askModel` function, and returns the enriched query response.

Important classes/functions:
- `askModel`
- `queryModelWithEnrichment`
- `app.http`

**StorableActivity.ts**

The code is for an Azure Function App by Braid Technologies Ltd which handles CRUD operations on activities.

The `getActivity` function saves an activity record, validates session keys, processes the JSON request, and then saves the activity. It returns an HTTP response.

The `saveActivity` function performs similar tasks, accepting HTTP requests, validating session keys, saving activity data, and returning an HTTP response.

The `removeActivity` function deletes an activity record based on the provided HTTP request and context.

The `getRecentActivities` function retrieves recent activity records.

The third-party imports and custom modules facilitate communication with Azure Functions and the Cosmos database. Important classes/functions include `getActivity`, `saveActivity`, `removeActivity`, `getRecentActivities`, and `activityStorableAttributes`.

**StorableChunk.ts**

This code creates an Azure Function App that manages "Chunk" records, providing endpoints for various operations, such as getting, finding, saving, removing, and retrieving recent chunks.

Key classes and functions include:
- `getChunk`: Loads a Chunk record based on the HTTP request and context.
- `findChunk`: Finds a specific Chunk record based on the HTTP request and context.
- `saveChunk`: Saves Chunk data from the HTTP request.
- `removeChunk`: Removes a specified Chunk record.
- `getRecentChunks`: Retrieves recent Chunk records.
- All operations validate session keys present in the requests.
- Third-party imports like `app`, `HttpRequest`, and `HttpResponseInit` from "@azure/functions".
- Internal function calls to methods like `getStorableApi`, `findStorableApi`, `saveStorableApi`, `removeStorableApi`, and `getRecentStorablesApi` for database interactions.

**StorablePage.ts**

The code is for an Azure Function app used to manage page records, deployed via Azure or run locally with npm.

It includes third-party imports (`@azure/functions`) and internal imports such as `CosmosStorableApi`, `AzureStorableApi`, and several interfaces (`IStorable`, `IStoredPage`).

The `decompressHtml` function decompresses the `html` field of a storable page, while the `sendHtml` function returns an HTTP response with the `html` field as the body.

The `getPage` function handles 'GET' and 'POST' requests to load a page record, validating session keys and decompressing HTML as needed.

The `savePage` function handles 'POST' requests, validating session keys and saving page data.

Key methods: `decompressHtml`, `sendHtml`, `getPage`, `savePage`.

**StudioForTeams.ts**

This code defines an Azure Function `boxerQuery` that processes boxer query requests for an application. 

Classes and functions in the module:
- `boxerQuery`: Core function that handles HTTP requests, logs the question, translates it to an enriched format, calls a model for processing (`askModel`), and formats the response.
- `makeIconPath`: Utility function that generates an icon URL from a given URL using Google's favicon service.
- `app.http`: Registers the `boxerQuery` function to handle HTTP GET and POST requests with anonymous authentication.

Important imports and their usage:
- `@azure/functions`: Provides necessary functions and classes for Azure Functions (e.g., `HttpRequest`, `HttpResponseInit`).
- `IStudioBoxerRequest`, `IStudioBoxerResponseEnrichment`: Common request and response types.
- `EStandardPrompts`, `IEnrichedQuery`, `EChunkRepository`: Enrichment and repository constants and types.
- `defaultErrorResponse`, `invalidRequestResponse`: Utility responses for handling errors and invalid requests.
- `askModel`: Function called to process the enriched query and return a formatted response.

**Summarize.ts**

This code provides an Azure Function for text summarization. It uses an AI model to divide and summarize text, with support for running locally or deployed to Azure.

- **chunkText**: Splits the input text into smaller chunks based on model constraints for efficient processing.
- **singleShotSummarize**: Uses an AI model to summarize a single chunk of text, with retry logic for API rate limits.
- **recursiveSummarize**: Summarizes text recursively by breaking it into chunks, summarizing each, and then combining the results for a final summary.
- **summarize**: The main function that processes HTTP requests. It validates sessions, processes input, and returns the text summary or error response.

Important classes/functions: 
- **chunkText**
- **singleShotSummarize**
- **recursiveSummarize**
- **summarize**

External libraries used:
- **@azure/functions**
- **axios**
- **axios-retry**

**TestForSummariseFail.ts**

This code defines an Azure Function that validates, processes, and analyzes text to determine if a summarizer has successfully created a valid summary.

### Important Functions and Classes
- `testForSummariseFailCall`: Makes a POST request to an Azure endpoint using `axios` to validate if a provided summary is correct. Utilizes `axiosRetry` for retrying the request if rate limited.
- `testForSummariseFail`: Handles incoming HTTP requests, validates session keys, processes the request data, and returns a response indicating whether the summary was valid.

### Additional Details
- The `app.http` method registers the function endpoint, exposing it to GET and POST requests.
- The function integrates utility methods like `isSessionValid`, `sessionFailResponse`, and `defaultErrorResponse` for session management and error handling.

**Utility.ts**

This module provides utility functions for handling HTTP responses and validating session keys within an Azure Function app.

The `isSessionValid` function validates a session by checking the 'session' query parameter from the request against session keys stored in environment variables. It logs the result and returns true if the session is valid, otherwise false.

The `sessionFailResponse` function generates a 401 Unauthorized HTTP response when session validation fails.

The `defaultOkResponse` function returns a basic 200 Ok HTTP response.

The `defaultErrorResponse` function returns a 500 Internal Server Error HTTP response for unexpected issues.

The `invalidRequestResponse` function returns a 400 Bad Request HTTP response with a specific message.

The `notFoundResponse` function generates a 404 Not Found HTTP response.

