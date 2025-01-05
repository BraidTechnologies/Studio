```mermaid
C4Container
title Salon System

Container_Salon(Salon, "Salon System", "Technology demonstrator for automated software development tools using LLMs") {
    Component(api_to_test_code_py, "api_to_test_code.py", "Script", "Generates Pytest code from API data")
    Component(repo_to_text_py, "repo_to_text.py", "Script", "Processes and analyzes codebases")

    Rel_U(api_to_test_code_py, repo_to_text_py, "Uses", "Utility functions for code processing")
}

Container(api_to_test_code_py, "api_to_test_code.py", "Technology Demonstror for Automated Test Code Generation") {
    Component(parse_arguments, "parse_arguments", "Function", "Parses command-line arguments to get input file path")
    Component(extract_code, "extract_code", "Function", "Extracts Python code snippets from provided string")
    Component(load_api_data, "load_api_data", "Function", "Loads and parses API data from JSON or YAML files")
    Component(main_api, "main function", "Function", "Generates Pytest code and saves to a new file")
}

Rel(api_to_test_code_py, parse_arguments, "Uses", "Command-line arguments parsing")
Rel(api_to_test_code_py, extract_code, "Uses", "Extract code snippets")
Rel(api_to_test_code_py, load_api_data, "Uses", "API data loading and parsing")
Rel(api_to_test_code_py, main_api, "Uses", "Main execution function")

Container(repo_to_text_py, "repo_to_text.py", "Technology Demonstror for Code Analysis and Processing") {
    Component(SummarisedDirectory, "SummarisedDirectory", "Class", "Stores directory names and their summaries")
    Component(RepoContentProcessor, "RepoContentProcessor", "Class", "Handles repository processing") {
        Component(__init__, "__init__", "Function", "Initializes the processor with paths and configurations")
        Component(make_common_file_name, "make_common_file_name", "Function", "Creates unique identifiers for common files")
        Component(format_file_block, "format_file_block", "Function", "Formats content blocks with indentation")
        Component(count_words, "count_words", "Function", "Word count using NLTK")
        Component(is_in_git_directory, "is_in_git_directory", "Function", "Identifies git paths to skip")
        Component(is_skip_dir, "is_skip_dir", "Function", "Identifies directories to skip")
        Component(is_in_common_dir, "is_in_common_dir", "Function", "Identifies common paths")
        Component(should_resummarise_code, "should_resummarise_code", "Function", "Decides re-summarization")
        Component(save_current_content, "save_current_content", "Function", "Saves accumulated content to a text file")
        Component(process_file, "process_file", "Function", "Processes and accumulates file content")
        Component(process_repo, "process_repo", "Function", "Orchestrates the repository processing")
    }
    Component(summarise_code, "summarise_code", "Function", "Summarizes source code using external service")
    Component(load_yaml, "load_yaml", "Function", "Loads configuration from YAML file")
    Component(parse_arguments_repo, "parse_arguments", "Function", "Parses command-line arguments")
    Component(validate_args, "validate_args", "Function", "Validates parsed arguments")

    Rel(repo_to_text_py, SummarisedDirectory, "Uses", "Store directory summaries")
    Rel(repo_to_text_py, RepoContentProcessor, "Uses", "Repository processing")
    Rel(repo_to_text_py, summarise_code, "Uses", "Summarize source code")
    Rel(repo_to_text_py, load_yaml, "Uses", "Load configuration")
    Rel(repo_to_text_py, parse_arguments_repo, "Uses", "Command-line argument parsing")
    Rel(repo_to_text_py, validate_args, "Uses", "Validate arguments")
}

Rel(api_to_test_code_py, repo_to_text_py, "Integrates With", "For utility functions")
```
