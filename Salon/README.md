# Salon

Salon is a technology demonstrator for automated software development tools using Large Language Models (LLMs). It provides a suite of tools to assist in API testing and code analysis.
## Key Components

### api_to_test_code
- tool that automatically generates Python test code from API specifications.
- **Features:**
- Supports both JSON and YAML API specification formats
- Generates comprehensive Python test code
- Used in **ApiTest** to achieve high test coverage with minimal input effort
- Provides context-aware prompts to OpenAI for accurate test generation
- Includes error handling and logging
- Automated file output generation

### repo_to_text
- utility for processing and analyzing codebases.
- **Features:**
- Processes entire directories of source code
- Concatenates source files into consolidated text files
- Enables LLM-based code analysis and question answering
 Adapted from [NotebookLM solution for interactive code exploration](https://jmlbeaujour.medium.com/introducing-notebooklm-as-a-solution-for-interactive-code-exploration-704a44e690a6)

### repo_to_c4.py
- A tool that generates C4 architecture diagrams from GitHub repositories.
- **Features:**
- Traverses and analyzes repository structure
- Generates comprehensive C4 architectural diagrams
- Includes API integration for code summarization
- Provides file version management
- Handles command-line configuration
- Processes directories recursively
- Automated diagram generation


Example use:
```
py src\repo_to_text.py --cfg config.yaml --repo_path . -o test_output
```

