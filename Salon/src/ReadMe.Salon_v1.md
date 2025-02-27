**api_to_test_code.py**

This script generates Python Pytest code from API data provided in a JSON or YAML file. It uses the OpenAI API to generate test cases, allowing iterative refinement of the generated code through a conversational process.  The script takes the input file path and an optional `--eval` flag to generate specialized evaluation tests.  It constructs a prompt based on the input data and user instructions, sends it to the OpenAI assistant, and extracts the generated Python code. The generated code is then saved to a file and displayed in the console.  The script handles various error conditions and provides informative logging.


**repo_to_c4.py**

This script analyzes a local Git repository to generate C4 diagrams. It takes the repository path and an optional `model_type` (braid_api or local_gemini) as command-line arguments.  The script walks the directory structure, collecting file information. It then uses specified processors based on the chosen model type to analyze the collected data and generate the C4 model.  Configuration and argument parsing are managed by a `ConfigManager`.  The `walk_directory` function gathers repository data, which is then processed to create the final C4 output.


**repo_to_text.py**

This script `repo_to_text.py` processes a local Git repository, converting code files into text files with a configurable maximum word count.  It uses a configuration file (`config.yaml` by default) and command-line arguments to specify repository path, output directory, file/directory exclusions, and the model type for processing ("braid_api" or "local_gemini"). The script traverses the repository, filters files based on specified patterns, and then uses processors to generate text summaries, potentially creating a 'ReadMe.Salon.md' file.  The `nltk` library is used for text processing.


**Directory core**

These Python scripts manage configuration and file operations. `config_manager.py` defines a `ConfigManager` that parses command-line arguments for settings like repository path, model type, and output directory, loading defaults from a YAML file. It validates arguments, ensuring paths exist.  `file_handler.py` provides a `FileHandler` with version control for file writing.  Its `write_file_version` method automatically adds or increments version numbers in filenames (e.g., `file_v1.txt`, `file_v2.txt`) to prevent overwriting.  Both classes simplify common tasks and improve robustness.


**Directory directory_processor**

This codebase provides a framework for processing directory structures and generating documentation using AI.  `DirectoryProcessor` and `directory_walker` form the core, handling traversal and data representation.  `visitors_factory` creates processor pipelines for specific tasks like text extraction and C4 diagram generation.  `repo_readme_generator` creates and updates readme files with AI-generated code summaries.  `c4_generator` uses AI to create C4 diagrams from readme content.  `code_aggregator` concatenates code into large text blocks for further processing.  The system uses a `FileHandler` for consistent file operations.


**Directory helpers**

This Python script uses the `tiktoken` library to count tokens in a specified text file.  It accepts the file path as a command-line argument (`--f`) and an optional verbose flag (`--v`). The script reads the file content and employs a GPT-4 tokenizer to determine the token count, which is then printed.  If the verbose flag is enabled, it also calculates and displays the number of file copies that could fit within a 65536-token limit, simulating a context window. The script includes error handling for file access and tokenizer setup.


**Directory models**

This codebase provides a framework for interacting with different AI models like Gemini and OpenAI.  An abstract `AIModel` class in `base.py` defines the required `generate_content` method.  `gemini.py` and `open_ai.py` implement this method for their respective models, handling API calls and retries.  `model_factory.py` simplifies model creation using a factory function that returns instances of specific models based on a string input. This allows for easy switching between different AI models.  The OpenAI model also includes a `generate_code` method leveraging OpenAI's Assistants API for code generation.  API keys are managed through environment variables.


**Directory prompts**

This Python code provides prompt templates for generating C4 model diagrams in Mermaid syntax using an AI.  Separate prompts exist for Context, Container, and Component diagrams, instructing the AI to produce valid Mermaid code depicting system elements and their relationships.  The code also includes persona definitions for an AI code summarizer and a C4 diagrammer, establishing the expected roles for subsequent interactions. This setup ensures the AI understands its task – generating accurate and structurally sound C4 diagrams in Mermaid format based on the provided prompts.


**Directory types**

The `DirectoryData` class in `directory_data.py` stores metadata about a directory, including its path, contained files (source and all), presence of a "ReadMe.Salon.md" file,  and a flag for summary generation.  It uses `pathlib` for path operations and leverages a list of `DirectoryData` objects to recursively represent subdirectories, enabling a hierarchical view of directory structures and their metadata.  This structure facilitates efficient management and processing of directory information.


Generated by Salon from Braid Technologies, 27/02/2025