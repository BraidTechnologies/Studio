**download_html.py**

This script downloads the text content of all subpages from a specified URL and saves it in JSON format.

Important classes and functions include:
- `Counter` class: A thread-safe counter.
- `makePathOnly`: Generates a clean path from a URL.
- `makeFullyQualified`: Forms a fully-qualified URL from a base and relative path.
- `get_html`: Downloads HTML content of a URL, processes it to extract text, and saves it in a JSON file.
- `process_queue`: Processes a queue of URLs, downloading HTML content in multiple threads.
- `deduplicate`: Removes duplicate links.
- `remove_exits`: Removes links pointing out of the main site.
- `add_prefix`: Adds prefixes to relative URLs.
- `recurse_page_list`: Recursively crawls pages starting from a URL.
- `build_page_list`: Builds a list of pages from a URL.
- `download_html`: Main function to manage the downloading process with multi-threading.

