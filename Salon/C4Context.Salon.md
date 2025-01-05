```mermaid
C4Context
    title Salon Software System

    System_Boundary(Salon_Boundary) {
        Container(api_to_test_code, "api_to_test_code", "Tool", "Generates Python test code from API specifications")
        Container(repo_to_text, "repo_to_text", "Utility", "Processes and analyzes codebases")

        Container_Boundary(api_to_test_code_Boundary) {
            Component(parse_arguments, "parse_arguments", "Function", "Parses command-line arguments to get the input file path.")
            Component(extract_code, "extract_code", "Function", "Extracts Python code snippets from a string using specified markers.")
            Component(load_api_data, "load_api_data", "Function", "Loads and parses API data from JSON/YAML files, logs errors.")
            Component(main, "main", "Function", "Main function for execution.")
        }

        Container_Boundary(repo_to_text_Boundary) {
            Component(SummarisedDirectory, "SummarisedDirectory", "Class", "Stores directory names and their summaries.")
            Component(RepoContentProcessor, "RepoContentProcessor", "Class", "Handles repository processing.")
            Component(summarise_code, "summarise_code", "Function", "Summarizes source code using an external service.")
            Component(load_yaml, "load_yaml", "Function", "Loads configuration from YAML files, handles file management.")
            Component(parse_arguments_repo, "parse_arguments", "Function", "Parses command-line arguments for script options and input paths.")
            Component(validate_args, "validate_args", "Function", "Validates parsed arguments to ensure paths exist and are directories.")
        }
    }
```