**enrich_lite.py**

This script processes a JSON file by removing specific fields ("text" and "description") from each dictionary within a list of dictionaries, and then saves the modified version as a new JSON file.

**Key components**:
- `remove_text(segments)`: Function that iterates through a list of dictionaries and removes the keys "text" and "description".
- `enrich_lite(destinationDir)`: Main function that reads the input JSON file, uses `remove_text` to process the data, and writes the result to a new JSON file.

It also includes error logging if the destination directory is not provided and logs the total number of segments processed.

**enrich_text_chunks.py**

The script generates a master CSV file from transcript files by processing JSON files.

`MddSegment`: A class that represents a segment of an MDD file, containing text, start time, and duration.

`gen_metadata_master`: Cleans and generates metadata for each transcript.

`clean_text`: Cleans text by removing unwanted characters and formatting issues.

`append_text_to_previous_chunk`: Ensures smooth context transition by appending a portion of the text to the previous chunk.

`add_new_chunk`: Adds a new chunk of text to the list of chunks if it meets the required length.

`parse_json_mdd_transcript`: Parses the JSON MDD file to extract text, segment it appropriately, and handle token limits and transitions between chunks.

`get_transcript`: Retrieves and processes the transcript from an MDD file, checking the file's existence and updating the total processed files.

`enrich_text_chunks`: Manages the entire process, setting up logging, initializing variables, iterating over JSON files in the specified directory, and saving the processed chunks to a master JSON file.

Important global variables: `PERCENTAGE_OVERLAP`, `AVERAGE_CHARACTERS_PER_TOKEN`, `AVERAGE_WORDS_PER_MINUTE`, `AVERAGE_TOKENS_PER_WORD`, `total_files`.

**enrich_text_embeddings.py**

### Summary:

The script creates text embeddings using the OpenAI API and enriches text data stored in JSON files.

**Important Classes/Functions:**

- **normalize_text:** Cleans and normalizes input text by removing extra spaces and newlines.
  
- **get_text_embedding:** Attempts to fetch text embeddings from the OpenAI API with retry logic for handling exceptions.
    
- **process_queue:** Processes chunks of text in a queue to retrieve embeddings or retrieve cached embeddings, then stores the results.
    
- **enrich_text_embeddings:** Configures logging, sets up the OpenAI client, reads chunks from a JSON file, initializes processing threads, and outputs the enriched data back to a JSON file.

### Points:

1. **Imports:** The script imports necessary libraries and modules including logging, threading, progress tracking, and OpenAI's API.
   
2. **Normalization:** Sanitizes input texts to remove extra spaces, newlines, and other unwanted characters.
   
3. **Retry Logic:** Implements retry mechanisms for OpenAI API calls with exponential backoff to handle transient errors.

4. **Text Embeddings:** Retrieves or computes text embeddings and updates the processed data with embeddings.

5. **Queue and Threads:** Uses multi-threading to efficiently handle large sets of text data, processes a queue of tasks, and manages task completion.

6. **Caching:** Checks for existing cached data to prevent redundant processing.

7. **File I/O:** Reads and writes JSON files to store the input and output data, ensuring that the directory exists.

**enrich_text_summaries.py**

1. **Classes and Imports**: The code uses various standard (json, os, threading, queue, logging) and third-party libraries (openai, tenacity, rich) to interact with APIs, handle errors, manage threads, and create progress bars. It defines a thread-safe `Counter` class to manage a shared counter across threads.

2. **chatgpt_summary Function**: This function generates a summary using OpenAI's ChatGPT API. It uses a retry mechanism to handle transient failures, calling the API to generate a summary for the provided text and returning it if successful.

3. **process_queue_for_summaries Function**: This function processes items from a queue, calling `chatgpt_summary` to generate summaries. It manages threading to concurrently process multiple chunks of text and updates the progress.

4. **enrich_text_summaries Function**: This function initializes necessary configurations, sets up logging, and loads text chunks from a JSON file. It employs multithreading to process these chunks, generating summaries and appending them to a list.

5. **Main Flow**: The main function processes text chunks, manages multiple threads for concurrent execution, and writes the enriched summaries to a JSON output file, ensuring the output directory exists.

