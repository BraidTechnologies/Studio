```mermaid
C4Context
title Salon System Context Diagram

Person(user, "User")

System_Boundary(Salon_Boundary, "Salon") {
    System ("Salon", "Automated API Testing & Code Analysis", "Technology demonstrator for automated software development tools using Large Language Models (LLMs).") {
        Container(api_to_test_code, "API to Test Code", "Automated generation of Python test code from API specifications.")
        Container(repo_to_text, "Repo to Text", "Processing and analysis of codebases.")
    }
    ContainerDb(api_spec_storage, "API Specification Storage", "JSON/YAML API specifications")
    ContainerDb(repo_storage, "Repository Storage", "Source code repositories")
}

Rel(user, api_to_test_code, "Provides API specifications")
Rel(api_to_test_code, api_spec_storage, "Reads from and writes to", "JSON/YAML API specifications")
Rel(api_to_test_code, repo_to_text, "Uses for further analysis")
Rel(user, repo_to_text, "Provides source code to analyze")
Rel(repo_to_text, repo_storage, "Reads from and writes to", "Source code repositories")

Rel_D(api_to_test_code, "OpenAI", "Sends requests for code suggestions")
Rel_B(repo_to_text, "Summarized Code Storage", "Stores summarized code results")
```