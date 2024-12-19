**download_markdown.py**

This script downloads and processes Markdown files from a GitHub repository and saves both their plain text content and metadata.

- The `Counter` class provides a thread-safe counter to track processed files.
- `makeSourceId` constructs a unique source identifier from the given repository and file path.
- `md_to_plain_text` converts Markdown content into plain text using BeautifulSoup.
- `get_markdown` reads a Markdown file, converts it to plain text, and saves the content and metadata in JSON format.
- `process_queue` manages a queue of files to process, utilizing threading for efficiency.
- `download_markdown` sets up the logging, initializes the queue, starts processing threads, and calculates total execution time.

Relevant functions and classes: `Counter`, `makeSourceId`, `md_to_plain_text`, `get_markdown`, `process_queue`, and `download_markdown`.

