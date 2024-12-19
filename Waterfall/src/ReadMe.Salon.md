**boxer_pipeline.py**

The `BoxerDataPipeline` class is responsible for searching, downloading, summarizing, and embedding content from a list of HTML and YouTube links.

- The `__init__` method initializes the class with an output location.
- The `search` method handles the entire workflow:
  - It sets up instances of various classes such as `YoutubePlaylistSearcher`, `YouTubeTranscriptDownloader`, `YouTubeTranscriptChunker`, `HtmlLinkCrawler`, `HtmlFileDownloader`, `Summariser`, and `Embedder`.
  - For each URL in the HTML specifications, it crawls, downloads, summarizes, and embeds the content.
  - For YouTube content, it searches, downloads, chunks, summarizes, and embeds the transcripts.
  - Finally, it saves the processed chunks and their summaries and embeddings to a file in the specified output location.

Important Classes/Functions:
1. BoxerDataPipeline
2. __init__
3. search

**boxer_sources.py**

This script includes two lists: `youtube_playlists` and `html_pages`.

The `youtube_playlists` list contains YouTube playlist IDs. These playlists may cover topics such as Machine Learning, Natural Language Processing, and Augmented Language Models. Comments are used to indicate corresponding course names or content providers.

The `html_pages` list contains URLs of web pages related to machine learning and artificial intelligence. Topics include practical deep learning, transformer models, AI scaling, prompt engineering, and several other technical concepts and industry insights.

Both lists serve as references for educational resources in AI and Machine Learning. There are no functions or classes defined in this module.

**chunker.py**

The provided Python code is used for text chunking within a pipeline process and primarily focuses on a `Chunker` class that inherits from `PipelineStep`.

The `Chunker` class initializes with `output_location` and contains a `chunk` method that divides a text string into smaller parts, returning a list of `PipelineItem` objects. It makes use of an external API to perform the chunking, configuring retries for the requests session to handle errors.

Important classes and functions:
1. `Chunker` (extends `PipelineStep`).
2. `chunk` method in the `Chunker` class.
3. `PipelineItem` class (used within the chunk method).

**cluster_analyser.py**

### Important Classes and Functions:
- **ClusterAnalyser (class)**
- **__init__ (method)**
- **analyse (method)**

### Description:
- The ClusterAnalyser class inherits from the PipelineStep class and performs KMeans clustering on a set of embedding vectors.
- It initializes with an output location and a specified number of clusters.
- The `analyse` method takes a list of PipelineItem objects, extracts their embeddings, and applies the KMeans algorithm to cluster them.
- The method then updates each PipelineItem object with a cluster assignment based on the KMeans clustering results.
- Logging is set up to monitor the execution, primarily at the WARNING level.



**db_repository.py**

This module, designed by Braid Technologies Ltd, is intended for storing data in the Chunk table of the Braid APIs. It processes data received as `PipelineItem` and converts it into `Chunk` objects, compatible with the native Chunk API used across various applications.

The module imports necessary libraries like logging, datetime, and uuid, and sets up logging to monitor its execution.

The `DbRepository` class handles the main operations. Its `__init__` method initializes the repository with an application and context ID, creating an instance of `ChunkRepository` for database interactions. 

The `save` method converts a `PipelineItem` to a `Chunk` and saves it to the database. It sets various chunk attributes, such as ID, application and context IDs, timestamps for creation and modification, and the processed embedding and summary.

The `find` method retrieves a `PipelineItem` from the database using the functional key derived from the item's path. If a corresponding chunk is found, it maps the chunk's data back into a `PipelineItem`.

The `exists` method checks if a record with a specific key and context exists in the database.

Key functions and classes: `DbRepository`, `save`, `find`, `exists`.

**embedder.py**

This code defines an `Embedder` class that extends `PipelineStep` to create embeddings for text strings.

The `Embedder` class is initialized with an `output_location`, which is specified to store the generated embeddings. 

The `embed` function checks if the embedding already exists for a given `PipelineItem`; if not, it generates a new embedding using an external API and saves the result. 

The `embed_text` function directly creates an embedding for a given text string, using an external API to retrieve the embedding.

Important classes in this module include `Embedder`, `PipelineItem`, `PipelineStep`, and `EmbeddingRespositoryFacade`.

**embedder_repository_facade.py**

This module provides functionality for managing and storing embeddings in the local file system. 

The `read_file_names` function retrieves a list of filenames that match a specified pattern within a given directory. 

The `EmbeddingRespositoryFacade` class serves as an interface to perform load, save, and existence check operations on files. It initializes an instance of `FileRespository` to handle file operations, specifying the output location and the file extension pattern. 

The `spec` method returns the pattern for file extensions. The `list_contents` method lists the contents of the output location by stripping double extensions to return base filenames.

The `save` method saves embeddings to a file, `load` method reads content from a file and converts it from string to a list of floats using the `text_to_float` method. The `exists` method checks if a file exists in the output location. 

Key classes and functions: `read_file_names`, `EmbeddingRespositoryFacade`.

**embedding_finder.py**

**Important Classes and Functions:**
1. `cosine_similarity(a, b)`: A function to compute cosine similarity between two vectors.
2. `EmbeddingFinder`: A class to find the nearest embedding to the target text.

**Summary:**
- **Imports**: Imports `logging` for logging, `numpy` for numerical operations, and helper classes from `src.embedder` and `src.workflow` modules.
- **Logging Setup**: Configures logging to display warnings and higher-level messages.
- **Cosine Similarity**: Defines a function to compute cosine similarity between two vectors using their dot product and norms.
- **EmbeddingFinder Class**: 
  - **Constructor**: Stores embeddings and output location.
  - **find_nearest Method**: Takes target text, embeds it using `Embedder`, and finds the embedding with the highest cosine similarity to this target text embedding. Returns the nearest embedding.

**file_repository.py**

This module facilitates data storage in the local file system with a main focus on logging and file operations.

The `strip_quotes` function removes all single and double quotes from an input string. 

The `FileRepository` class provides capabilities to save text data to files, load content from files, and check the existence of files. 

For file paths, it utilizes the `make_local_file_path` module to construct appropriate file names. 

The `save` method writes text content to a specified file. The `load` method reads content from a specified file, and the `exists` method checks whether a specific file exists. 

The operations maintain logging for better traceability and debugging.

**google_office_mailer.py**

The module allows sending emails using the Gmail API within Google Workspace.

The `send_mail` function manages user authentication through OAuth2. It checks for existing credentials, or prompts the user to log in, and saves new tokens for future use.

The `send_message_with_attachment` function creates and sends an email with an optional attachment. It sets the MIME type, encodes the message, and uses the Gmail API to send the email.

The `build_file_part` helper function creates a MIME part for file attachments.

Key classes and functions:
1. `send_mail`
2. `send_message_with_attachment`
3. `build_file_part`
4. `WebSearchPipelineSpec` (used in the email specifications)
5. Google API libraries for building and sending the mail.


**html_file_downloader.py**

The code defines a class "HtmlFileDownloader" that inherits from "PipelineStep". This class is responsible for downloading the HTML content of a web page and processing it.

The `__init__` method initializes the "HtmlFileDownloader" object with the provided output location.

The `download` method accepts a "PipelineItem", checks if the HTML content already exists in the repository, and if not, it fetches the content either from a URL using Selenium's "webdriver" or from a local file. 

The downloaded HTML content is then processed with BeautifulSoup to extract text and saved back to the repository. The processed text is set into the "pipeline_item" and returned.

Key classes and functions:
1. HtmlFileDownloader
2. `__init__`
3. `download`

**html_link_crawler.py**

The `HtmlLinkCrawler` class, derived from `PipelineStep`, is implemented to crawl web pages and generate sub-links up to a specified depth.

The `crawl` method initiates the crawling process and returns new `PipelineItem` instances for each sub-link discovered.

The `crawl_links_recursively` method handles the recursive crawling, parsing HTML content, collecting links, and filtering them based on the domain and depth constraints. It uses multiple helper functions to manage and process URLs.

Helper functions include:
- `find_matching_entry`: Checks for an existing entry in a list.
- `deduplicate`: Removes duplicate links.
- `remove_exits`: Filters out external links.
- `add_prefix`: Converts relative URLs to absolute ones.
- `make_fully_qualified_path`: Constructs fully qualified URL paths from relative links.

Additionally, logging is set up to track the script’s execution with warnings and above. `requests` and `BeautifulSoup` libraries are used for HTTP requests and HTML parsing respectively.

**make_local_file_path.py**

This module converts an HTTP URL to a local file system path. The primary function, `make_local_file_path(url: str) -> str`, accepts a URL as a string and processes it to produce a fake file name.

The function uses `urlsplit` from `urllib.parse` to break down the URL into its components: scheme, netloc, path, and query. It concatenates `split_url.netloc`, `split_url.path`, and `split_url.query` to form a `clean_path`.

Special characters such as "//", "\\", "/", "=", "&", "%" in `clean_path` are replaced with underscores to ensure a valid file path, and the resulting string is limited to 200 characters.

**summariser.py**

The code defines a `Summariser` class that inherits from `PipelineStep`. The primary purpose is to create a summary for a given text string.

In the `summarise` method, the code first checks if a summary already exists for the provided input through `SummaryRespositoryFacade`. If an existing summary is found, it loads and returns it; otherwise, it generates a new summary using an external API.

The external API is called using a `requests` session with retry logic. If the API response is successful, the generated summary is saved and returned. Logging is set up for debugging and error tracking.

Important classes and functions:
- **Summariser**: Main class to generate the summary.
- **__init__**: Initializes the Summariser with an output location.
- **summarise**: Main function to generate or load a summary.

**summarise_fail_suppressor.py**

The code defines a class `SummariseFailSuppressor` which extends `PipelineStep`, to create a summary for a given text string. It includes a method `should_suppress` that processes a `PipelineItem` to determine if it should be suppressed based on an API evaluation.

Logging is configured for the script to track its execution at the WARNING level. 

An HTTP session with retries is established to make a request to an external API to check if the given summary is valid. If the API returns a success status, the text string is retained; if there’s an error, it defaults to keeping the string.

**summary_repository_facade.py**

**Important Class: SummaryRespositoryFacade**

The `SummaryRespositoryFacade` class provides a simplified interface for saving, loading, and checking the existence of summary files in the local file system.

The `__init__` method initializes the class with a given output location and sets up a `FileRespository` instance to handle the file operations. The files handled by this facade have a predefined extension "summary.txt".

The `save` method saves text content to a specified path within the output location. 

The `load` method reads and returns the content from a specified file path. If the file doesn't exist, it returns an empty string.

The `exists` method checks whether a file exists at a given path and returns a boolean value.

**text_repository_facade.py**

The `TextRespositoryFacade` class provides an interface for handling text files in the local file system.

The constructor `__init__` initializes the facade with an output location and initializes a `FileRespository` object.

The `spec` method returns a string representing the file extension handled by the class (`*.txt`).

The `save` method saves text content to a specified path in the file system via the `file__repository` object.

The `load` method retrieves the contents of a specified file, returning the content as a string, or an empty string if the file doesn't exist.

The `exists` method checks if a given file path exists in the file system.

**theme_finder.py**

### Summary:

- **Imports**: Several libraries including `logging`, `os`, `json`, `requests`, and `HTTPAdapter` and `Retry` from `requests.adapters`.

- **Logging Setup**: Configured logging to capture warnings and above with date, name, level, and message format.

- **Constants**: Defined `SESSION_KEY` read from environment variables and `headers` for the HTTP request.

- **Class**: `ThemeFinder` contains the method `find_theme`.

- **`find_theme` Method**: 
  - Takes input `text` and `length`.
  - Sets up a `requests.Session` with retry logic.
  - Sends a POST request to an external API with the input text and length.
  - Parses the JSON response to extract the theme.
  - Returns the theme if successful, else logs an error and returns `None`.

### Important Classes and Functions:
- **Class**: `ThemeFinder`
- **Method**: `find_theme`

**waterfall_pipeline.py**

The code sets up a pipeline for processing HTML content and generating themes and reports. Key classes and functions are:

1. **sort_array_by_another**: Orders a list of `Theme` objects based on the sort order of another list.
2. **make_path**: Concatenates a directory path and filename.
3. **load_file**: Loads the contents of a text file, with error handling.
4. **WaterfallDataPipeline**: The main class handling the pipeline processes.
5. **WaterfallDataPipeline.search_dynamic** and **search_static**: Methods for dynamic and static HTML content searching.
6. **WaterfallDataPipeline.search_and_cluster** and **cluster_from_files**: Cluster items from web searches or files.
7. **WaterfallDataPipeline.cluster**: Processes items through a series of steps (downloading, summarizing, embedding).
8. **WaterfallDataPipeline.create_themes**: Generates themes from clustered items.
9. **WaterfallDataPipeline.create_report**: Generates and saves a report based on processed items and themes.

**waterfall_pipeline_report.py**

This code sends a final Waterfall report by email using the Braid Technologies Ltd framework.

**Important functions and classes:**
- `create_mail_report`: Generates a report based on a list of `PipelineItem` objects, `Theme` objects, and `WebSearchPipelineSpec`. It creates a summary of the top themes and can optionally send this report via email.
- `write_chart`: Used for generating charts in the report, though not utilized directly in this code.
- `send_mail`: Sends the final encoded summary email with the output chart, given the output location and report specifications.

The logging module is configured to display warnings and higher-level messages, providing insights into the execution process.

**waterfall_pipeline_report_common.py**

The code sets up logging for tracking execution details with a WARNING level threshold.

The `write_chart` function generates a scatter plot report from provided `PipelineItem`, `Theme`, and `WebSearchPipelineSpec` objects. It uses UMAP to reduce item embeddings to 2D. This data, combined with theme descriptions, is plotted using Plotly and saved as an interactive HTML file.

The `write_details_json` function creates a JSON file with detailed summaries of the input `PipelineItem` objects, including their embeddings, paths, and associated theme descriptions. This file is saved to a specified output location for manual inspection.

Important functions: `write_chart`, `write_details_json`.

**waterfall_pipeline_save_chunks.py**

This code is designed to generate and store a detailed waterfall report using chunked data. 

Key functions:
1. `set_timestamps`: Sets creation and amendment timestamps for chunks.
2. `create_theme_chunk`: Creates a report chunk based on theme attributes and then embeds text data using the Embedder.
3. `save_chunks`: Saves a list of `PipelineItem` objects into the database with detailed checks for existing items.
4. `save_chunk_tree`: Manages the hierarchy of chunks, ensuring all items and themes are organized and stored. It first generates a master theme, then adds themes and their related items fitting within this framework. The final step updates the database with all gathered and formatted information.

The classes such as `ChunkRepository`, `DbRepository`, `Embedder`, `PipelineItem`, and `Theme` play significant roles in handling data storage, embedding, and workflow specifications.

**waterfall_survey_pipeline.py**

### Classes and Functions

**`WaterfallDataPipeline`**: A class that orchestrates the entire data pipeline for web searches and text summarization.
- **`__init__`**: Initializes the class with the output location.
- **`search`**: Coordinates the entire search pipeline, returning a list of Theme objects.
- **`search_and_cluster`**: Manages web searches and clustering of results using various components like downloader, summariser, suppressor, embedder, and cluster analyser.
- **`create_themes`**: Creates themes from the pipeline items, determining short and long descriptions using a ThemeFinder, and enriching themes with EmbeddingFinder.
- **`create_report`**: Generates a report based on the pipeline items and themes, and saves the results.

**`sort_array_by_another`**: Function to sort one array (themes) based on the sort order of another array.

### Imports and Setup

- **Imports**: The code imports many modules, primarily for web searching, downloading HTML content, summarizing, and creating reports.
- **Logging**: Sets up logging to capture execution details with a default level of warning.

**web_searcher.py**

The code imports necessary Python libraries, including `logging`, `os`, and `requests`.

It sets up logging to capture important runtime information, configuring the logging level to `WARNING`.

API keys for the Google Custom Search Engine (CSE) are accessed from environment variables, and specific search engine IDs for various categories are defined.

The `WebSearcher` class initializes with an `output_location` attribute and has a `search` method.

The `search` method uses the Google CSE API to perform searches based on a query and extracts URLs from the search results, creating `PipelineItem` objects for each URL found, returning them as a list.

Important classes:
- `WebSearcher`
- `PipelineItem`
- `WebSearchPipelineSpec`
- `search` (method)

**workflow.py**

The `Freezable` class allows objects to be "frozen," preventing the addition of new attributes once frozen. 

The `PipelineItem` class inherits from `Freezable` and represents an item in a processing pipeline. It includes attributes like `id`, `path`, `summary`, and more, and provides methods for comparing two `PipelineItem` objects. 

The `Theme` class, also inheriting from `Freezable`, represents a theme or cluster of items, including short and long descriptions and example items. It also provides comparison methods.

`PipelineStep` is a base class for steps in a processing pipeline, initialized with an `output_location`.

`PipelineSpec`, `WebSearchPipelineSpec`, `YouTubePipelineSpec`, `HtmlDirectedPipelineSpec`, `FileDirectedPipelineSpec`, and `PipelineFileSpec` are specifications for different pipeline workflows, predominantly inheriting from `Freezable`. Each class initializes with specific attributes and locks from adding new ones.

**youtube_searcher.py**

This Python script generates a list of `PipelineItem` objects from a YouTube playlist, the first step of a Waterfall pipeline.

The `parseVideoDurationMins` function converts a YouTube video's duration from ISO 8601 format to minutes.

The `YoutubePlaylistSearcher` class processes YouTube playlists to create `PipelineItem` objects. It uses YouTube Data API v3 to fetch video details from specified playlists, calling the `search` method to gather and return these details.

The class is initialized with an output location, while the `search` method interacts with the YouTube Data API to get video IDs and durations, creating corresponding `PipelineItem` objects.

**youtube_transcript_chunker.py**

This script divides transcripts of YouTube videos into smaller chunks. It primarily involves the following:

**Main Classes and Functions:**
1. **make_start_time_offset**:
    - Creates a time offset string for a given number of minutes to append to a URL.
   
2. **YouTubeTranscriptChunker** (inherits from `PipelineStep`):
    - **__init__**: Initializes the `YouTubeTranscriptChunker` with an output location.
    - **chunk**: Splits a given transcript into smaller chunks, considering the chunk size and overlap words. It manages edge cases (e.g., single or zero chunks) and ensures URL time markers are appropriately calculated for each chunk.
   
The script also sets up logging, imports necessary modules, and uses helper classes (`PipelineItem`, `PipelineStep`, and `Chunker`).

**youtube_transcript_downloader.py**

This code provides a functionality to download and save transcripts of YouTube videos in a playlist.

The `logging` module is configured to show warnings, errors, and other logging information during the execution.

The `clean_text` function removes unwanted characters from the text, such as newline characters, double spaces, and specific substrings like ">>" and "[inaudible]".

The `parse_video_id` function extracts the video ID from different types of YouTube URLs.

The `YouTubeTranscriptDownloader` class, which inherits from `PipelineStep`, manages the downloading of video transcripts given a `PipelineItem` and saves them using the `TextRespositoryFacade`.

The `download` method inside `YouTubeTranscriptDownloader` class retrieves the transcript using `YouTubeTranscriptApi`, cleans the text, and handles exceptions for cases when transcripts are unavailable or disabled.

