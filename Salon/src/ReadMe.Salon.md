**api_to_test_code.py**

This script generates Pytest code from API data provided in JSON or YAML format.

**parse_arguments**: Parses command-line arguments to get the input file path.

**extract_code**: Extracts Python code snippets from a string using specified start and end markers.

**load_api_data**: Loads and parses API data from the specified JSON or YAML file, logging errors if the file is not found or contains invalid data.

**main**: The main execution function. It parses input arguments, loads API data, and sets up an OpenAI assistant to generate Pytest code. Generated code is saved to a new Python file.

**Classes/Functions**: `parse_arguments`, `extract_code`, `load_api_data`, `main`.

**repo_to_text.py**

### Important Classes and Functions:

1. **SummarisedDirectory**: Stores directory names and their summaries.

2. **RepoContentProcessor**: Handles repository processing:
   - `__init__`: Initializes the processor with paths, configurations, and word limits.
   - `make_common_file_name`: Creates unique identifiers for common files.
   - `format_file_block`: Formats content blocks with consistent indentation.
   - `count_words`: Utilizes NLTK to count words in a text.
   - `is_in_git_directory`, `is_skip_dir`, `is_in_common_dir`: Identifies paths to skip.
   - `should_resummarise_code`: Decides if a source file should be re-summarized.
   - `save_current_content`: Saves accumulated content into a text file.
   - `process_file`: Processes an individual file and accumulates its content.
   - `process_repo`: Orchestrates repository processing and stores summaries.

3. **summarise_code**: Summarizes source code using an external service.

4. **load_yaml**: Loads configuration from a YAML file, handles file and error management.

5. **parse_arguments**: Parses command-line arguments for script options and input paths.

6. **validate_args**: Validates parsed arguments to ensure paths exist and are directories.

### Script Workflow:

- **Argument Handling**: Arguments are parsed and validated.
- **Initialization**: Creates `RepoContentProcessor` with repository path, configuration, and max words.
- **Skip Patterns and Directories**: Updates processor with additional patterns or directories to skip.
- **Working Directory**: Changes to specified output directory.
- **Processing**: Calls `process_repo()` to process the repository.
- **Error Handling**: Catches exceptions, prints errors, and exits with a status code of 1.

### Entry Point:
- The script starts execution with the `main()` function when run directly.

