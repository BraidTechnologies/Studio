**download_html.py**

This script downloads and processes all textual content from sub-pages of a given URL up to a specified depth. The important functions and classes are: 

- `Counter`: A thread-safe counter class to keep track of the number of processed pages.
  
- `get_html()`: Fetches the HTML content of a URL, extracts its text, saves the content in JSON format if it meets a minimum token count, and stores metadata.

- `process_queue()`: Processes a queue of URLs for downloading HTML content utilizing multiple threads.

- `recurse_page_list()`: Recursively identifies sub-URLs starting from the initial URL.

- `build_page_list()`: Initiates the recursive page search and populates a queue with URLs.

- `download_html()`: Sets up logging and directories, starts the queue processing with multithreading, and records the total time taken. 

Helper functions like `makePathOnly()`, `makeFullyQualified()`, `deduplicate()`, `remove_exits()`, and `add_prefix()` perform various actions like URL normalization and deduplication.

