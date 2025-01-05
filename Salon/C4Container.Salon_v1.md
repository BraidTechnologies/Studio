```mermaid
C4Container
    title Salon System

    Person(developer, "Developer", "Uses Salon to assist in API testing and code analysis")

    System_Boundary(Salon_Boundary, "Salon") {
        Container(api_to_test_code, "API to Test Code", "Python Script", "Generates Python test code from API specifications.")
        Container(repo_to_text, "Repo to Text", "Python Script", "Processes and analyzes codebases.")

        Container(api_to_test_code_script, "api_to_test_code.py", "Python script", "Generates Pytest code from API data provided in JSON or YAML format.")
        Container(repo_to_text_script, "repo_to_text.py", "Python script", "Processes codebases into text files for LLM-based analysis.")

        System(api_to_test_code_openai, "OpenAI", "External Service", "Provides context-aware prompts for accurate test generation.")
        System(repo_to_text_notebooklm, "NotebookLM", "External Service", "Interactive code exploration.")

        api_to_test_code <-> api_to_test_code_openai : "Uses context-aware prompts"
        repo_to_text <-> repo_to_text_notebooklm : "Inspired by functionality"
    }

    developer -> Salon_Boundary : "Uses"

    api_to_test_code -> api_to_test_code_script : "Executes"
    repo_to_text -> repo_to_text_script : "Executes"
```