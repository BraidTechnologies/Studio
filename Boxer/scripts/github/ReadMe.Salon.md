**download_markdown.py**

- **Imports**: The script imports standard libraries like `os`, `json`, `logging`, `time`, `threading`, `queue`, and `pathlib`, and third-party packages like `markdown` and `BeautifulSoup`.

- **Counter Class**: Defines a thread-safe counter for tracking processed files, which uses a threading lock to ensure synchronization.

- **makeSourceId Function**: Constructs a unique source ID for each file based on the repository directory, repository name, and file path.

- **md_to_plain_text Function**: Converts Markdown content to plain text using `markdown` and `BeautifulSoup`.

- **get_markdown Function**: Reads the Markdown content of a file, converts it to plain text, and saves it as a `.json` file along with metadata. It also skips files that already exist.

- **process_queue Function**: Processes a queue of files, increments the counter, and calls the `get_markdown` function for each file.

- **download_markdown Function**: Main function that sets up the logging, initializes the queue, searches for `.md` files recursively, and processes these files with multiple threads.

