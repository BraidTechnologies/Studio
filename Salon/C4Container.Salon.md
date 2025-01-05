```mermaid
C4Container
  title Salon System Context

  System_Boundary(Salon) {
    Container(api_to_test_code, "api_to_test_code", "Script", "Generates Python test code from API specs")
    Container(repo_to_text, "repo_to_text", "Script", "Processes and analyzes codebases")

    Container_Boundary(api_to_test_code) {
      Container(parse_arguments, "parse_arguments", "Function", "Parses command-line arguments")
      Container(extract_code, "extract_code", "Function", "Extracts Python code snippets")
      Container(load_api_data, "load_api_data", "Function", "Loads and parses API data from file")
      Container(main, "main", "Function", "Main execution function")
    }

    Container_Boundary(repo_to_text) {
      Container(SummarisedDirectory, "SummarisedDirectory", "Class", "Stores directory summaries")
      Container(RepoContentProcessor, "RepoContentProcessor", "Class", "Handles repository processing")
      Container(summarise_code, "summarise_code", "Function", "Summarizes source code")
      Container(load_yaml, "load_yaml", "Function", "Loads YAML configuration")
      Container(process_file, "process_file", "Function", "Processes an individual file for content")
      Container(process_repo, "process_repo", "Function", "Orchestrates repository processing")
      Container(parse_arguments, "parse_arguments", "Function", "Parses command-line arguments")
      Container(validate_args, "validate_args", "Function", "Validates command-line arguments")
    }
  }
  
  api_to_test_code -> repo_to_text : Uses for code analysis
  parse_arguments -> api_to_test_code : Input arguments
  extract_code -> api_to_test_code : Provides code snippets
  load_api_data -> api_to_test_code : Loads API data
  main -> api_to_test_code : Main execution

  SummarisedDirectory -> repo_to_text : Stores summaries
  RepoContentProcessor -> repo_to_text : Processes repository
  summarise_code -> repo_to_text : Summarizes code
  load_yaml -> repo_to_text : Loads configuration
  process_file -> repo_to_text : Processes file
  process_repo -> repo_to_text : Orchestrates processing
  parse_arguments -> repo_to_text : Parses arguments
  validate_args -> repo_to_text : Validates arguments
```
