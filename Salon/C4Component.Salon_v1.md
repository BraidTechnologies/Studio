```mermaid
C4Component
title Salon Technology Demonstrator

Container_Boundary(c1, "Salon System") {
    
    Component(api_to_test_code, "api_to_test_code", "Python Script", "Tool that automatically generates Python test code from API specifications")
    Component(repo_to_text, "repo_to_text", "Python Script", "Utility for processing and analyzing codebases")

    Component_Boundary(api_to_test_code_pb, "api_to_test_code.py") {
        Component(parse_arguments, "parse_arguments", "Function", "Parses command-line arguments to get the input file path")
        Component(extract_code, "extract_code", "Function", "Extracts Python code snippets from a string using specified markers")
        Component(load_api_data, "load_api_data", "Function", "Loads and parses API data from JSON or YAML file")
        Component(main_api, "main", "Function", "Parses input arguments, loads API data, sets up OpenAI assistant, generates Pytest code")
    }

    Component_Boundary(repo_to_text_pb, "repo_to_text.py") {
        Component(SummarisedDirectory, "SummarisedDirectory", "Class", "Stores directory names and their summaries")
        Component(RepoContentProcessor, "RepoContentProcessor", "Class", """
            Handles repository processing:
            - __init__: Initializes the processor with paths, configurations, and word limits.
            - make_common_file_name: Creates unique identifiers for common files.
            - format_file_block: Formats content blocks with consistent indentation.
            - count_words: Utilizes NLTK to count words in a text.
            - is_in_git_directory, is_skip_dir, is_in_common_dir: Identifies paths to skip.
            - should_resummarise_code: Decides if a source file should be re-summarized.
            - save_current_content: Saves accumulated content into a text file.
            - process_file: Processes an individual file and accumulates its content.
            - process_repo: Orchestrates repository processing and stores summaries.
            """)
        Component(summarise_code, "summarise_code", "Function", "Summarizes source code using an external service")
        Component(load_yaml, "load_yaml", "Function", "Loads configuration from a YAML file, handles file and error management")
        Component(parse_arguments_repo, "parse_arguments", "Function", "Parses command-line arguments for script options and input paths")
        Component(validate_args, "validate_args", "Function", "Validates parsed arguments to ensure paths exist and are directories")
    }

}

Rel(api_to_test_code, OpenAI, "Provides context-aware prompts for accurate test generation", "External Service")
Rel(repo_to_text, Repository, "Processes entire directories of source code", "File System")

Rel(main_api, parse_arguments, "Calls")
Rel(main_api, load_api_data, "Utilizes")
Rel(main_api, extract_code, "Calls")

Rel(parse_arguments_repo, validate_args, "Validates")
Rel(repo_to_text, summarise_code, "Uses")
Rel(repo_to_text, load_yaml, "Loads configuration from")
Rel(repo_to_text, RepoContentProcessor, "Orchestrates repository processing")
Rel(RepoContentProcessor, save_current_content, "Saves content using")

```
