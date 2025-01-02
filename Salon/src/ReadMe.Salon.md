**api_to_test_code.py**

This script generates Pytest test code from JSON or YAML API data.

The `parse_arguments` function uses `argparse` to handle command-line arguments, targeting an input file path. The `extract_code` function extracts Python code snippets between specified start and end markers.

The `load_api_data` function reads the input file, determines its format (JSON or YAML), and converts the contents into a dictionary.

In the `main` function, it obtains the input path, loads the API data, and sets up an assistant using OpenAI's API to generate test code. The script handles errors and logs critical errors if API data fails to load or generate code.

**repo_to_text.py**

This `repo_to_text.py` script reads files from a specified local GitHub repository, processes their content into text files within a set word limit, and generates summaries for source code files.

Key functions include:
- `parse_arguments`: Handles command-line arguments.
- `validate_args`: Ensures paths and arguments are valid.
- `load_yaml`: Reads configuration from a YAML file.

Key class:
- `RepoContentProcessor`: Manages repository processing, which includes initialization, file processing, word count management, content saving when limits are reached, and directory content handling.

Additional functionality:
- `summarise_code`: Utilizes an API to summarize source code files.
- Processes directories and files to skip.
- Uses `nltk` for word tokenization and `requests` for API interaction.

The script initiates with `if __name__ == "__main__":` to execute the `main()` function, which is essential but not defined in the provided snippet.

