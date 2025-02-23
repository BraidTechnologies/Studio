**boxer_pipeline.py**

This code defines a BoxerDataPipeline class that orchestrates the execution of a data generation pipeline for YouTube and HTML content. 

The ``__init__`` function initializes the output location where the results will be stored.

The ``search`` function performs the main task. It uses several components: `YoutubePlaylistSearcher`, `YouTubeTranscriptDownloader`, and `YouTubeTranscriptChunker` to process YouTube data, while `HtmlLinkCrawler` and `HtmlFileDownloader` handle HTML data.

Additional processing is done using `Summariser` to summarize content and `Embedder` to embed the summarized data. 

The final enriched data chunks are saved using the `save_chunks` function and serialized into a JSON file for output. 

Key classes and functions include ``BoxerDataPipeline``, ``__init__``, and ``search``.

**boxer_sources.py**

This module is curated to provide educational resources for AI/ML learning and research. It includes lists of various types of materials:

1. **YouTube Playlists**: Provides a collection of YouTube playlist IDs for courses and tutorials related to machine learning, natural language processing (NLP), and general AI fundamentals from reputable sources such as Stanford.

2. **Web Pages**: Includes links to key articles, tutorials, and documentation on AI and ML concepts, written by industry experts and hosted by educational platforms and reputable blogs.

These resources serve as a knowledge base for learners and researchers to understand core AI/ML concepts and stay updated with the latest developments.

**chunker.py**

This Python script defines a `Chunker` class as a `PipelineStep` for chunking a text string into smaller parts. 

The `Chunker` class initializes with an output location and features a `chunk` method that processes a `PipelineItem` object, dividing its text into smaller segments based on specified chunk size and overlap. 

An external API is called to perform the actual chunking, handling retries with a session and including headers for the API request. 

If the API request is successful, the resultant chunks are transformed into new `PipelineItem` objects, which are then returned. 

Important classes and functions include `Chunker`, `__init__`, and `chunk`.

**cluster_analyser.py**

This code defines a `ClusterAnalyser` class that inherits from `PipelineStep` and performs KMeans clustering on a set of embedding vectors.

### Classes and Functions:
1. **ClusterAnalyser**:
   - **__init__**: Initializes the `ClusterAnalyser` object with an output location and the number of clusters.
   - **analyse**: Accepts a list of `PipelineItem` objects, extracts their embeddings, performs KMeans clustering on these embeddings, and assigns cluster labels to each `PipelineItem`.

### Other Details:
- **logging**: Configured to log messages at the WARNING level, facilitating the monitoring of the script's execution.
- **KMeans**: Imported from `sklearn.cluster` for clustering embeddings.
- **PipelineItem & PipelineStep**: Imported from `src.workflow`, these are used as the base components for constructing the pipeline and processing items.

**db_repository.py**

This module is designed to store data in the Chunk table of the BraidApis and takes in data in the form of 'PipelineItem' as used in the waterfall process. The data is converted into 'Chunk' to be passed into the native Chunk API, which is common across multiple applications.

**Key Classes and Functions:**
1. **DbRepository:** Manages the loading, saving, and existence checking of files within the Braid Cosmos database.
2. **__init__:** Initializes the `DbRepository` with `application_id` and `context_id`, and sets up a new `ChunkRepository`.
3. **save(item: PipelineItem) -> bool:** Converts `PipelineItem` into `Chunk` and saves it to the database.
4. **find(path: str) -> PipelineItem:** Retrieves and converts a `Chunk` back into a `PipelineItem` from the database based on the provided path.
5. **exists(path: str) -> bool:** Checks if a record exists in the database based on the provided path. 

It also sets up logging for monitoring code execution details.

**embedder.py**

The script defines a class named `Embedder` that extends from `PipelineStep`.

It initializes the `Embedder` object with a provided output location and sets up logging configurations for debugging and error tracking.

The `embed` method generates an embedding for a given `PipelineItem`. It first checks if an embedding already exists in the `EmbeddingRespositoryFacade`. If not, it sends a request to an external API to create a new embedding, saves it, and assigns it to the `PipelineItem`.

The `embed_text` method directly generates an embedding for a given text string using the external API.

Important classes or functions:
- `Embedder` class
- `embed` method
- `embed_text` method

**embedder_repository_facade.py**

This module provides functionality to store embeddings as files in the local file system, specifically with filenames matching the pattern "embed.txt".

The `read_file_names` function retrieves a list of filenames that match a given pattern within a specified directory.

The `EmbeddingRespositoryFacade` class acts as an interface to manage file operations, including the initialization for a specific output location using an instance of `FileRespository`.

The `list_contents` method lists the base filenames without extensions from the specified directory.

The `save` method saves provided embeddings to files.

The `load` method loads content from specified files and converts them to a list of floats.

The `exists` method checks the existence of specific files.

The module uses the `text_to_float` method to convert strings of numbers into lists of floats.

Important classes/functions:
- `read_file_names`
- `EmbeddingRespositoryFacade`
- `EmbeddingRespositoryFacade.save`
- `EmbeddingRespositoryFacade.load`
- `EmbeddingRespositoryFacade.exists`
- `EmbeddingRespositoryFacade.list_contents`
- `EmbeddingRespositoryFacade.text_to_float`

**embedding_finder.py**

**Key Classes and Functions:**
1. `cosine_similarity(a, b)`: Calculates the cosine similarity between two vectors `a` and `b` using their dot product and norms.
2. `EmbeddingFinder`: A class designed to find the embedding closest to a target text based on cosine similarity.
3. `EmbeddingFinder.__init__(self, embeddings, output_location)`: Initializes the `EmbeddingFinder` class with predefined embeddings and an output location.
4. `EmbeddingFinder.find_nearest(self, target_text)`: Finds the nearest embedding to the target text by computing the cosine similarity between the target text's embedding and the predefined embeddings.

**Summary:**
This code calculates the cosine similarity between vectors and uses it to find the embedding closest to a target text. The `EmbeddingFinder` class manages embeddings and finds the nearest match by embedding the target text and comparing it against a list of provided embeddings, utilizing the cosine similarity formula.

**file_repository.py**

The code module is designed to handle file storage operations, specifically in the local file system. It includes functionalities such as saving, loading, and checking the existence of files. 

**Key Components:**

1. **strip_quotes Function**: 
This function removes all single and double quotes from the input string. 

2. **FileRepository Class**: 
This class provides methods to interact with the file system. 

    - **__init__**: Initializes the output location where files will be stored.
    - **save**: Saves the provided text to a file at the specified path and extension.
    - **load**: Loads the content from a file based on the provided path and extension.
    - **exists**: Checks if a file exists at a specified path and extension.

3. The `make_local_file_path` function is imported from another module to create local file path names based on the provided path string. 

Logging is set up to capture and display warnings and errors about the script's execution.

**google_office_mailer.py**

This code uses the Google Gmail API to send emails with attachments.

Important classes and functions in the module are:
- `send_mail()`: Handles OAuth2 authorization, manages tokens, and initiates the mail sending process.
- `send_message_with_attachment()`: Constructs the email, attaches a file if provided, encodes the message, and sends it using the Gmail API.
- `build_file_part()`: Creates a MIME part for a file attachment, inferring its MIME type and setting necessary headers.

Logging is set to capture and display warnings. Credentials are managed and refreshed automatically using `Credentials` and `InstalledAppFlow` from the `google-auth` library.

**html_file_downloader.py**

The code is designed to download the text of a web page as part of a pipeline step. It imports necessary libraries, including logging, Selenium for web browsing automation, and BeautifulSoup for HTML parsing.

Logging is set up to track the script's execution. The headers dictionary is defined to mimic a web browser request.

The `HtmlFileDownloader` class extends `PipelineStep`, initialised with the output location where the downloaded file will be saved.

The `download` method fetches HTML content either from a given URL using Selenium or reads from a local path. BeautifulSoup is used to extract text content, which is then saved and added to the `PipelineItem`.

**html_link_crawler.py**

### Summary:

**Classes & Functions:**
1. **HtmlLinkCrawler (PipelineStep)**: Crawls a web page, extracts sub-links, and generates a list of `PipelineItem` objects. Initialized with `output_location` and `max_depth`.
2. **crawl**: Initiates recursive link crawling.
3. **crawl_links_recursively**: Recursively explores links, avoiding emails and depth-exceeding paths.
4. **find_matching_entry**: Checks for matching entries in a list.
5. **deduplicate**: Removes duplicate links from the list.
6. **remove_exits**: Filters out links that point outside the main site.
7. **add_prefix**: Adds URL prefixes to convert relative links to fully qualified URLs.
8. **make_fully_qualified_path**: Joins the base URL with a relative path to form a full URL.

### Usage:
- The script fetches HTML content, parses it with BeautifulSoup, and processes anchor tags to build a list of URLs.
- Utilizes logging for debugging and monitoring the crawling process, with warnings enabled as the default log level.
- Custom headers mimic typical browser behavior, improving server compliance.

**make_local_file_path.py**

This module provides functionality to convert an HTTP URL into a local file system path. 

The primary function is `make_local_file_path(url: str) -> str`, which takes a URL as input and returns a sanitized string suitable for a local file path.

The implementation begins by using `urlsplit` from the `urllib.parse` module to break down the URL into its components: scheme, netloc, path, and query.

The function then concatenates the `netloc`, `path`, and `query` components into a single string named `clean_path`.

It sanitizes `clean_path` by replacing certain URL characters (`//`, `\\`, `/`, `=`, `&`, `%`) with underscores, resulting in a string `fake_name`.

Finally, the function limits the length of `fake_name` to a maximum of 200 characters before returning it.

**summariser.py**

This module defines a `Summariser` class, which inherits from `PipelineStep`, to create text summaries.

The `Summariser` class has an `__init__` method that initializes the output location for the summaries.

The main method, `summarise`, checks if a summary already exists for a given text using `SummaryRespositoryFacade`. If it does, it loads and returns this summary.

If no summary exists, the method sends a summary request to an external API using the `requests` library with retry capabilities configured via `HTTPAdapter` and `Retry`.

Successful summaries are saved and returned. If an error occurs, it is logged and `None` is returned.

**summarise_fail_suppressor.py**

The `SummariseFailSuppressor` class, inherited from `PipelineStep`, initializes with an output location and is designed to create text summaries. The class includes a method `should_suppress`, which evaluates a `PipelineItem` for suppression based on API response criteria.

In `should_suppress`, a request session is created with a retry mechanism for handling possible server errors. An API POST request is sent containing the text summary. If the API response indicates the summary succeeded and there are no errors, the pipeline item is not suppressed. Otherwise, it defaults to keeping the item.

### Important Classes/Functions:
- **SummariseFailSuppressor Class**
- **__init__ Method**
- **should_suppress Method**

**summary_repository_facade.py**

The module defines the `SummaryRespositoryFacade` class, which serves as an interface to load, save, and check the existence of files in the local file system.

The class constructor (`__init__`) initializes the facade with an `output_location` and specifies that summary files have the extension "summary.txt." 

The `save` method saves a given text to a specified path within the `output_location`.

The `load` method loads content from a specified file path, returning the file contents if the file exists or an empty string if it doesn't.

The `exists` method checks if a file exists at the given path within the `output_location`.

**text_repository_facade.py**

The `TextRepositoryFacade` class is designed to provide an interface for handling text files in the local file system. It utilizes a `FileRepository` class for the actual file operations.

The constructor `__init__` initializes the `TextRepositoryFacade` with an output location, setting it to save, load, and check for `.txt` files in the specified directory.

The static method `spec` returns the expected file type "*.txt".

The `save` method saves the provided text to a file at the specified path within the output location.

The `load` method reads and returns the content of a file if it exists, otherwise, it returns an empty string.

The `exists` method checks if a file exists at the given path in the output location.

**theme_finder.py**

**Key Classes and Functions:**

1. **ThemeFinder**: Primary class that processes paragraphs of text to determine a theme.
2. **__init__**: Initializes the ThemeFinder class.
3. **find_theme**: Main function that sends a POST request to an external API to extract a theme based on input text and desired length.

**Summary:**

This module processes input paragraphs to determine a thematic summary. It imports necessary libraries including `logging`, `os`, `json`, and `requests` to handle logging, environment variables, and HTTP requests. The `ThemeFinder` class contains an `__init__` function and a `find_theme` function. `find_theme` sends a POST request to an external API using a session that retries the request upon certain HTTP errors. The function returns the theme if the request is successful; otherwise, it logs an error. The module retrieves the session key from environment variables and sets specific headers for the API requests.

**waterfall_pipeline.py**

The provided code is a pipeline driver for processing web data involving several stages such as searching, downloading, summarizing, embedding, clustering, and generating themes and reports.

### Important Classes and Functions:
1. **WaterfallDataPipeline**:
   - **__init__**: Initializes the class with an output location.
   - **search_dynamic**: Initiates a dynamic search based on a web specification.
   - **search_static**: Conducts static content searches based on file specifications.
   - **search_and_cluster**: Searches and clusters data items according to the specifications.
   - **cluster_from_files**: Creates clusters from local files.
   - **cluster**: Creates themes by managing HTML downloads, summarizing, embedding, and clustering.
   - **create_themes**: Accumulates and refines themes from clustered data.
   - **create_report**: Generates reports from the processed items and themes.

2. **sort_array_by_another**: Sorts one list by the order defined in another list.
3. **make_path**: Concatenates directory paths and filenames into a full path.
4. **load_file**: Reads and returns the content of a specified file.

The pipeline incorporates several important classes such as `WebSearcher`, `HtmlFileDownloader`, `Summariser`, `Embedder`, and `ThemeFinder` among others, to perform the various tasks in the data processing workflow.

**waterfall_pipeline_report.py**

This code is designed to create and optionally send a final Waterfall report by email.

- **Important classes/functions**: `create_mail_report`.

- The `create_mail_report` function takes five parameters: `output_location`, `items` (list of `PipelineItem`), `themes` (list of `Theme`), `spec` (`WebSearchPipelineSpec`), and `send_final` (boolean).

- The function generates a summary report describing the results of a cluster analysis on provided pipeline items and themes, and composes a detailed email body that includes cluster descriptions and related information.

- It logs the progress and encodes the summary message in UTF-8.

- If `send_final` is True, it uses `send_mail` to email the summary report to the designated recipient.

**waterfall_pipeline_report_common.py**

This script from Braid Technologies generates a final Waterfall report and emails it.

The script uses logging for execution information, initially setting the log level to WARNING.

The `write_chart` function generates a scatter plot chart based on the `PipelineItem`, `Theme`, and `WebSearchPipelineSpec`. It reduces item embeddings to two dimensions using UMAP, creates a scatter plot with Plotly, and saves it as an HTML file.

The `write_details_json` function generates a JSON file with detailed information about the items, including their summary, embedding, path, and theme, for potential manual inspection.

Key classes and functions: `write_chart`, `write_details_json`, `PipelineItem`, `Theme`, `WebSearchPipelineSpec`.

**waterfall_pipeline_save_chunks.py**

The code is designed to manage and save theme-based data chunks (e.g., reports) to a database.

- A logging setup initializes configurations to capture and display error-level logs.

- The `set_timestamps` function sets timestamps for `IStoredChunk` objects, ensuring they correctly record creation and amendment times.

- The `create_theme_chunk` function generates a chunk for a theme using attributes and embeds text using the `Embedder` class.

- The `save_chunks` function saves a list of `PipelineItem` objects as chunks in the database via the `DbRepository`.

- The `save_chunk_tree` function organizes and saves chunk data in a hierarchical tree structure, integrating themes, pipeline items, and database specifications.

Important classes and functions:
1. `ChunkRepository`
2. `DbRepository`
3. `PageRepository`
4. `Embedder`
5. `set_timestamps`
6. `create_theme_chunk`
7. `save_chunks`
8. `save_chunk_tree`

These key classes and functions facilitate the data storage process, chunk creation, embedding, and hierarchical data structuring.

**waterfall_survey_pipeline.py**

The provided code is a driver script for a data pipeline called `WaterfallDataPipeline`. 

**Important Classes**: 
1. `WaterfallDataPipeline`: Manages the pipeline phases including searching, clustering, theme creation, and report generation. 

**Core Functions**: 
1. `search`: Executes the main pipeline activities starting with searching, then clustering, and finishes by reporting the results.
2. `search_and_cluster`: Handles the search process using `WebSearcher`, downloads HTML content, summarizes it with `Summariser`, suppresses failures with `SummariseFailSuppressor`, embeds the summaries with `Embedder`, and clusters the embeddings with `ClusterAnalyser`.
3. `create_themes`: Creates themes from the clustered items using `ThemeFinder` and enhances them by finding the best example articles with `EmbeddingFinder`.
4. `create_report`: Generates a comprehensive report from the pipeline process using external functions like `create_mail_report` and `write_details_json`.

**Utility Function**: 
1. `sort_array_by_another`: Sorts one array based on the order defined by another array. 

The script also sets up logging to manage the level of output detail during execution.

**web_searcher.py**

The provided code is the first step in a Waterfall pipeline, which searches the web and generates a list of `PipelineItem` objects.

**Key Classes and Functions:**
- `WebSearcher` class: This class is responsible for searching for links related to a specific query using the Google Custom Search Engine API.
- The `__init__` method initializes the `WebSearcher` with an output location.
- The `search` method performs the web search based on a given `WebSearchPipelineSpec` and returns a list of `PipelineItem` objects containing URLs from the search results.

The script also sets up logging to help track the execution process and retrieves the necessary API keys and search engine IDs from environment variables.

**workflow.py**

- **Freezable class**: This class can be used as a base class to prevent the addition of new attributes once the `_freeze()` method is invoked.

- **PipelineItem class**: Inherits from Freezable and represents an item in a processing pipeline. It includes attributes like `id`, `path`, `text`, `summary`, and `embedding`. Also, it implements equality and comparison methods to compare items based on `path` and `summary`.

- **Theme class**: Inherits from Freezable and represents a documented cluster of items with attributes such as `short_description` and `long_description`. It includes equality and comparison methods for comparing themes.

- **PipelineStep class**: Represents a step in a pipeline. It is initialized with an output location parameter.

- **PipelineSpec class**: Inherits from Freezable and outlines the specification for a complete run of a workflow.

- **WebSearchPipelineSpec class**: Inherits from PipelineSpec and includes attributes specific to web searches, such as `pages`, `search_key`, and `query_additions`.

- **YouTubePipelineSpec class**: Inherits from Freezable and includes attributes related to downloading video playlists, such as `playlists` and `max_words`.

- **HtmlDirectedPipelineSpec class**: Inherits from Freezable for downloading web pages, initialized with a list of URLs.

- **FileDirectedPipelineSpec class**: Inherits from Freezable for handling file downloads, initialized with a list of file paths.

- **PipelineFileSpec class**: Inherits from Freezable and outlines the specifications for a pipeline run, including attributes like `output_data_name` and `description`.

**youtube_searcher.py**

This code connects to the YouTube API to retrieve a list of video items from specified playlists and then processes these items into `PipelineItem` objects.

### Key Functions/Classes

- **`parse_video_duration_mins(duration: str) -> int`**: Converts the duration of a YouTube video (in ISO 8601 format) to minutes, correcting logical errors in sample code it is derived from.

- **`YoutubePlaylistSearcher` class**:
  - **`__init__(self, output_location: str)`**: Initializes class instances, setting where output will be stored.
  - **`search(self, pipeline: YouTubePipelineSpec) -> list[PipelineItem]`**: Fetches videos from YouTube playlists and transforms them into `PipelineItem` objects, including video duration calculation.

### Additional Details
- The script uses the `googleapiclient` for connecting with YouTube API.
- Configuration for the API key and logging settings are provided.
- `PipelineItem` and `YouTubePipelineSpec` are imported from `src.workflow`.

The core functionality involves looping to fetch video items within the given playlists, extracting necessary video details (such as duration and ID), converting the duration, and populating `PipelineItem` objects.

**youtube_transcript_chunker.py**

This script divides the transcript of a YouTube video into manageable chunks. It uses standard Python libraries such as `math`, `logging`, and `datetime`.

It defines a function `make_start_time_offset` that calculates the start time offset for a video, given the time in minutes. This function formats the offset in hours and minutes.

The main class, `YouTubeTranscriptChunker`, extends `PipelineStep` and is used to initialize chunking settings. The `chunk` method in this class splits a video transcript, represented by a `PipelineItem`, into segments based on specified chunk sizes and overlap lengths, returning a list of new `PipelineItem` objects.

The chunking process assumes the transcript is evenly distributed throughout the video, and it uses linear interpolation adjusted for overlap. The function also adjusts the base URL of each chunk to include the start time offset.

**youtube_transcript_downloader.py**

This module downloads the transcript of a YouTube video or playlist.

The `clean_text` function removes unwanted characters and double spaces from the transcript text. 

The `parse_video_id` function extracts the video ID from various YouTube URL formats.

The main class `YouTubeTranscriptDownloader`, which inherits from `PipelineStep`, handles downloading the transcript. It initializes with an output location and the `download` method retrieves the transcript from `YouTubeTranscriptApi` using the video ID.

Error handling is implemented for scenarios like no transcript found, disabled transcripts, and unavailable videos. The `logging` module is used to log different levels of messages during execution.

Generated by Salon from Braid Technologies, 23/02/2025