**boxer_pipeline.py**

The provided code sets up and runs a BoxerDataPipeline class to search, download, process, and store data from YouTube and HTML sources.

The **BoxerDataPipeline** class is initialized with an output location where processed data will be stored.

The main **search** method in this class takes specifications for YouTube and HTML data (YouTubePipelineSpec, HtmlDirectedPipelineSpec, and PipelineFileSpec). It performs the following tasks: 
- Searches for YouTube playlists and transcripts using **YoutubePlaylistSearcher** and **YouTubeTranscriptDownloader**.
- Breaks down YouTube transcripts into chunks via **YouTubeTranscriptChunker**.
- Crawls and downloads HTML links with **HtmlLinkCrawler** and **HtmlFileDownloader**.
- Summarises the content using the **Summariser** class.
- Embeds the summarised content using the **Embedder** class.

Processed data is enriched and saved using the **save_chunks** function. The results are then saved to a JSON file.

**boxer_sources.py**

This code module maintains a list of curated educational resources for AI/ML.

It provides YouTube playlists on machine learning, NLP, and AI fundamentals, which include courses taught by prominent experts like Andrew Ng.

It also lists crucial articles and tutorials from industry experts, as well as documentation from leading AI platforms.

Some notable resources include those from Pinecone, articles by Andrej Karpathy, practical courses from fast.ai, and various resources on transformers and deep learning.

These materials are intended to help users understand core AI/ML concepts and keep up with the latest developments in the field.

**chunker.py**

### Summary

**Classes:**
1. `Chunker`: Inherits from `PipelineStep` to segment text into smaller parts.

**Functions:**
1. `__init__(self, output_location: str)`: Initializes `Chunker` with the given output location.
2. `chunk(self, pipeline_item: PipelineItem, chunk_size_words: int, overlap_words: int) -> list[PipelineItem]`: Splits text into smaller segments using an external API.

### Key Points

- The code uses the `Chunker` class to split a text string into smaller segments.
- Initializes logging and sets the log level to `WARNING`.
- Uses a session key retrieved from environment variables for API authentication.
- Requests module is configured with retries for robustness.
- Sends a POST request to an API endpoint to perform the chunking.
- If the API call is successful, it processes the response and returns a list of `PipelineItem` objects representing the chunks.


**cluster_analyser.py**

The code defines a class `ClusterAnalyser` that inherits from `PipelineStep`. 

The `__init__` method initializes the `ClusterAnalyser` with an output location and the number of clusters for the KMeans algorithm.

The `analyse` method performs KMeans clustering on the embedding vectors of a list of `PipelineItem` objects. It extracts the embeddings from items, fits the KMeans model to them, assigns cluster labels to each item, and returns the updated items.

Important classes and functions:
- `ClusterAnalyser`
- `__init__`
- `analyse`

**db_repository.py**

This Python code module is designed for storing data in the Chunk table of the BraidApis database. It handles data in the form of 'PipelineItem' objects and converts them into 'Chunk' objects to be passed to the native Chunk API, which is used across various applications.

The primary class is `DbRepository`, which provides methods for loading, saving, and checking the existence of files in the Braid Cosmos database. The important methods in this class are `save`, `find`, and `exists`.

It utilizes logging for script execution tracking, and key libraries include `uuid` for generating unique IDs and `datetime` for timestamp handling. The implementation also leverages classes from `chunk_repository_api` for handling chunk-related operations.

**embedder.py**

The code defines an `Embedder` class, inheriting from `PipelineStep`, which creates text string embeddings.

The `Embedder` class contains:
- `__init__`: Initializes with the output location.
- `embed`: Generates embeddings for a `PipelineItem`. If an embedding exists, it loads from the repository; otherwise, it creates a new embedding using an external API, saves it, and returns the updated `PipelineItem`.
- `embed_text`: Generates an embedding for a given text string using an external API and returns the embedding as a list of floats.

The code sets up logging configurations and includes retry mechanisms for handling HTTP requests.

**embedder_repository_facade.py**

This code provides a facade for storing embeddings in a local file system.

The `read_file_names` function retrieves a list of filenames matching a specified pattern within a given directory. 

The `EmbeddingRespositoryFacade` class offers an interface to load, save, and check the existence of files. 

Important methods in this class include:
- `__init__`: Initializes the class with a specified output location and sets up a `FileRepository` instance.
- `spec`: Returns the file extension pattern for stored files.
- `list_contents`: Lists content by retrieving and stripping off extensions from the filenames.
- `save`: Saves an embedding into a file at a specified path.
- `load`: Loads and returns the contents of a specified file as a list of floats.
- `exists`: Checks if a file exists at a specified path.
- `text_to_float`: Converts a string of numbers into a list of floats.

**embedding_finder.py**

The module computes the nearest embedding to a target text using cosine similarity. 

`cosine_similarity(a, b)` function computes the cosine similarity between two vectors `a` and `b`.

The `EmbeddingFinder` class initializes with a list of embeddings and an output location. It uses the `find_nearest` method to determine the nearest embedding to a given target text string. This method creates a `PipelineItem`, embeds the target text using the `Embedder` class, then iterates through the embeddings to find the one with the highest cosine similarity to the target text.

The important classes and functions are:
- `cosine_similarity`
- `EmbeddingFinder`
- `find_nearest`

**file_repository.py**

This Python module is designed to store data in the local file system. 

The module imports standard libraries for logging (`logging`), interacting with the operating system (`os`), and handling JSON data (`json`). It also imports a custom function `make_local_file_path` to process file paths.

Logging is configured to capture warnings and above, with a specified format to include the timestamp, logger name, log level, and message.

The `strip_quotes` function removes all single and double quotes from a given input string.

The `FileRespository` class provides methods for saving, loading, and checking the existence of files within a specified output location:
- `__init__`: Initializes the repository with a designated output location.
- `save`: Saves text content to a file identified by the given path and extension.
- `load`: Loads and returns the content of a file, if it exists, stripping any quotes.
- `exists`: Checks if a file exists at the specified path and extension.

**google_office_mailer.py**

This script uses the Google Gmail API to send emails with attachments. 

The `send_mail` function initiates the process by handling Google OAuth 2.0 authorization, either fetching stored credentials from `token.json` or executing an authorization flow to generate new credentials, which it then saves.

The `send_message_with_attachment` function constructs the email, adding the body and any attachments. It encodes the message using base64 and sends it through the Gmail API.

The `build_file_part` function assists in creating a MIME part for file attachments by guessing the MIME type and packaging the file accordingly.

Important classes or functions:
1. `send_mail`
2. `send_message_with_attachment`
3. `build_file_part`

**html_file_downloader.py**

The code defines a class `HtmlFileDownloader` that extends `PipelineStep` to download the text of a web page and save it locally.

It uses Selenium WebDriver to fetch the content of web pages, handling JavaScript more effectively than requests.

BeautifulSoup is used to parse the HTML content and extract the text.

Logging is set up to capture and display script execution details, with warnings as the default level.

The `download` method accepts a `PipelineItem`, checks if the HTML content already exists in the repository, and fetches and processes it if not.

Headers for HTTP requests are defined but not used, as the script switched from using the requests library.

**html_link_crawler.py**

The script defines a `HtmlLinkCrawler` class, inheriting from `PipelineStep`, which crawls a web page to extract and generate sub-links up to a specified depth. It performs this by parsing HTML content using BeautifulSoup and handling HTTP requests with custom headers to mimic a web browser.

The `crawl` method starts the crawling process, while `crawl_links_recursively` explores each link and collects sub-links recursively, ensuring it doesn't exceed the maximum depth or revisit already crawled links.

Utility functions such as `find_matching_entry`, `deduplicate`, `remove_exits`, `add_prefix`, and `make_fully_qualified_path` are used to manage URLs, remove duplicates, filter out external links, and construct fully qualified URLs, respectively.

**make_local_file_path.py**

This module is designed to create a local file system path from an HTTP URL.

The `make_local_file_path` function converts a given URL into a fake file name by sanitizing it, replacing certain characters (like slashes and query string delimiters) with underscores to ensure compatibility with file system conventions.

The URL is parsed using the `urlsplit` function from the `urllib.parse` module to extract components like scheme, network location, path, and query. These components are concatenated, and then specific characters are replaced.

The resulting string (fake file name) is truncated to a maximum length of 200 characters to ensure it is a valid file name.

**summariser.py**

This code defines a class `Summariser` that inherits from `PipelineStep`. The primary function of the `Summariser` class is to create a summary for a given text string.

The `__init__` method initializes the `Summariser` with an output location. 

The `summarise` method first checks if an existing summary is already saved using the `SummaryRepositoryFacade`. If found, it loads and returns the existing summary. If not, it generates a new summary by making a POST request to an external API, saves the summary, and assigns it to the `PipelineItem`.

Important Classes/Functions:
- `Summariser` class
- `__init__` method
- `summarise` method

**summarise_fail_suppressor.py**

The script defines a `PipelineStep` to create a summary for a text string.

The important classes and functions include:
- `SummariseFailSuppressor`: A `PipelineStep` subclass aimed at creating summaries for text strings and suppressing any items that fail validation checks.
- `__init__`: Initializes the `SummariseFailSuppressor` object with a specified output location.
- `should_suppress`: Evaluates whether a given `PipelineItem` should be suppressed. It makes a POST request to an API endpoint to check the validity of the summary. The decision to suppress or keep the item depends on the API response.

The script establishes a logging configuration for debugging. It uses the `requests` library to handle HTTP requests and retries.

**summary_repository_facade.py**

The `SummaryRepositoryFacade` class provides an interface for file operations in the local file system, specifically tailored for handling summary files with the extension `.summary.txt`.

The `__init__` function initializes the class by creating an instance of `FileRepository` with the specified output location and sets the file extension to `summary.txt`.

The `spec` static method returns the string pattern "*.summary.txt" to filter files by extension.

The `save` method saves the given text to a specified path within the predefined output location using `FileRepository`.

The `load` method reads and returns content from a specified file; it returns an empty string if the file does not exist.

The `exists` method checks whether a specified file exists in the output location, returning True if it does and False otherwise.

**text_repository_facade.py**

This module provides a facade for storing and retrieving text files in the local file system. The primary class is `TextRespositoryFacade`, which includes methods to save, load, and check the existence of text files.

The `__init__` method initializes the class with an `output_location` and sets the file extension to `.txt`. 

The `spec` method returns the file pattern `*.txt`.

The `save` method saves text to the specified path within the output location.

The `load` method loads text from a file at the specified path, returning its contents as a string, or an empty string if the file doesn't exist.

The `exists` method checks whether a file exists at the specified path.

**theme_finder.py**

**Classes and Functions:**
- **ThemeFinder**: Class to create a theme for input text paragraphs.
- **find_theme**: Method within `ThemeFinder` to find a theme by sending text to an external API.

**Code Summary:**
This code provides a `ThemeFinder` class to identify themes for given paragraphs by calling an external API. The class initializes with no specific settings. The `find_theme` method sends a POST request with input text and desired theme length to the API, using a session configured with retries for robustness against server errors. Success responses return the extracted theme, while failures log errors and return None. The script uses standard libraries for logging and HTTP requests and includes headers for user agent and content type in the requests. 

**waterfall_pipeline.py**

This code implements a data processing pipeline that involves searching, downloading, clustering, and analyzing web data to generate thematic reports. The `WaterfallDataPipeline` class is central, with methods such as `search_dynamic` and `search_static` for initiating the process with dynamic or static data sources.

Key functions:
1. `sort_array_by_another`: Orders one list based on another.
2. `make_path`: Concatenates directory and filename.
3. `load_file`: Reads file contents, handling errors appropriately.
4. `create_themes`: Generates themes from clustered items.
5. `create_report`: Compiles a report from items and themes.

Important classes/functions in the module:
- `WebSearcher`
- `HtmlFileDownloader`
- `Summariser`
- `Embedder`
- `ClusterAnalyser`
- `ThemeFinder`
- `EmbeddingFinder`

**waterfall_pipeline_report.py**

**Important Classes/Functions:**
- `create_mail_report(output_location: str, items: list[PipelineItem], themes: list[Theme], spec: WebSearchPipelineSpec, send_final: bool) -> None`

**Summary:**
This code generates and sends an automated Waterfall report via email to the Braid Leadership. The `create_mail_report` function takes output location, a list of `PipelineItem` and `Theme` objects, a `WebSearchPipelineSpec` object, and a boolean `send_final` parameter to manage whether the report should be sent. 

The function compiles a summary which includes an introduction, a brief about the top clusters, and a confidentiality notice. If `send_final` is true, it sends the summary via email using the `send_mail` function from the `src.google_office_mailer` module. Logging is utilized for debugging purposes.

**waterfall_pipeline_report_common.py**

The code is designed to generate a report and save it in both HTML and JSON formats. 

It imports necessary libraries including logging for information display, OS for file operations, JSON for data serialization, Plotly for creating visualizations, and UMAP for dimensionality reduction.

Important classes and functions:
1. `PipelineItem`
2. `Theme`
3. `WebSearchPipelineSpec`
4. `write_chart(output_location, items, themes, spec)`: This function reduces item embeddings to 2D using UMAP, creates a scatter plot with Plotly, and saves the chart as an HTML file.
5. `write_details_json(output_location, items, themes, spec)`: This function creates a detailed JSON file containing data about each PipelineItem for manual inspection.

**waterfall_pipeline_save_chunks.py**

This script facilitates sending a final Waterfall report to a database as chunks. 

### Important Classes and Functions:
- **set_timestamps(chunk, existing)**: Updates the timestamps of a chunk based on its status (new or existing).
- **create_theme_chunk(short_description, context, long_description, output_location, chunk_repository)**: Creates or retrieves a theme chunk and updates its properties.
- **save_chunks(items, spec)**: Saves a list of PipelineItem objects as chunks in the database.
- **save_chunk_tree(output_location, items, themes, spec)**: Saves chunks in a hierarchical structure based on provided pipeline items, themes, and specifications.

### Other Important Components:
- **ChunkRepository**: Manages data access for chunks.
- **DbRepository**: Manages data access for the database.
- **Embedder**: Generates text embeddings.
- **PageRepository**: Manages data access for pages.

### Logging:
- Configures logging to display errors and debug information during execution.

**waterfall_survey_pipeline.py**

The provided code implements a data pipeline using the `WaterfallDataPipeline` class. This pipeline performs web searches, downloads HTML content, summarizes it, and clusters the content into themes, outputting organized themes and reports.

1. **Classes and Functions**:
   - `WaterfallDataPipeline`: Main class implementing the data pipeline.
   - `sort_array_by_another`: Function for sorting an array based on another array.
   - `search`: Initiates the web search and processing pipeline.
   - `search_and_cluster`: Conducts the web search, downloads content, summarizes it, checks for summarization failures, embeds content, and clusters it.
   - `create_themes`: Creates themes from the clustered content.
   - `create_report`: Generates and stores a report based on processed data.

2. **Pipeline Stages**:
   - **Search**: Uses `WebSearcher` to fetch initial links.
   - **Download and Summarize**: Downloads HTML using `HtmlFileDownloader` and summarizes content using `Summariser`.
   - **Error Handling**: Uses `SummariseFailSuppressor` to manage summarization failures.
   - **Embedding**: Embeds the summarized content using `Embedder`.
   - **Clustering**: Utilizes `ClusterAnalyser` to categorize content into clusters.
   
3. **Theme Creation**:
   - Aggregates summaries and categorizes them into themes using `ThemeFinder`.
   - Enriches themes with nearest relevant articles using `EmbeddingFinder`.

4. **Report Generation**:
   - Generates comprehensive reports, including details and chunk trees, and sends email reports through `create_mail_report`.

Key modules include `WebSearcher`, `HtmlFileDownloader`, `Summariser`, `Embedder`, `ClusterAnalyser`, `ThemeFinder`, `EmbeddingFinder`, and reporting functions in `waterfall_pipeline_report` and `waterfall_pipeline_save_chunks`. Logging is set up to capture warnings and higher-level messages.

**web_searcher.py**

This Python script sets up a web search utility as the first step in a Waterfall pipeline. It uses the Google Custom Search Engine API to find relevant URLs for a given query. The script is designed for use with Braid Technologies Ltd and requires specific API keys and search engine IDs stored in environment variables.

### Important Classes and Functions:
- **`WebSearcher` Class**: A class to handle web searches using the Google Custom Search Engine API.
- **`__init__` Method**: Initializes the `WebSearcher` class with an output location.
- **`search` Method**: Executes the search based on given query parameters, iterates through multiple pages of results, and populates a list of `PipelineItem` objects with the URLs retrieved from the search results.


**workflow.py**

The `Freezable` class prevents the addition of new attributes to an object once it is "frozen" by setting `_is_frozen` to True.

The `PipelineItem` class, inheriting from `Freezable`, represents a work item with attributes such as `id`, `path`, `summary`, etc., and it prevents adding new attributes. It also includes equality and comparison methods based on the `path` and `summary`.

The `Theme` class, also inheriting from `Freezable`, represents a documented cluster of items with attributes like `short_description` and `long_description`. It includes equality and comparison methods based on these attributes.

`PipelineStep` is a base class that initializes with an `output_location` attribute.

`PipelineSpec`, inheriting from `Freezable`, outlines the workflow with attributes like `clusters`, `description`, and `themes`.

`WebSearchPipelineSpec`, extending `PipelineSpec`, adds attributes like `pages`, `search_key`, and `mail_to`, and is frozen to prevent additions.

`YouTubePipelineSpec`, a `Freezable` class, specifies attributes for downloading video playlists like `playlists` and `max_words`.

`HtmlDirectedPipelineSpec`, also `Freezable`, sets up a list of URLs to download.

`FileDirectedPipelineSpec`, another `Freezable` class, establishes a list of files to download.

`PipelineFileSpec`, inheriting from `Freezable`, sets attributes for the Waterfall workflow, including `output_data_name` and `description`.

**youtube_searcher.py**

This code gathers information about YouTube videos from specified playlists and processes them into `PipelineItem` objects.

- **Libraries Used:** Imports necessary Google API libraries and other essential modules like `logging`, `os`, and `datetime`.
- **Logging Setup:** Configures logging to display warnings and higher severity messages.
- **API Configuration:** Retrieves YouTube API credentials and sets API-specific constants.
- **`parseVideoDurationMins` Function:** Parses video duration from the ISO 8601 format to minutes.

**Important Classes and Functions:**

- **`parseVideoDurationMins(duration: str) -> int`:** Converts video duration from ISO 8601 to minutes.
- **`YoutubePlaylistSearcher`:** 
  - **`__init__(self, output_location: str)`:** Initializes the searcher with an output location.
  - **`search(self, pipeline: YouTubePipelineSpec) -> list[PipelineItem]`:** Searches specified playlists and generates a list of `PipelineItem` objects.

**youtube_transcript_chunker.py**

This script divides the transcript of a YouTube video into manageable chunks.

The `make_start_time_offset` function calculates a time marker in the YouTube video based on the given minutes. It formats the marker to include hours and minutes if necessary.

The `YouTubeTranscriptChunker` class, which inherits from `PipelineStep`, is designed to chunk a transcript using the `Chunker` class. It initializes with an output location and the `chunk` method divides the transcript into chunks with specified word limits and overlaps. If the transcript is short, it handles special cases like having only one chunk or no chunks at all.

`chunk` method also computes chunk timings assuming an even distribution of text.

**youtube_transcript_downloader.py**

This script downloads the YouTube transcript of videos in a playlist. 

The `clean_text` function cleans up new lines, redundant characters, and inaudible markers from the raw transcript. The `parse_video_id` function extracts and returns the video ID from a YouTube URL. 

The `YouTubeTranscriptDownloader` class inherits from `PipelineStep` and downloads and saves the transcript of a given YouTube video. It has methods to check if the transcript already exists in the repository and handles exceptions such as no transcript available, transcripts disabled, and video unavailable. 

Important classes/functions:
1. `clean_text`
2. `parse_video_id`
3. `YouTubeTranscriptDownloader`

