```mermaid
C4Container
    title Salon

    Container_Boundary(c1, "Salon Application") {
        
        Component(api_to_test_code, "api_to_test_code", "Tool", "Generates Python test code from API specifications")
        
        Component(repo_to_text, "repo_to_text", "Utility", "Processes and analyzes codebases")
        
        Component(repo_to_c4.py, "repo_to_c4.py", "Tool", "Generates C4 architecture diagrams from GitHub repositories")
    }

    Container_Boundary(c2, "API Testing Subsystem") {
        Component(LocalArgumentParser, "LocalArgumentParser", "Class", "Custom argument parser")
        Component(parse_arguments, "parse_arguments", "Function", "Sets up and parses command-line arguments")
        Component(extract_code, "extract_code", "Function", "Extracts Python code snippets from content")
        Component(load_api_data, "load_api_data", "Function", "Reads and parses API data from file")
        Component(main, "main", "Function", "Orchestrates the script's workflow")
    }

    Container_Boundary(c3, "Summarisation and Visitor Subsystem") {
        Component(chat_model_drivers, "chat_model_drivers.py", "Module", "Defines summarisation model drivers")
        Component(count_tokens, "count_tokens.py", "Tool", "Counts the number of tokens in a text file")
        Component(directory_visitor_base, "directory_visitor_base.py", "Module", "Holds metadata about a directory")
        Component(directory_visitor_c4, "directory_visitor_c4.py", "Module", "Generates C4 diagrams")
        Component(directory_visitor_notebook_lm, "directory_visitor_notebook_lm.py", "Module", "Concatenates file content to a word limit")
        Component(directory_visitor_readme, "directory_visitor_readme.py", "Module", "Creates/updates 'ReadMe.Salon.md' summaries")
        Component(directory_walker, "directory_walker.py", "Module", "Traverses directory trees and applies visitor classes")
        Component(visitor_factory, "visitor_factory.py", "Factory Module", "Creates sets of `DirectoryVisitor` objects for different workflows")
    }

    Container_Boundary(c4, "Testing Subsystem") {
        Component(test_repo_text, "test_repo_text.py", "Test", "Tests `repo_to_text.py` functionalities")
        Component(test_visitor, "test_visitor.py", "Test", "Unit tests for `DirectoryVisitor` class and subclasses")
        Component(test_walker, "test_walker.py", "Test", "Tests `DirectoryWalker` and `DirectoryVisitor` classes")
    }
   
    api_to_test_code --> LocalArgumentParser
    api_to_test_code --> parse_arguments
    api_to_test_code --> extract_code
    api_to_test_code --> load_api_data
    api_to_test_code --> main

    chat_model_drivers --> api_to_test_code
    directory_visitor_base --> repo_to_text
    directory_visitor_c4 --> repo_to_c4.py
    directory_visitor_notebook_lm --> repo_to_text
    directory_visitor_readme --> repo_to_text
    directory_walker --> repo_to_c4.py
    visitor_factory --> chat_model_drivers
    
    test_repo_text --> repo_to_text
    test_visitor --> repo_to_text
    test_visitor --> repo_to_c4.py
    test_walker --> repo_to_text
    test_walker --> repo_to_c4.py
    test_walker --> LocalArgumentParser
```
