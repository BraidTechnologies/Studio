**api_to_test_code.py**

This script uses the OpenAI API to generate Python test code based on API data provided in a JSON or YAML file.  It takes the input file path and an optional `--eval` flag to generate specialized evaluation tests. The script constructs a prompt for the OpenAI assistant, including instructions and the API data. It then iteratively refines the generated code based on user feedback.  The generated code is extracted and saved to a Python file.  The script uses logging for debugging and error handling, and provides clear console output for the user.


**repo_to_c4.py**

This script `repo_to_c4.py` generates C4 diagrams from a local Git repository. It takes the repository path and an optional model type (`braid_api` or `local_gemini`) as command-line arguments.  The script traverses the repository, collects directory and file information, and uses processors based on the chosen model type to analyze the code.  It leverages a `ConfigManager` for argument parsing and configuration.  The core logic resides in the `walk_directory` and `process_directory` functions, which handle file system traversal and C4 diagram generation, respectively.


**repo_to_text.py**

This script `repo_to_text.py` processes a local Git repository, converting code files into text files with a maximum word count. It uses a configuration file (`config.yaml` or specified via `--cfg`) to define parameters like skipped directories/files and source file patterns.  The script walks the directory structure, concatenates code content, and optionally generates a 'ReadMe.Salon.md' summary using either a Braid API or local Gemini model (specified by `--model_type`).  Output files are saved to a specified or default output directory.  The script utilizes several helper modules for directory traversal, configuration management, and text processing.


**Directory core**

These Python files provide utility classes for managing configuration and file handling. `ConfigManager` simplifies handling command-line arguments and YAML configurations, providing methods to parse, load, validate, and access them. It uses a custom argument parser for better error messages.  `FileHandler` facilitates file operations with automatic versioning.  `write_file_version` appends version numbers to filenames, preventing overwriting.  Both classes enhance code clarity and robustness by centralizing common tasks and error handling.


**Directory directory_processor**

This codebase provides tools for processing directory structures, focusing on code analysis and documentation generation.  `directory_walker` traverses directories, creating a hierarchical representation. `base` defines a processor base class, implemented by `c4_generator`, `code_aggregator`, and `repo_readme_generator`.  `c4_generator` creates C4 diagrams from readme files using an AI model. `code_aggregator` concatenates code into chunks for easier processing. `repo_readme_generator` creates and updates readme files with AI-generated code summaries.  `factory` provides convenient access to configured processor lists. The system facilitates automated code documentation and architectural visualization.


**Directory helpers**

This script uses the `tiktoken` library to count tokens in a specified text file.  It takes the file path as a required argument and a verbose flag as an optional argument. After reading the file, it initializes a GPT-4 tokenizer and counts the tokens. The total token count is then printed to the console.  If the verbose flag is enabled, the script calculates and displays how many full copies of the file could fit within a 65536-token limit, simulating a context window. The script includes error handling for file not found and tokenizer initialization issues.


**Directory models**

This codebase provides a framework for interacting with different AI models like Gemini and OpenAI through a common interface.  An abstract base class `AIModel` defines the required `generate_content` method.  `GeminiModel` and `OpenAiModel` implement this method to interact with their respective APIs, including error handling and retries.  `OpenAiModel` also offers a `generate_code` method leveraging OpenAI's code interpreter. A factory function `create_model` simplifies model instantiation based on a string identifier.  API keys and other configurations are managed via environment variables.


**Directory prompts**

This code provides prompts designed to guide an AI in generating C4 model diagrams using Mermaid syntax.  It emphasizes the correct usage of C4 elements like `C4Context`, `C4Container`, and `C4Component`, ensuring relationships are defined using element IDs and avoiding PlantUML syntax. The prompts encourage smaller, accurate diagrams over potentially incorrect larger ones.  Furthermore, the code includes personas to tailor AI responses for either summarizing code or generating C4 diagrams.  This structured approach helps produce consistent and valid C4 diagrams from text descriptions.


**Directory types**

The `DirectoryData` class in `directory_data.py` stores information about a directory, including its path, contained files (specifically noting the presence of "ReadMe.Salon.md"), and subdirectories.  Using `pathlib`, it efficiently manages file paths.  Subdirectories are represented as nested `DirectoryData` objects, creating a recursive structure.  The `needs_summary` flag indicates whether a summary should be generated for the directory's contents.  Type hinting enhances code readability and maintainability.


Generated by Salon from Braid Technologies, 28/02/2025