**CheckSession.Azure.ts**

The code is for an Azure Function module named `CheckSession` that validates session keys against predefined valid sessions stored in environment variables. 

It exposes an HTTP endpoint that supports both GET and POST methods and operates with anonymous access but requires a valid session key in the request parameters.

The `checkSession` function is the key function, which checks if the session key from the request parameters is valid using the `isSessionValid` function. If valid, it returns a 200 status with the session key; otherwise, it returns a 401 status with an authorization failure message.

Important classes or functions:
1. `checkSession`
2. `app.http`
3. `isSessionValid`
4. `sessionFailResponse`
5. `defaultOkResponse`

**Chunk.Azure.ts**

This module, named 'Chunk', is an Azure Function that provides text chunking capabilities. It splits input text into manageable chunks based on configurable size and overlap settings. This functionality is integrated into Braid API infrastructure and works with authenticated sessions.

The primary function `chunkText` splits the input text into chunks as specified by chunk size and overlap words. Another important function, `chunk`, processes HTTP requests to chunk text based on session validation. It handles errors and returns standardized API responses.

Key classes/functions:
- `chunkText`
- `chunk`
- `isSessionValid`
- `sessionFailResponse`
- `defaultErrorResponse`

**Classify.Azure.ts**

The module named `Classify` is designed as an Azure Function for text classification using OpenAI's API. It validates sessions, handles errors, and formats responses.

The `decodeClassification` function interprets classification strings into human-readable formats or returns "Unknown" if no match is found.

`singleShotClassify` is an asynchronous function that uses an AI model for classifying provided text into one of the predefined categories.

The `classify` function handles HTTP requests for text classification, ensuring session validity, checking input criteria, and utilizing `singleShotClassify` to get classified results. It formats these results into an HTTP response or provides error messages accordingly.

Important Functions:
- `decodeClassification`
- `singleShotClassify`
- `classify`

**CosmosRepositoryApi.ts**

**CosmosRepositoryApi** is a module designed to manage authorization and headers for Azure Cosmos DB interactions, adhering to Microsoft's authentication norms.

The **`getAuthorizationTokenUsingMasterKey`** function generates an authorization token using given parameters including HTTP verb, resource details, date, and a master key.

**`storableToken`** creates a token for authorizing various activities by calling `getAuthorizationTokenUsingMasterKey`.

**`makeStorableDeleteToken`** and **`makeStorablePostToken`** generate tokens specifically for DELETE and POST operations respectively.

Functions **`makePostHeader`**, **`makeDeleteHeader`**, and **`makePostQueryHeader`** produce the necessary headers for their respective operations, including POST, DELETE, and query requests.

The module ensures all its functionalities are aligned with Azure Cosmos DB's REST API requirements.

**Embed.Azure.ts**

This module, named "Embed," utilizes Azure Function to provide text embedding services using Azure AI.

The `embed` function is the primary handler, processing requests to convert text into numerical embeddings. It checks for session validity using `isSessionValid`. If the text exceeds the model's context window, it summarizes the text via `recursiveSummarize`.

The function employs retry logic for rate limiting and network issues and validates all requests. It returns the embedding response in case of success, or appropriate error responses if there are issues.

Important functions and classes used:
- `embed`
- `isSessionValid`
- `sessionFailResponse`
- `defaultErrorResponse`
- `invalidRequestResponse`
- `recursiveSummarize`
- `getDefaultModel`
- `getEmbeddingModelDriver`

**EnrichedChunkRepository.ts**

The code implements an in-memory repository `EnrichedChunkRepositoryInMemory` for storing and querying enriched chunks, adhering to the `IEnrichedChunkRepository` interface.

The function `cosineSimilarity` computes the cosine similarity between two vectors.

The function `lookLikeSameSource` determines if two URLs are from the same source, with specific logic for YouTube and GitHub URLs.

The function `lowestOfCurrent` finds the index of the entry with the lowest relevance in an array, which can also consider entries from the same source.

The function `replaceIfBeatsCurrent` replaces a chunk in the current array if it meets specific relevance criteria.

The `EnrichedChunkRepositoryInMemory` class provides methods: `lookupRelevantFromSummary` to find relevant chunks based on a summary, `lookupRelevantFromUrl` to find relevant chunks based on a URL, and `lookupFromUrl` to retrieve chunks based on a URL. Functions used in class methods include `throwIfUndefined` from `"../../../CommonTs/src/Asserts"` and `getEmbeddingModelDriver` from `"../../../CommonTs/src/IModelFactory"`.

**EnrichedChunkRepositoryDb.ts**

**Important Classes and Functions:**
1. `EnrichedChunkRepositoryDb`
2. `lookupRelevantFromSummary`
3. `lookupRelevantFromUrl`
4. `lookupFromUrl`

**Summary:**
The `EnrichedChunkRepositoryDb` class implements the `IEnrichedChunkRepository` interface. It initializes an in-memory repository and manages asynchronous loading of chunk data from a database. The primary functionalities include looking up enriched chunks relevant to a summary or URL and retrieving chunk summaries by URL. 

During initialization, it sets up an array of enriched chunks, creates an in-memory repository, and manages data loading with a semaphore for asynchronous operations. Chunk properties such as `id`, `embedding`, `url`, `text`, and `summary` are extracted from the database and loaded into the repository.

**EnrichedChunkRepositoryFactory.ts**

The module `EnrichedChunkRepositoryFactory` is responsible for creating and managing instances of `IEnrichedChunkRepository` based on the specified repository type. It uses the singleton pattern to ensure only one instance of each repository type is created for optimized performance.

It imports necessary interfaces and classes such as `IEnrichedChunkRepository`, `EnrichedChunkRepositoryDb`, and `EChunkRepository`. 

The function `getEnrichedChunkRepository(repository: EChunkRepository): IEnrichedChunkRepository` generates and returns an instance of `IEnrichedChunkRepository` based on the repository type passed in. Currently, both 'kWaterfall' and 'kBoxer' types return an instance of `EnrichedChunkRepositoryDb`. 

It utilizes a singleton design pattern to avoid creating multiple instances of such repositories, which are relatively expensive.

**EnumerateModels.Azure.ts**

This code is an Azure Function module that provides details of installed models, including default, large, and small models, and returns them in a structured format.

The main function `enumerateModels` is an asynchronous function that handles HTTP GET and POST requests. It starts by validating the session using `isSessionValid` and, if the session is valid, it processes the request to retrieve the model details.

It uses `getDefaultModel` to obtain the default model details and constructs a response object with model IDs. If an error occurs during request processing, it logs the error and returns a default error response.

Key functions: `enumerateModels`, `isSessionValid`.

Key imports include `app` for routing, `getDefaultModel` for model retrieval, and utilities like `sessionFailResponse` and `defaultErrorResponse` for responses.

**EnumerateRepositories.Azure.ts**

This module, `EnumerateRepositories`, is an Azure Function that handles the retrieval of installed repository details, specifically Boxer and Waterfall repositories. 

The primary function is `enumerateRepositories`, which processes HTTP requests, validates the session, and constructs a response containing repository IDs. It also includes error handling mechanisms for any issues encountered during the request processing.

Important dependencies include session validation functions such as `isSessionValid`, and error response utilities like `sessionFailResponse` and `defaultErrorResponse`.

The Azure Function is set up to handle both GET and POST requests and can be run locally or published to Azure with specific commands.

**FindEnrichedChunks.Azure.ts**

This code is an Azure Function module titled `FindEnrichedChunks`. It provides methods for retrieving enriched chunks based on URL or summary.

The module handles session authentication validation, error handling, and data retrieval from a specified repository named `kWaterfall`.

Three main functions handle the processing:
1. `FindRelevantEnrichedChunksFromSummary`: Retrieves enriched chunks based on a summary specification.
2. `FindRelevantEnrichedChunksFromUrl`: Retrieves relevant enriched chunks based on a URL specification.
3. `FindEnrichedChunkFromUrl`: Retrieves a single enriched chunk based on a URL specification.

Each function checks session validity using `isSessionValid` and handles errors, returning structured responses based on success or failure.

Key imported modules include `app`, `HttpRequest`, `HttpResponseInit`, and `InvocationContext` from `@azure/functions`. The utility functions and repositories are imported from local and shared paths.

**FindTheme.Azure.ts**

The module `FindTheme` is an Azure Function for deriving a common theme from multiple text paragraphs.

The `findThemeCall` function sends a POST request to an Azure endpoint to identify the most common theme in the given text. It uses axios for HTTP requests and retries up to five times in case of rate-limit errors.

The `findTheme` function validates the user session, parses the request to extract the text and desired theme length, and calls `findThemeCall` to get the theme. It handles errors and returns either the theme in a structured format or an error message.

Key classes and functions include `findThemeCall`, `findTheme`, and session handling utilities from `Utility.Azure`.

**GenerateFluidToken.Azure.ts**

This module, `GenerateFluidToken`, is an Azure Function used to generate Fluid tokens for authenticating requests to the Fluid framework. 

It ensures session validation through the `isSessionValid` function and employs error handling for issues encountered during request processing, using `sessionFailResponse` and `defaultErrorResponse`.

The core function `generateFluidToken` processes the HTTP request, validates required parameters, and generates the Fluid token with the `generateToken` function.

Important classes/functions:
- `generateFluidToken`
- `ScopeType` (an enumeration)
- `isSessionValid`
- `sessionFailResponse`
- `defaultErrorResponse`

The function is configured to handle HTTP GET and POST methods anonymously.

**GenerateQuestion.Azure.ts**

This Azure Function module, named `GenerateQuestion`, generates a question based on a provided summary and responds in a structured format. It includes session authentication validation and error handling for request processing.

The `askModel` function takes a query object, generates a response using a default chat model driver, and returns an object containing the generated question. It utilizes the `IModelConversationPrompt` and `EPromptPersona`.

The `generateQuestion` function processes HTTP requests, validates sessions, parses the summary from the request, and calls `askModel` to generate the question. It handles logging and returns appropriate HTTP responses, including error and session failure responses.

Important functions and classes:
1. `askModel(query: IGenerateQuestionQuery): Promise<IQuestionGenerationResponse>`
2. `generateQuestion(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>`

**IEnrichedChunkRepository.ts**

The `IEnrichedChunkRepository` module defines an interface for querying and retrieving enriched chunks based on URL and summary. It includes methods for validating session authentication and handling errors during request processing.

The `lookupRelevantFromSummary` function searches for relevant content matching a given summary specification.

The `lookupRelevantFromUrl` function searches for relevant content from other sources based on URL specification.

The `lookupFromUrl` function retrieves the entire chunk given its URL.

Constants `kDefaultSearchChunkCount` and `kDefaultMinimumCosineSimilarity` provide default values for search chunk count and minimum cosine similarity, respectively.

Key imports include `IRelevantEnrichedChunk`, `IChunkQueryRelevantToSummarySpec`, `IEnrichedChunkSummary`, and `IChunkQueryRelevantToUrlSpec`.

**LoginWithLinkedIn.Azure.ts**

The `LoginWithLinkedIn` module is an Azure Function for authenticating users via LinkedIn. It handles session validation and redirects to LinkedIn for authentication.

Key functions include:
- **LoginWithLinkedIn**: Handles incoming HTTP requests, checks session keys, and redirects to LinkedIn if validation passes. If validation fails, it returns a 401 Unauthorized response.
- **redirectToLinkedIn**: Constructs a LinkedIn authentication URL and returns a 302 redirect response.
- **redirectBackHomeWithFullPath**: Completes the LinkedIn authentication process, retrieves user profile information, and redirects back to the home page with user details encoded in the URL.
- **processAuthFromLinkedIn**: Processes the LinkedIn authentication response, validating session and code, and calls `redirectBackHomeWithFullPath`.

These functions are set to run on both GET and POST requests with anonymous authentication level. The module also includes detailed error handling and context logging.

**QueryModelWithEnrichment.ts**

The `QueryModelWithEnrichment` module handles querying an AI model with document enrichment, including direct queries and enriched queries that use context from a document repository. It integrates with Azure Functions and includes retry logic for handling rate limits.

Key functions include:
- `askModel(query: IEnrichedQuery): Promise<IEnrichedResponse>`: Asynchronously sends an enriched query to a model, fetching relevant document chunks and returning an enriched response.
- `queryModelWithEnrichment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>`: Validates the session, processes the query, and returns the result as an HTTP response.

Important imports include Azure functions standard libraries and model-related components from `CommonTs`. The enrichment process involves parallel processing of direct and enriched model queries, with document enrichment based on similarity matching. The module ensures session validation and efficient error handling.

**StorableActivity.Azure.ts**

The `StorableActivity` module is an Azure Function application for managing storable activity records. It facilitates the retrieval, saving, removal, and fetching of recent activities. 

Key functions include `getActivity`, `saveActivity`, `removeActivity`, and `getRecentActivities`, which are handlers for HTTP requests, each performing respective CRUD operations. 

These functions validate session keys and process requests to interact with external APIs defined in `StorableApi.Azure` and `StorableApi.Cosmos`. 

The module sets up HTTP endpoints using `app.http()` from "@azure/functions" and specifies request methods and authentication levels for each handler.

**StorableApi.Azure.ts**

The `AzureStorableApi` module provides REST API endpoints for CRUD operations on IStorable objects in Azure Cosmos DB using Azure Functions. The module includes session validation, request parsing, and response formatting for actions such as finding, getting, saving, and removing IStorable objects. 

Key functions in the module:

- `findStorableApi`: Loads and retrieves a storable based on the provided request and session key.
- `getStorableApi`: Retrieves a storable by its ID after validating the session.
- `getStorableApiFromQuery`: Retrieves a storable based on a query parameter without session validation.
- `getStorableApiCommon`: Shared logic to load a storable.
- `saveStorableApi`: Saves a new storable to the database, validating the session key.
- `removeStorableApi`: Removes a storable document from the database after session validation.
- `getRecentStorablesApi`: Retrieves recent storables based on a multi-query specification.

The module also supports custom transformers to modify data before storage and after retrieval, and robust error handling through Azure Functions context. Importantly, it addresses session validation and batch operations for retrieving storables.

**StorableApi.Cosmos.ts**

This module, `CosmosStorableApi`, provides an API to interact with Azure Cosmos DB, enabling CRUD operations, query capabilities, and logging for storable objects.

The following important classes and functions are included:
- `AzureLogger` and `ConsoleLogger`: Interfaces for logging messages with Azure Functions or the console.
- `applyTransformer`: Applies a transformation to a storable if a transformer function is provided.
- `findStorable`, `loadStorable`, `saveStorable`, `removeStorable`: CRUD functions for handling storable objects in Cosmos DB.
- `loadRecentStorables` and `loadStorables`: Functions to retrieve recent or multiple storable objects based on queries.

Key configuration attributes for "chunk", "activity", and "page" collections are provided.

**StorableChunk.Azure.ts**

The `StorableChunk` module is an Azure Function module for managing chunk records.

It includes methods for retrieving, saving, removing, and fetching recent chunks, with session key validation and error handling.

The `getChunk`, `findChunk`, `saveChunk`, `removeChunk`, and `getRecentChunks` functions process HTTP requests and handle the respective operations using imported functions from `StorableApi.Azure`.

`chunkStorableAttributes` are utilized across these functions for processing.

The HTTP endpoints for these functions are configured using `app.http` with various HTTP methods such as GET and POST, and authentication level set to anonymous.

**StorablePage.Azure.ts**

This module, `StorablePage`, is an Azure Function aimed at managing storable pages, including saving, retrieving, and removal of page records. It also validates session authentication and handles errors during the request processing.

The `decompressHtml` function decompresses the HTML field of a storable object, and the `sendHtml` function transforms a storable object to send an HTML response.

The `getPage` function handles page retrieval, validating the session key and loading the requested page chunk.

The `savePage` function saves a page record, validating the session key and saving the provided chunk.

The module also imports relevant third-party and internal dependencies required for its functionalities. The `app.http` handlers are used to manage HTTP requests for getting and saving pages.

**StudioForTeams.Azure.ts**

**`StudioForTeams` Module:**
- Provides an interface for integrating Boxer AI with Microsoft Teams via Azure Functions.
- Handles natural language queries from Teams and processes them through the Boxer backend.
- Converts requests between Teams and Boxer API formats.
- Generates enriched responses containing relevant document links and summaries for Teams.
- Implements a `makeIconPath` function to fetch favicons for URLs using a hidden Google API.

**`boxerQuery` Function:**
- Processes incoming HTTP requests containing query information.
- Translates the Teams API format to the Boxer internal format for processing.
- Calls the `askModel` function to get responses from Boxer.
- Constructs enriched responses with summaries and document links, and returns them in HTTP response.

**Deployment Instructions:**
- Use `func azure functionapp publish Braid-Api` to publish to Azure.
- Use `npm start` to run the service locally.

**Summarize.Azure.ts**

This module implements an Azure Function for text summarization. It exposes an HTTP endpoint to handle text summarization requests, validates session tokens, and processes the requests through core summarization logic.

**Important Classes/Functions**:
1. `summarize`: Main asynchronous function handling HTTP requests. It extracts text, verifies session validity, processes the text using the `recursiveSummarize` function, and returns the summarized text or appropriate error responses.

2. Utility Functions: 
   - `isSessionValid`: Checks if the session is valid.
   - `sessionFailResponse`, `defaultErrorResponse`, `invalidRequestResponse`: Provide error responses.

3. Dependencies:
   - `@azure/functions`: For Azure Functions runtime.
   - `./Summarize`: For core summarization logic.
   - `./Utility`: For session validation and error responses.

**Summarize.ts**

The module provides text summarization functionality using AI models. It handles breaking down large texts into manageable chunks, processing them through AI models, and generating concise summaries for different personas such as articles, code, and surveys.

The `chunkText` function splits input text into chunks with a configurable overlap to make it processable by the AI model.

The `singleShotSummarize` function asynchronously generates summaries for given text using a specific persona and desired word count.

The `recursiveSummarize` function creates summaries iteratively, breaking down large texts into smaller summaries and then compiling them into an overall summary by recursively reducing text size.

Key Functions:
- `chunkText`
- `singleShotSummarize`
- `recursiveSummarize`

**TestForSummariseFail.Azure.ts**

This module validates the quality of AI-generated summaries, identifying cases where the summarization fails, such as not finding the main text body or producing error messages.

Key functions include:
- `testForSummariseFailCall`: Asynchronously finds a common theme from provided text, utilizing an AI model and retrying API calls if rate-limited.
- `testForSummariseFail`: Processes HTTP requests to find text themes, validates sessions, and determines summary validity, returning HTTP responses accordingly.

Important classes/functions:
- `testForSummariseFailCall`
- `testForSummariseFail`

Deployment:
- Use `'func azure functionapp publish Braid-Api'` for Azure deployment.
- Use `'npm start'` for local execution.

**Utility.Azure.ts**

This Node.js module, named 'Utility', provides various common utility functions that can be used with Azure Functions. 

The function `isSessionValid` checks the validity of a session key provided in the HTTP request against environment variables `SessionKey` and `SessionKey2`. It logs the validation outcome using the provided context object.

The function `sessionFailResponse` generates an HTTP response with a status code of 401 (Unauthorized) indicating a session failure.

The function `defaultOkResponse` creates a standard 200 (Ok) HTTP response.

The function `defaultErrorResponse` generates a 500 (Server Error) response indicating an unexpected server issue.

Additional functions include `invalidRequestResponse` for 400 (Bad Request) and `notFoundResponse` for 404 (Not Found) responses.

Deployment instructions are provided for both local and Azure environments.

