**boxer_pipeline.py**

This Python module is a driver for the Boxer data generation pipeline by Braid Technologies Ltd. It sets up logging for the script execution, to log warnings and above.

The primary class, `BoxerDataPipeline`, initializes with an output location and handles the data pipeline operations. Its main function, `search`, processes specified HTML and YouTube content links to generate enriched data chunks.

Key imported classes and functions used include `YouTubePipelineSpec`, `HtmlDirectedPipelineSpec`, `PipelineItem`, `PipelineFileSpec`, `YoutubePlaylistSearcher`, `YouTubeTranscriptDownloader`, `YouTubeTranscriptChunker`, `HtmlLinkCrawler`, `HtmlFileDownloader`, `Summariser`, `Embedder`, and `save_chunks`.

The `search` function organizes tasks like YouTube playlist searching, HTML link crawling, downloading, summarization, embedding, and saving the resultant chunks to JSON.

**boxer_sources.py**

This module provides a curated list of educational resources for AI/ML (Artificial Intelligence/Machine Learning) education and research. 

Key sections include YouTube playlists, which cover full courses and detailed explanations of core topics like machine learning, natural language processing (NLP), deep learning, and AI fundamentals.

Additionally, it lists informative articles, tutorials, and reference documentation from respected industry experts and leading educational institutions. These resources provide insights into advanced topics, tools, and techniques relevant to AI and ML development.

The intention of the module is to build and maintain a comprehensive knowledge base to help individuals stay updated with developments in the AI/ML field.

**chunker.py**

This code outlines a `Chunker` class, which inherits from `PipelineStep`. It is designed to break a text string into smaller, manageable pieces (chunks). The `chunk` method takes a `PipelineItem`, chunk size, and overlap size, and interacts with an external API to perform chunking.

`Chunker` initializes with an output location provided to its constructor. 

The `chunk` method sets up a session with retry logic for HTTP requests, constructs a request payload based on given chunk parameters, and sends it to an external API for processing. Successful responses return chunks encapsulated in `PipelineItem` objects, which the function then returns as a list.

### Important Classes or Functions
1. `Chunker` (Class)
2. `chunk` (Method)
3. `__init__` (Constructor)

**cluster_analyser.py**

The code defines a `ClusterAnalyser` class, which is a subclass of `PipelineStep` from the `src.workflow` module.

The `ClusterAnalyser` class initializes with an output location and the number of clusters for KMeans clustering. This initialization is handled by the `__init__` method.

The main method in this class is `analyse`, which takes a list of `PipelineItem` objects. It extracts the embeddings from these items and applies the KMeans clustering algorithm to assign cluster labels to each item.

The class uses the `KMeans` functionality from the `sklearn.cluster` module for clustering.

Logging is configured to capture warning-level messages and higher, using Python's standard logging library. 

Important classes and functions in the module include `ClusterAnalyser`, `__init__`, and `analyse`.

**db_repository.py**

The provided module allows interaction with the BraidApis Chunk table by converting `PipelineItem` data into a format compatible with the native Chunk API. It is designed for compatibility across multiple applications.

**Important Classes:**
- `DbRepository`: Contains methods for saving, retrieving, and checking the existence of records in the Braid Cosmos database.

**Important Functions:**
- `save(self, item: PipelineItem) -> bool`: Saves a `PipelineItem` to the Chunk repository after converting it into a compatible `IStoredChunk` structure.
- `find(self, path: str) -> PipelineItem`: Retrieves a `PipelineItem` from the database based on a given path.
- `exists(self, path: str) -> bool`: Checks whether a record with a specific functional key and context exists in the database.

**embedder.py**

The Python code defines a class `Embedder` which extends the `PipelineStep` class and is tasked with creating the embedding for a given text string. 

The `Embedder` class is initialized with an `output_location`, where embeddings will be saved or loaded from. 

The `embed` method generates embeddings for a `PipelineItem`. If an embedding already exists, it is loaded from the repository; otherwise, a new one is created using an external API and saved.

The `embed_text` method directly generates embeddings for provided text strings, using an external API. 

The `requests` library with a retry mechanism is used to handle HTTP requests, logging handles execution information.

**embedder_repository_facade.py**

This code provides a facade to store and manage embeddings in the local file system. 

**Key Classes and Functions:**

1. **read_file_names(path: str, file_spec: str):**
   - Retrieves a list of file names matching a specified pattern within a directory.

2. **EmbeddingRespositoryFacade:**
   - Provides an interface to load, save, and check the existence of files in the file system.

3. **EmbeddingRespositoryFacade.__init__(self, output_location: str):**
   - Initializes the class with a file repository instance, output location, and file extension pattern.

4. **EmbeddingRespositoryFacade.spec() -> str:**
   - Returns the file extension pattern used for storing files.

5. **EmbeddingRespositoryFacade.list_contents() -> list[str]:**
   - Lists the contents of the output location by retrieving file names and stripping double extensions.

6. **EmbeddingRespositoryFacade.save(self, path: str, embedding: list[float]) -> None:**
   - Saves provided text to a file at the specified path.

7. **EmbeddingRespositoryFacade.load(self, path: str) -> list[float]:**
   - Loads content from a file at the provided path and returns it as a list of floats.

8. **EmbeddingRespositoryFacade.exists(self, path: str) -> bool:**
   - Checks if the file exists in the output location.

9. **EmbeddingRespositoryFacade.text_to_float(self, embedding: str) -> list[float]:**
   - Converts a string of numbers to a list of floating-point numbers.

**embedding_finder.py**

**Important Classes/Functions:**

1. **cosine_similarity(a, b)**: A function that computes the cosine similarity between two vectors `a` and `b`.

2. **EmbeddingFinder**: A class designed to find the nearest embedding to a given target text based on cosine similarity.

3. **__init__(self, embeddings, output_location)**: The constructor initializes the EmbeddingFinder with a list of embeddings and an output location.

4. **find_nearest(self, target_text)**: This method uses the `Embedder` class to transform `target_text` into an embedding and then finds the embedding from the list with the highest cosine similarity to it.

**Summary:**

This module contains a function to calculate cosine similarity, and a class, `EmbeddingFinder`, which uses this function to find the most similar embedding to a target text. It relies on classes `Embedder` and `PipelineItem` from other modules to generate text embeddings. Logging is configured to show warnings and above.

**file_repository.py**

This module handles file operations in the local file system, including saving, loading, and checking the existence of files. It has been created by Braid Technologies Ltd in 2024.

Logging is set up using the `logging` library to warn about potential issues during execution.

The function `strip_quotes` removes single and double quotes from a given string.

The `FileRepository` class is central to this module, providing methods to save (`save`), load (`load`), and check the existence (`exists`) of specific files. The file paths are derived using the `make_local_file_path` function.

Important classes and functions:
1. `strip_quotes`
2. `FileRepository`
3. `FileRepository.save`
4. `FileRepository.load`
5. `FileRepository.exists`

**google_office_mailer.py**

This script allows sending emails via the Gmail API, with support for attachments, using OAuth2 credentials.

`send_mail()` handles OAuth2 authentication with Gmail, either loading credentials from `token.json` or prompting the user to log in, then calls `send_message_with_attachment()`.

`send_message_with_attachment()` constructs an email with optional attachments and sends it using the Gmail API. The method encodes the message in a format accepted by the API.

`build_file_part()` creates a MIME part for file attachments, managing proper MIME type determination and attachment headers.

Important classes or functions: `send_mail()`, `send_message_with_attachment()`, `build_file_part()`.

**html_file_downloader.py**

This module handles the downloading and processing of HTML content from web pages, encapsulated within a `PipelineStep` subclass named `HtmlFileDownloader`.

The `HtmlFileDownloader` class is initialized with an output location where downloaded files will be saved. It includes a `download` method that either retrieves the HTML content from an online source using Selenium's WebDriver for full JS rendering or reads it from a local file.

The `TextRespositoryFacade` class ensures proper loading and saving of text files. The HTML content is processed and converted to plain text using BeautifulSoup before being saved and appended to the provided `PipelineItem`. 

Logging is configured to track execution details.

**html_link_crawler.py**

**HtmlLinkCrawler class**: This is a custom pipeline step inheriting from `PipelineStep`. It initializes with an output location and a maximum depth for crawling, making it responsible for crawling web pages and generating sub-links.

**crawl method**: This method is the primary function for crawling. It starts by calling a recursive function to fetch sub-links and creates pipeline items for each link, returning a list of `PipelineItem` objects.

**crawl_links_recursively**: A recursive method that processes the HTML content of a page, extracts links, and traverses sub-pages up to a specified depth, filtering unwanted links (e.g., same-page fragments and external links).

**helper functions**: `find_matching_entry`, `deduplicate`, `remove_exits`, `add_prefix`, and `make_fully_qualified_path` are used for filtering duplicates, ensuring links stay within the same site, adding prefixes to relative URLs, and constructing absolute URLs.

**make_local_file_path.py**

This module converts an HTTP URL into a local file system path.

The `make_local_file_path` function takes a URL string as input.

It uses the `urlsplit` function from the `urllib.parse` module to break down the URL into components: scheme, network location (netloc), path, and query.

It then constructs a clean path by concatenating the netloc, path, and query.

Special characters (//, \\, /, =, &, %) in the clean path are replaced with underscores to generate a file-safe name.

The resulting file name is truncated to a maximum length of 200 characters.

**summariser.py**

The code imports necessary libraries like `logging`, `requests`, and custom modules for handling pipeline items and a summary repository. Logging is configured to display warnings.

The `Summariser` class inherits from `PipelineStep` and is designed to create summaries for text strings. The `__init__` method initializes the `Summariser` with an output location.

The `summarise` method in `Summariser` checks if a summary exists. If it does, it loads and returns the summary. If not, it uses an external API to generate a new summary, saves it, and returns the updated `PipelineItem`.

Classes: `Summariser`
Functions: `__init__`, `summarise`

**summarise_fail_suppressor.py**

This code defines a class `SummariseFailSuppressor` that inherits from `PipelineStep`. It is designed to process text summaries and suppress any invalid ones based on specified criteria.

The `__init__` function initializes the object with an output location.

The `should_suppress` function checks a `PipelineItem` for suppression by calling an external API. It creates a session with retry logic for robustness and posts the text to a specified URL. If the API response indicates the summary is valid, the item is not suppressed.

Important classes/functions:
1. `SummariseFailSuppressor`
2. `__init__`
3. `should_suppress`

**summary_repository_facade.py**

The `SummaryRespositoryFacade` class offers an interface to interact with the file system, specifically for loading, saving, and checking the existence of files.

This class uses the `FileRespository` class from the `src.file_repository` module to perform actual file operations. It initializes with an `output_location` and has a fixed file extension `summary.txt`.

Key methods include:
- `spec()`: Returns the file extension as a string.
- `save(path, text)`: Saves a text file to the specified path.
- `load(path)`: Loads the file content from the path.
- `exists(path)`: Checks if the file exists at the path.

The class helps manage file operations uniformly across the application.

**text_repository_facade.py**

**Important Classes:**
1. `TextRespositoryFacade`

**Important Functions:**
1. `__init__(self, output_location: str)`
2. `spec() -> str`
3. `save(self, path: str, text: str) -> None`
4. `load(self, path: str) -> str`
5. `exists(self, path: str) -> bool`

`TextRespositoryFacade` provides a simplified interface to interact with the file system. It can save text to a specified path using the `save` method, load text from a specified path using the `load` method, and check if a file exists at a specified path using the `exists` method. This is done via a class from `src.file_repository` called `FileRespository`, which handles the actual file operations. The class also defines a standard file extension ("txt") and a static method `spec` to determine the file type specification.

**theme_finder.py**

The code defines a `ThemeFinder` class to generate a theme for input text paragraphs by querying an external API. 

Logging is configured to capture warnings and errors with a specific format.

The `SESSION_KEY` required for making API requests is fetched from the environment variables.

Essential HTTP headers, such as 'User-Agent', 'Content-Type', and 'Accept', are defined for the requests.

The `ThemeFinder` class contains an initialization method and a `find_theme` method. The `find_theme` method sets up a session with retry policies, sends a POST request with text and length to an external API, and returns the theme if the request is successful or logs an error message otherwise. 

Key components include `find_theme` and `ThemeFinder`.

**waterfall_pipeline.py**

This code serves as the driver for a data processing pipeline. Key classes and functions include `WaterfallDataPipeline`, `sort_array_by_another`, `make_path`, and `load_file`.

`WaterfallDataPipeline` is the main class orchestrating the data search, processing, and clustering workflow. It utilizes various other classes like `WebSearcher`, `HtmlFileDownloader`, `Summariser`, `SummariseFailSuppressor`, `Embedder`, `ClusterAnalyser`, `ThemeFinder`, and `EmbeddingFinder` to handle each part of the process.

It features methods such as `search_dynamic`, `search_static`, `search_and_cluster`, `cluster_from_files`, `cluster`, `create_themes`, and `create_report` to complete each step from data retrieval to report generation. The module also includes utility functions like `sort_array_by_another`, `make_path`, and `load_file` for sorting, path handling, and file reading, respectively.

**waterfall_pipeline_report.py**

This code generates and sends a final Waterfall report via email.

The `create_mail_report` function prepares an email summary report based on a list of `PipelineItem` objects, `Theme` objects, and a `WebSearchPipelineSpec` object. It organizes and formats the data into an HTML email.

The logging module is used to set up warning-level logging for debugging purposes.

The `send_mail` function from the `src.google_office_mailer` module sends the final formatted report email.

Key functions:
- `create_mail_report`
- `send_mail`

Key classes:
- `PipelineItem`
- `Theme`
- `WebSearchPipelineSpec`

**waterfall_pipeline_report_common.py**

This script generates and sends a final Waterfall report by mail.

- The `write_chart` function generates a scatter plot based on the embeddings of `PipelineItem` objects. It clusters the items using UMAP, adds theme names as legend entries, and saves an interactive HTML version of the chart to a specified directory. The function returns the file path of the saved chart.
  
- The `write_details_json` function writes detailed information about `PipelineItem` objects to a JSON file. Each item’s summary, embedding, path, and related theme are included. This data is saved to a specified directory.

Important classes or functions:
- `write_chart`
- `write_details_json`
- `PipelineItem`
- `Theme`
- `WebSearchPipelineSpec`

**waterfall_pipeline_save_chunks.py**

- **Logging Setup**: Configures logging for the script to record events at the ERROR level and sets up a logger.

- **set_timestamps Function**: Updates created and amended timestamps for an `IStoredChunk` object.

- **create_theme_chunk Function**: Creates a chunk from a theme's attributes, sets timestamps, generates embeddings, and assigns various properties.

- **save_chunks Function**: Saves a list of `PipelineItem` objects as chunks in the database. Each chunk includes fields like ID, path, summary, text, and embedding.

- **save_chunk_tree Function**: Saves chunks in a hierarchical structure based on `PipelineItem`, `Theme`, and `PipelineSpec` objects. It involves writing a chart, managing themes (both master and sub-themes), and saving related chunks and summary texts.

**Important Classes/Functions:**
- `set_timestamps`
- `create_theme_chunk`
- `save_chunks`
- `save_chunk_tree`
- `Embedder`
- `DbRepository`
- `ChunkRepository`
- `PipelineItem`
- `Theme`
- `WebSearchPipelineSpec`
- `PipelineFileSpec`

**waterfall_survey_pipeline.py**

The script is a driver for a web content pipeline that involves searching, downloading, summarizing, and analyzing HTML content.

**Important classes and functions:**
- `WaterfallDataPipeline`
- `search_and_cluster`
- `create_themes`
- `create_report`
- `sort_array_by_another`

The `WaterfallDataPipeline` class coordinates the workflow, encapsulating the processes of searching for web content, summarizing, and clustering them into themes.

The `search_and_cluster` method uses various components (like `WebSearcher`, `HtmlFileDownloader`, `ClusterAnalyser`) to process the web content iteratively, including downloading, summarizing, suppressing failure summaries, embedding, and clustering the results.

The `create_themes` method aggregates the clustered items, summarizes them, and uses `ThemeFinder` to create short and long descriptions of themes. Subsequently, it enriches these themes with relevant examples using the `EmbeddingFinder`.

The `create_report` function finalizes the pipeline by generating reports and saving details.

`sort_array_by_another` is a utility for ordering themes based on their importance.

**web_searcher.py**

This script is the first step in a Waterfall pipeline that involves searching the web and generating a list of `PipelineItem`. It imports necessary libraries such as `logging` and `requests`, and sets up logging to warn levels.

It retrieves the Google Developer API key from environment variables and contains various pre-defined search engine IDs used for specific searches.

The `WebSearcher` class is defined, with an initialization method setting the output location. The `search` method of this class employs the Google Custom Search Engine API to perform web searches using a specified query, extracting URLs from the search results, and then creating and returning a list of `PipelineItem` objects containing these URLs. 

Key classes/functions:
- `WebSearcher` class
- `WebSearcher.__init__`
- `WebSearcher.search`

**workflow.py**

**Freezable Class**

A generic class allowing instances to become immutable after being set up, using `_is_frozen` attribute and `_freeze` method.

**PipelineItem Class**

Inherits `Freezable`. Represents a work item for a processing pipeline with attributes like `path`, `text`, and `summary`. Overloads comparison operators, making instances comparable based on `path` and `summary`.

**Theme Class**

Inherits `Freezable`. Represents a documented cluster of pipeline items with attributes such as `short_description` and `long_description`. Overloads comparison operators, similar to `PipelineItem`.

**PipelineStep Class**

Represents a step in a pipeline, initialized with an `output_location`.

**PipelineSpec Class**

Inherits `Freezable`. Defines specifications for a workflow run, including attributes like `clusters` and `output_chart_name`.

**WebSearchPipelineSpec Class**

Inherits `PipelineSpec`. Adds web-specific attributes such as `pages` and `search_key`, freezing the instance post-initialization.

**YouTubePipelineSpec Class**

Inherits `Freezable`. Specifies configurations for downloading video playlists, with attributes like `playlists` and `max_words`, freezing the instance post-initialization.

**HtmlDirectedPipelineSpec Class**

Inherits `Freezable`. Specifies configurations for downloading web pages, using a list of URLs, and freezes the instance post-initialization.

**FileDirectedPipelineSpec Class**

Inherits `Freezable`. Specifies configurations for handling files, using a list of file paths, and freezes the instance post-initialization.

**PipelineFileSpec Class**

Inherits `Freezable`. Defines the specifications for a full workflow run, including `output_data_name` and `description`, freezing the instance post-initialization.

**youtube_searcher.py**

The code is for generating a list of `PipelineItem` objects from a YouTube playlist as the first step in a Waterfall pipeline.

Important classes and functions include:
- `parseVideoDurationMins`: This function parses the video's duration from ISO 8601 format into minutes.
- `YoutubePlaylistSearcher`: This class processes sets of YouTube playlists to create a list of `PipelineItem` objects representing the videos. The constructor initializes the class with an output location. The `search` method fetches videos from specified playlists using the YouTube Data API, creates request objects, retrieves video details, and appends them as `PipelineItem` objects into a list.

**youtube_transcript_chunker.py**

This code is designed to divide a transcript of a YouTube video into chunks for further processing. Important classes and functions include:

- **`make_start_time_offset`**: This function takes an integer (minutes) and converts it into a time offset string formatted for YouTube URLs.
  
- **`YouTubeTranscriptChunker`**: A class that extends `PipelineStep` to handle the utility of chunking transcripts. 

- **`__init__`**: Initializes the `YouTubeTranscriptChunker` object with an output location and a `Chunker` object.

- **`chunk`**: This method divides the transcript into chunks of specified word size and overlap, returning a list of new `PipelineItem` objects with updated URLs incorporating time offsets. The process includes handling cases with no chunks or a single chunk, and ensuring fair time distribution across chunks assuming evenly spread text.

Logging is set up to track execution details and is configured to show warnings and above.

**youtube_transcript_downloader.py**

The code facilitates downloading transcripts from YouTube videos in a playlist.

The main class is `YouTubeTranscriptDownloader`, a subclass of the `PipelineStep`. It initializes with an `output_location` for saving transcripts. Its primary method is `download`, which fetches the transcript for a given video, processes it by cleaning, and saves the result using `TextRespositoryFacade`.

The `clean_text` function adjusts specific textual artifacts such as newlines and special characters to improve text quality.

The `parse_video_id` function extracts the video ID from various YouTube URL formats.

The `logging` module is used for recording errors and information. 

The script handles exceptions like no transcript available, transcripts disabled, or video unavailable gracefully.

