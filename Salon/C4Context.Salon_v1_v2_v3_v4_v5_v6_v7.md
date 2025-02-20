```mermaid
%%{init: {'theme': 'neutral' }}%%
    C4Context
    title Salon - System Context Diagram
    
    Person(user, "User", "Interacts with the system")
    
    System_Boundary(salon, "Salon - Context") {
        Container(api_to_test_code, "api_to_test_code", "Python Tool", "Automatically generates Python test code from API specifications.")
        Container(repo_to_text, "repo_to_text", "Python Utility", "Processes and analyzes codebases.")
        Container(repo_to_c4, "repo_to_c4", "Python Tool", "Generates C4 architecture diagrams from GitHub repositories.")
    }
    
    user --> api_to_test_code: Uses for API test generation
    user --> repo_to_text: Uses for codebase analysis
    user --> repo_to_c4: Uses for diagram generation
```
