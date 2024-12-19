**download_html.py**

This script downloads the HTML content of all sub-pages of a given URL and saves the contents as JSON files.

The `Counter` class provides a thread-safe counter to manage concurrent operations. The `makePathOnly`, `makeFullyQualified`, `deduplicate`, `remove_exits`, and `add_prefix` functions assist in URL manipulations and cleanup.

The `get_html` function fetches HTML content, cleans it, checks for minimum length, and saves it as a JSON file along with metadata. `process_queue` processes URLs stored in a queue, downloading their content using `get_html`.

The `recurse_page_list` function recursively crawls and collects URLs starting from a base URL. `build_page_list` constructs the initial URL list for processing.

Finally, the `download_html` function initializes the logging, starts the queue processing and manages threading for concurrent downloads. Important functions and classes: `Counter`, `makePathOnly`, `makeFullyQualified`, `get_html`, `process_queue`, `deduplicate`, `remove_exits`, `add_prefix`, `recurse_page_list`, `build_page_list`, `download_html`.

