**download_markdown.py**

This script downloads Markdown file transcripts from a specified GitHub repository and converts them to plain text, saving both the text and metadata in JSON format.

### Important Classes and Functions:
- **Counter**: A thread-safe counter to keep track of processed files.
- **makeSourceId(repoSourceDir, repoName, filePath)**: Constructs a unique source ID for each Markdown file.
- **md_to_plain_text(md)**: Converts Markdown content to plain text using BeautifulSoup.
- **get_markdown(fileName, counter_id, repoSourceDir, repoName, markdownDestinationDir, logger)**: Reads and converts Markdown files to plain text, then saves them with metadata in JSON format.
- **process_queue(q, repoSourceDir, repoName, markdownDestinationDir, logger)**: Processes a queue of files using multiple threads.
- **download_markdown(repoSourceDir, repoName, markdownDestinationDir)**: Main function to manage downloading and processing Markdown files.

