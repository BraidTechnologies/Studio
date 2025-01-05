```mermaid
C4Component
title Component diagram for Salon

Container_Boundary(api_to_test, "api_to_test_code") {
    Component(arg_parser1, "parse_arguments", "Python", "Parses command-line arguments for input file path")
    Component(code_extractor, "extract_code", "Python", "Extracts Python code snippets using markers")
    Component(api_loader, "load_api_data", "Python", "Loads and parses API data from JSON/YAML")
    Component(main1, "main", "Python", "Orchestrates test generation process")
}

Container_Boundary(repo_to_text, "repo_to_text") {
    Component(arg_parser2, "parse_arguments", "Python", "Parses command-line arguments")
    Component(yaml_loader, "load_yaml", "Python", "Loads configuration from YAML")
    Component(validator, "validate_args", "Python", "Validates paths and arguments")
    
    Component(processor, "RepoContentProcessor", "Python", "Core repository processing class")
    Component(summarizer, "summarise_code", "Python", "Summarizes source code using LLM")
    Component(main2, "main", "Python", "Orchestrates repository processing")

    Component(dir_summary, "SummarisedDirectory", "Python", "Stores directory names and summaries")
}

System_Ext(openai, "OpenAI API", "LLM service")
System_Ext(git, "Git Repository", "Source code")
ContainerDb(fs, "File System", "Stores outputs")

' api_to_test_code relationships
Rel(main1, arg_parser1, "Uses")
Rel(main1, api_loader, "Uses")
Rel(main1, code_extractor, "Uses")
Rel(main1, openai, "Generates tests")
Rel(main1, fs, "Writes test files")

' repo_to_text relationships
Rel(main2, arg_parser2, "Uses")
Rel(main2, yaml_loader, "Uses")
Rel(main2, validator, "Uses")
Rel(main2, processor, "Creates and runs")

Rel(processor, dir_summary, "Creates")
Rel(processor, summarizer, "Uses")
Rel(processor, git, "Reads files")
Rel(processor, fs, "Writes summaries")
Rel(summarizer, openai, "Requests summaries")

```