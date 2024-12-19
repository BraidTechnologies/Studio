**api_to_test_code.py**

This code is a script designed to generate Pytest test cases from API data provided in either JSON or YAML format.

**Classes/Functions:**
1. **parse_arguments**: Parses command-line arguments to get the input file path.
2. **extract_code**: Extracts Python code snippets from content using specified markers.
3. **load_api_data**: Loads API data from a provided JSON or YAML file and returns it as a dictionary.
4. **main**: Coordinates the workflow, including parsing arguments, loading data, initializing the OpenAI assistant, and generating and saving test code.

Logging is configured to handle different levels of messages, and the OpenAI client is used for generating Pytest test cases.

**repo_to_text.py**

The `repo_to_text.py` script processes a local GitHub repository by concatenating the contents of its files into text files, with a specified word limit per file. The usage and options for running this script are provided through command-line arguments.

Key classes and functions:

1. **SummarisedDirectory**: Represents summaries of directory contents.
2. **RepoContentProcessor**: Handles the processing of the repository files, including skipping certain files/directories, summarizing source files, and saving the concatenated content.
3. **load_yaml**: Loads configuration from a YAML file.
4. **summarise_code**: Summarizes the content of source files using an API call.
5. **parse_arguments** and **validate_args**: Handle command-line argument parsing and validation.

Important methods within `RepoContentProcessor` manage formatting file content, counting words, checking paths, saving directory summaries, processing files, and processing the entire repository. The script also handles different configuration options and verbose output.

