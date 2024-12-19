**enrich_lite.py**

This script processes JSON data to remove specific text fields and saves the modified data into a new JSON file.

The `remove_text` function iterates through a list of dictionaries and removes the "text" and "description" keys from each dictionary.

The `enrich_lite` function handles the overall process. It begins by configuring logging and checking if the destination directory is provided. It then reads the input JSON file, processes the contents using `remove_text`, and saves the modified data to a new JSON file. Important classes/functions: `remove_text`, `enrich_lite`.

**enrich_text_chunks.py**

This script processes markdown transcript files to generate a master CSV file. 

1. **Imports**: It includes standard libraries such as `os`, `json`, `logging`, and `pathlib`, as well as third-party libraries like `tiktoken` and `rich`.

2. **Constants**: Several constants, such as `PERCENTAGE_OVERLAP`, are defined to control the overlap of text chunks during processing.

3. **Classes & Functions**: 
   - **MddSegment**: Class to encapsulate each segment of text within a transcript.
   - **gen_metadata_master** and **clean_text**: Functions for generating and cleaning metadata.
   - **append_text_to_previous_chunk** and **add_new_chunk**: Functions for managing text chunks.
   - **parse_json_mdd_transcript**: Parses JSON-encoded MDD files.
   - **get_transcript**: Main function to handle file operations and transcript aggregation.
   - **enrich_text_chunks**: Orchestrates the processing of files and aggregates the results.

4. **Execution Flow**: The script reads JSON files, processes them into text chunks, and then aggregates these into a final JSON output file, ensuring the output directory exists. Logging is used extensively for debugging and tracking progress.

**enrich_text_embeddings.py**

This script processes chunks of text to create embeddings using the OpenAI API.

The `normalize_text` function cleans and standardizes text by removing redundant spaces and correcting some punctuation issues.

The `get_text_embedding` function communicates with the OpenAI API to generate text embeddings, with retries for certain errors.

The `process_queue` function handles processing each text chunk from a queue, checking for existing embeddings, and if unavailable, fetching them from the API.

The `enrich_text_embeddings` function orchestrates the workflow: it sets up logging, prepares input data and a processing queue, initiates multiple threads to process data, and manages saving the resulting enriched embeddings.

Key classes or functions:
- `normalize_text`
- `get_text_embedding`
- `process_queue`
- `enrich_text_embeddings`

**enrich_text_summaries.py**

This module is for summarizing YouTube transcripts using the OpenAI GPT model via Azure. Important classes and functions include `Counter`, `chatgpt_summary`, `process_queue_for_summaries`, and `enrich_text_summaries`.

1. **Imports**: The script imports libraries for various tasks, such as threading, queue processing, logging, OpenAI interfacing, and retry logic.

2. **Counter Class**: This thread-safe counter class uses locks to ensure the accurate counting of processed elements.

3. **chatgpt_summary Function**: This function sends a text to the OpenAI model, requesting a summary. It retries on failure with exponential backoff and stops after five attempts.

4. **process_queue_for_summaries Function**: This function processes a queue of text chunks, utilizing threading for concurrent processing. Each chunk is sent to `chatgpt_summary` for summarization if it hasn't already been summarized.

5. **enrich_text_summaries Function**: This function initializes the OpenAI client, sets up the logging, loads input chunks, and processes them to ensure summaries are generated and stored. It uses threading to speed up processing and saves the enriched chunks to a file.

The script leverages multi-threading and retry mechanisms for effective and reliable summarization of large amounts of text data.

