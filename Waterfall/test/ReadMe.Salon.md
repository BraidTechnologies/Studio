**test_boxer_pipeline.py**

This module tests the Boxer Pipeline implementation by Braid Technologies Ltd using three distinct test functions. 

The `test_youtube_boxer_pipeline` function sets up a BoxerDataPipeline instance to process data from YouTube, specifying output and pipeline configurations, then asserts that the process returns at least one item.

The `test_html_boxer_pipeline` function follows a similar process but uses HTML pages as its data source, ensuring that the pipeline processes multiple URLs and returns at least one item.

The `test_full_boxer_pipeline` function is intended for a complete production build, combining both YouTube and HTML data sources, although it returns immediately by default to avoid performing a full build during standard testing.

Important classes and functions:
- `BoxerDataPipeline`
- `YouTubePipelineSpec`
- `HtmlDirectedPipelineSpec`
- `PipelineFileSpec`
- `test_youtube_boxer_pipeline`
- `test_html_boxer_pipeline`
- `test_full_boxer_pipeline`

**test_chunker.py**

The script uses the `pytest` library for organizing and executing tests, primarily focusing on testing data processing functionalities. 

Key classes used include `PipelineItem`, `Chunker`, and `HtmlFileDownloader` from the `src.workflow`, `src.chunker`, and `src.html_file_downloader` modules respectively. The `Chunker` class handles text segmentation, `HtmlFileDownloader` handles HTML file downloading, and `PipelineItem` encapsulates data for pipeline processing.

The script sets up logging at the ERROR level and creates a fixture `test_output_dir` to manage temporary directories for test output, ensuring cleanup after tests.

Several test functions (`test_basic`, `test_with_output`, `test_long`, `test_long_with_overlap`, and `test_long_overlap`) validate the functionality of the data processing pipeline, including file downloads, text chunking, and handling varying lengths and overlaps in processed text.

**test_cluster_analyser.py**

This code sets up a Python testing environment using `pytest`, configuring the search path and logging. It imports necessary modules and classes from the `src` directory.

A `pytest` fixture, `test_output_dir`, creates and later cleans up a temporary directory for test output. This ensures each test runs in isolation with its own directory for generated files.

The `test_basic` function tests the creation of a `PipelineItem` and ensures the `ClusterAnalyser` is set up correctly.

The `test_with_output` function tests downloading HTML files, summarising them, embedding them, and then analysing them using `ClusterAnalyser`, verifying that the number of cluster labels matches the number of processed items.

Important classes and functions:
1. `PipelineItem`
2. `ClusterAnalyser`
3. `HtmlFileDownloader`
4. `Summariser`
5. `Embedder`
6. `test_output_dir`
7. `test_basic`
8. `test_with_output`

**test_db_repository.py**

This code provides unit tests for the `DbRepository` class in the `src.db_repository` module. It uses functions to set up various test scenarios involving the database repository.

The `test_basic` function checks the basic construction of the `DbRepository` instance and asserts the context ID.

The `test_does_not_exist` function tests whether a non-existent path returns a `false` existence value from the repository.

The `test_save` function tests saving a `PipelineItem` and asserts that saving occurs successfully.

The `test_save_exists` function validates that an item can be saved and subsequently verified for existence.

The `test_save_load` function ensures an item can be saved, loaded from the repository, and that its properties remain consistent.

**test_embedder.py**

This script is a pytest module designed for testing functionalities involving `PipelineItem`, `Embedder`, and `HtmlFileDownloader` from the `src` directory.

Paths are set up to locate the `src` directory, ensuring that necessary modules can be imported. 

Logging is configured to output error-level messages, helping to trace issues during execution.

A pytest fixture, `test_output_dir`, is defined to create and clean up a temporary directory for storing test outputs. It logs the creation and deletion of this directory.

There are two test functions: `test_basic` and `test_with_output`. `test_basic` checks if the `Embedder` class correctly assigns the output location. `test_with_output` tests the `download` method of `HtmlFileDownloader` and the `embed` method of `Embedder`, ensuring they process a simple HTML file and produce an embedding.

**test_embedding_finder.py**

This code sets up a testing environment for a module involving embeddings, downloading, summarisation, and embedding functionalities. 

It imports necessary libraries, sets up logging, and extends the system path to include necessary directories. It includes key classes like `PipelineItem`, `EmbeddingFinder`, `HtmlFileDownloader`, `Summariser`, and `Embedder` from the `src` directory.

A pytest fixture `test_output_dir` is defined to create and clean up a temporary directory for storing test output. 

Two test functions, `test_basic` and `test_with_output`, test the `EmbeddingFinder` class. The `test_basic` function checks simple embeddings, while `test_with_output` fully processes multiple HTML files and validates embeddings functionality.

**test_embedding_repository.py**

The code sets up a Python test environment using `pytest`, including essential imports and configuration for logging. 

A fixture `test_output_dir` is defined to create a temporary directory for test outputs and cleans it up afterward.

Three test functions are defined:
1. `test_basic` verifies that the `EmbeddingRepositoryFacade` correctly sets the output location.
2. `test_with_output` ensures that an embedding can be saved and loaded without errors, verifying its existence and correctness.
3. `test_with_no_output` checks the behavior when trying to load a non-existent embedding, expecting an error.

Important classes/functions:
- `test_output_dir`
- `test_basic`
- `test_with_output`
- `test_with_no_output`
- `EmbeddingRepositoryFacade`

**test_errors.py**

This script imports standard libraries `os`, `sys`, and `logging`, and sets up paths and configurations.

`logging.basicConfig` is used to configure logging, with error level messages logged.

`test_basic` is a function that logs messages at different levels and asserts `True` to pass the test.

`test_with_output` function changes the working directory to `test_root`, initializes `PipelineItem`, sets its properties, and generates its summary using `Summariser`. 

The key classes and functions are:
- `PipelineItem` from `src.workflow`
- `Summariser` from `src.summariser`
- `logging`
- `test_basic`
- `test_with_output`

**test_file_repository.py**

The script sets up tests for a FileSystem API, utilizing the `pytest` framework to manage test cases.

Logging is configured to display warnings and errors, with specific configurations for message format. The necessary paths are defined to access the source files required for the tests.

The `FileRespository` class from the `file_repository.py` module is imported and utilized throughout the tests.

A pytest fixture, `test_output_dir`, is created to manage a temporary directory for test files, ensuring cleanup after tests.

Three main test functions — `test_basic`, `test_with_output`, and `test_with_no_output` — validate repository functionalities like setting the output location, saving files, and checking their existence.

**test_html_file_downloader.py**

This code sets up a test environment using `pytest`. It configures logging and adds directories to the `sys.path`.

The `test_output_dir` fixture is created to handle test output directories. It creates a new directory for test output and ensures it's cleaned up after tests run.

Three test functions are defined:

1. `test_basic` verifies that the `HtmlFileDownloader` instance is correctly initialized with the given output directory.
2. `test_with_output` tests downloading from a local HTML file (`simple_test.html`) and checks if the downloaded file contains text.
3. `test_connected` tests downloading from a URL (`https://openai.com/`) and verifies the downloaded content has text.

Key classes/functions: `test_output_dir`, `test_basic`, `test_with_output`, `test_connected`, `PipelineItem`, `HtmlFileDownloader`.

**test_html_link_crawler.py**

This code imports several libraries, sets up the system path, and configures logging. 

Key classes and functions in this module include `test_output_dir`, an @pytest fixture, and the `HtmlLinkCrawler` and `PipelineItem` classes from the `src` directory. The fixture creates and deletes a temporary directory used for test outputs.

The code defines several test functions (`test_basic`, `test_with_output`, `test_with_one_recursion`, `test_with_two_recursions`, `test_many_sublinks`, `test_mad_page`) that use `HtmlLinkCrawler` to crawl various HTML files or URLs and assert that the number of links found matches the expected number. The temporary directories for outputs are cleaned up after each test to ensure no leftovers.

**test_summariser.py**

This script sets up a testing environment for a Python project.

The script imports necessary libraries such as pytest, os, shutil, sys, and logging. 

It configures the system path to include the necessary directories for the source code. 

Logging is configured to display execution information with a basic setup at the WARNING level and a specific logger level set to ERROR.

It imports classes `PipelineItem`, `Summariser`, and `HtmlFileDownloader` from the source directory.

A pytest fixture `test_output_dir` is defined to create and clean up a temporary directory for test outputs, with logging statements for creation and cleanup.

The script defines two test functions: `test_basic` to check the instantiation of the Summariser class and `test_with_output` to test the processing of a simple HTML file through downloading and summarizing.

**test_summarise_fail_suppressor.py**

This module sets up a test environment for testing code from `Braid Technologies Ltd`. It imports necessary libraries such as `pytest`, `os`, `shutil`, `sys`, and `logging`.

Logging is configured at the WARNING level globally but set to ERROR specifically for this module.

It extends the system path to include parent and source directories for importing project-specific modules: `PipelineItem` from `workflow`, `SummariseFailSuppressor` from `summarise_fail_suppressor`, and `HtmlFileDownloader` from `html_file_downloader`.

A pytest fixture `test_output_dir` is used to create and clean up a temporary directory for test outputs.

There are three test functions: `test_basic`, `test_with_no_suppression`, and `test_with_suppression`, each verifying behaviors of the `SummariseFailSuppressor` class.

**test_summary_repository.py**

This script sets up a Python testing environment using standard library imports such as `pytest`, `os`, `shutil`, `sys`, and `logging`.

Paths to the test root and parent, and the source directory are defined and added to the system path. Logging is configured to display warnings, but only errors are logged at runtime.

A fixture called `test_output_dir` creates a temporary directory for test outputs, logging its creation and cleanup.

The `test_basic`, `test_with_output`, and `test_with_no_output` functions test the `SummaryRespositoryFacade` class's ability to create, save, check existence, and load files in the specified output location.

The important classes or functions in the module are `test_output_dir`, `test_basic`, `test_with_output`, and `test_with_no_output`.

**test_text_repository.py**

This Python code is designed to test a text repository API using pytest. 

The logging module is configured to log error messages, and the sys.path is extended to include the parent and source directories for module imports. The code imports `TextRespositoryFacade` from the `src` directory.

A pytest fixture named `test_output_dir` creates a temporary directory for test output, logs its creation, and then cleans it up after the test.

There are three test functions:
- `test_basic`: Checks if `TextRespositoryFacade` correctly sets the output location.
- `test_with_output`: Saves a text file, checks for its existence, and verifies the saved text matches the input.
- `test_with_no_output`: Ensures that a nonexistent file is correctly reported as not existing and does not load any text.

**test_theme_finder.py**

This script sets up a test environment for a workflow involving text processing and logging. It modifies the system path to include the parent directory and a 'src' directory, ensuring necessary modules are accessible. 

Logging configuration is set to capture warnings and errors, aiding in debugging and monitoring the script's execution. The logger level is specifically set to capture errors.

The script defines two test functions: `test_basic()` and `test_with_output()`. `test_basic()` verifies the initialization of the `ThemeFinder` class, while `test_with_output()` processes HTML files by downloading them, summarizing their content using the `Summariser` class, accumulating the summary, and finding a theme using the `ThemeFinder` class.

Key classes/functions in the module are `PipelineItem`, `ThemeFinder`, `Summariser`, and `HtmlFileDownloader`.



**test_waterfall_pipeline.py**

This code defines tests for the `WaterfallDataPipeline` class from the `src.waterfall_pipeline` module.

There are six test functions:
1. `test_basic` initializes `WaterfallDataPipeline` with a test output location and asserts the pipeline's output location.
2. `test_with_search_supply`, `test_with_search_demand`, `test_with_search_telecom`, `test_with_search_nationwide`, and `test_with_search_bny` create instances of `WebSearchPipelineSpec` with different search keys and other parameters, then use the `search_dynamic` method to fetch links and assert that at least one link is returned.
3. `test_with_search_vf_survey_01` creates instances of `PipelineSpec` and `FileDirectedPipelineSpec`, using the `search_static` method and asserting that at least one link is returned.

The pytest library's `@pytest.mark.timeout` decorator is used to set a timeout for each test.

**test_web_searcher.py**

This code is prepared by Braid Technologies Ltd in 2024. 

It imports essential standard libraries such as `os`, `sys`, and `logging` and sets up logging configurations to show warnings and errors.

The script sets up the file paths for incorporating local modules and ensuring the testing environment can access the necessary modules.

It imports `WebSearchPipelineSpec` from `src.workflow`, `WebSearcher` from `src.waterfall_pipeline`, and `AI_SUPPLY_STACK_SEARCH_ENGINE_ID` from `src.web_searcher`.

The `test_basic` function checks if `WebSearcher` properly sets the output location.

The `test_with_search` function changes the working directory, sets up a `WebSearcher` and `WebSearchPipelineSpec`, and verifies that the search returns at least one item.

**test_workflow.py**

This script tests the functionality of classes from the `src.workflow` module: `WebSearchPipelineSpec`, `PipelineItem`, and `Theme`.

The `test_pipeline_item` function creates a `PipelineItem` object, sets its attributes, and verifies that assigning an invalid attribute raises a `TypeError` exception.

The `test_theme` function creates a `Theme` object, assigns a list containing a `PipelineItem` to it, ensures the proper attribute assignment, and checks error handling for invalid attribute assignment.

The `test_pipeline` function sets up a `WebSearchPipelineSpec` object with various attributes, including nested `Theme` objects, and verifies error handling.

Important classes: `WebSearchPipelineSpec`, `PipelineItem`, `Theme`.

**test_youtube_playlist.py**

The code performs testing of YouTube-related functionalities.

It imports necessary libraries and sets up the file paths for proper module referencing. It includes logging configuration to capture warnings and errors.

The classes `YouTubePipelineSpec`, `YoutubePlaylistSearcher`, and `YouTubeTranscriptDownloader` are used.

- `test_basic` function tests if `YoutubePlaylistSearcher` correctly initializes its output location.
- `test_with_search` function sets up the directory and tests the search functionality of `YoutubePlaylistSearcher` to ensure it returns playlist items.
- `test_download` function ensures that the searcher retrieves items and the downloader can download transcripts successfully.

These functions assert the expected outcomes for proper verification.

Generated by Salon from Braid Technologies, 23/02/2025