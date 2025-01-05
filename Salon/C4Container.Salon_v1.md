```mermaid
C4Container
    title Salon System

    Container_Boundary(entire_system, "Salon") {
        Container(apitc, "api_to_test_code", "Python", "Tool that generates Python test code from API specifications.")
        Container(rtt, "repo_to_text", "Python", "Utility for processing and analyzing codebases.")
        
        Component(api_to_test_code_py, "api_to_test_code.py", "Python Script", "Generates Pytest code from API data provided in JSON or YAML format.")
        apitc --> api_to_test_code_py
        
        Component(parse_arguments_atc, "parse_arguments", "Function", "Parses command-line arguments to get the input file path.")
        Component(extract_code, "extract_code", "Function", "Extracts Python code snippets from a string using specified start and end markers.")
        Component(load_api_data, "load_api_data", "Function", "Loads and parses API data from the specified JSON or YAML file.")
        Component(main_atc, "main", "Function", "The main execution function for generating Pytest code.")
        
        api_to_test_code_py --> parse_arguments_atc
        api_to_test_code_py --> extract_code
        api_to_test_code_py --> load_api_data
        api_to_test_code_py --> main_atc
        
        Component(repo_to_text_py, "repo_to_text.py", "Python Script", "Processes and analyzes entire directories of source code.")
        rtt --> repo_to_text_py

        Component(SummarisedDirectory, "SummarisedDirectory", "Class", "Stores directory names and their summaries.")
        Component(RepoContentProcessor, "RepoContentProcessor", "Class", "Handles repository processing.")
        Component(summarise_code, "summarise_code", "Function", "Summarizes source code using an external service.")
        Component(load_yaml, "load_yaml", "Function", "Loads configuration from a YAML file.")
        Component(parse_arguments_rtt, "parse_arguments", "Function", "Parses command-line arguments for script options and input paths.")
        Component(validate_args, "validate_args", "Function", "Validates parsed arguments.")
        Component(main_rtt, "main", "Function", "The main execution function for repository processing.")
        
        repo_to_text_py --> SummarisedDirectory
        repo_to_text_py --> RepoContentProcessor
        repo_to_text_py --> summarise_code
        repo_to_text_py --> load_yaml
        repo_to_text_py --> parse_arguments_rtt
        repo_to_text_py --> validate_args
        repo_to_text_py --> main_rtt
        
        Component(__init__, "__init__", "Method", "Initializes the processor with paths, configurations, and word limits.")
        Component(make_common_file_name, "make_common_file_name", "Method", "Creates unique identifiers for common files.")
        Component(format_file_block, "format_file_block", "Method", "Formats content blocks with consistent indentation.")
        Component(count_words, "count_words", "Method", "Utilizes NLTK to count words in a text.")
        Component(is_in_git_directory, "is_in_git_directory", "Method", "Identifies paths to skip in git directories.")
        Component(is_skip_dir, "is_skip_dir", "Method", "Identifies paths to specifically skip.")
        Component(is_in_common_dir, "is_in_common_dir", "Method", "Identifies common directories within the project.")
        Component(should_resummarise_code, "should_resummarise_code", "Method", "Decides if a source file should be re-summarized.")
        Component(save_current_content, "save_current_content", "Method", "Saves accumulated content into a text file.")
        Component(process_file, "process_file", "Method", "Processes and accumulates content of an individual file.")
        Component(process_repo, "process_repo", "Method", "Orchestrates processing and storing summaries of the repository.")
        
        RepoContentProcessor --> __init__
        RepoContentProcessor --> make_common_file_name
        RepoContentProcessor --> format_file_block
        RepoContentProcessor --> count_words
        RepoContentProcessor --> is_in_git_directory
        RepoContentProcessor --> is_skip_dir
        RepoContentProcessor --> is_in_common_dir
        RepoContentProcessor --> should_resummarise_code
        RepoContentProcessor --> save_current_content
        RepoContentProcessor --> process_file
        RepoContentProcessor --> process_repo
    }
```