**enrich_lite.py**

- The script removes text and description fields from dictionaries in a JSON list and saves the modified list to a new JSON file.
- The `remove_text` function processes each dictionary in the list to exclude the "text" and "description" keys.
- The `enrich_lite` function logs any errors, loads the JSON file, processes its content using `remove_text`, and saves the modified data to a new JSON file.
- The `enrich_lite` function expects a `destinationDir` argument indicating where to find and save the files.
- Key elements include the `remove_text` function for filtering data and the `enrich_lite` function for orchestrating the file operations and logging.

**enrich_text_chunks.py**

This script converts markdown-based JSON transcript files into a master CSV file. 

The `MddSegment` class represents segments of the transcript, including text, start time, and duration. The `gen_metadata_master` function generates metadata for these segments, while `clean_text` removes unwanted characters from the text. The functions `append_text_to_previous_chunk` and `add_new_chunk` help transition between chunks smoothly and add new chunks if certain conditions are met. 

The `parse_json_mdd_transcript` function parses the JSON file, breaking down the transcript into smaller chunks while calculating token lengths and segment time duration. 

The `get_transcript` function processes each `.mdd` file to extract the transcript chunks. 

The `enrich_text_chunks` function coordinates the entire process and saves the extracted and processed chunks into a master JSON file. It uses the Tiktoken library to manage tokenization and the Rich library for progress tracking.

**enrich_text_embeddings.py**

1. This script creates text embeddings using the OpenAI API, specifically integrating with Azure's variant of OpenAI.
  
2. The `normalize_text` function cleans and normalizes text by removing unwanted spaces, newlines, and incorrect punctuation formats.

3. The `get_text_embedding` function retrieves embeddings for the provided text using the OpenAI API, with retry logic for error handling.

4. The `process_queue` function processes chunks of text by either fetching saved embeddings or generating new ones if necessary, then updates the output queue.

5. The `enrich_text_embeddings` function orchestrates the preparation and processing of text chunks, manages logging, configures threading, and ensures chunks are processed and saved correctly.

6. Key imports include `AzureOpenAI` for API calls, `tenacity` for retry logic, `rich.progress` for progress tracking, and various standard libraries for file handling and logging.

Classes/Functions:
- `normalize_text`
- `get_text_embedding`
- `process_queue`
- `enrich_text_embeddings`

**enrich_text_summaries.py**

This code is designed to process and summarize YouTube transcripts using ChatGPT provided by Azure OpenAI. The key functions and classes in the module are `Counter`, `chatgpt_summary`, `process_queue_for_summaries`, and `enrich_text_summaries`.

**Classes:**
- **Counter**: A thread-safe counter used to keep track of processed chunks.
    
**Functions:**
- **chatgpt_summary**: Generates a summary of input text using ChatGPT, with retry logic to handle rate limiting and transient errors.
- **process_queue_for_summaries**: Processes a queue containing text chunks, summarizing each chunk with ChatGPT and handling existing summaries.
- **enrich_text_summaries**: Configures the Azure OpenAI client, loads input data, and starts multiple threads to process text chunks in parallel. The summaries are saved in an output JSON file.

The code also includes necessary imports, setting up logging, and ensuring the existence of output directories.

