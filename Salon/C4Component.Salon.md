```mermaid
sequenceDiagram
participant user
participant api_to_test_code
participant repo_to_text
participant repo_to_c4

participant OpenAI as openai

user-&gt;api_to_test_code: Generate python test code from API specification
activate api_to_test_code
api_to_test_code-&gt;openai: Generate python test code from API specification
deactivate api_to_test_code

user-&gt;repo_to_text: Process and analyze codebase
activate repo_to_text
repo_to_text-&gt;repo_to_text: Process and analyze codebase
deactivate repo_to_text

user-&gt;repo_to_c4: Generate C4 arch diagrams from Github repo
activate repo_to_c4
repo_to_c4-&gt;repo_to_c4: Generate C4 arch diagrams from Github repo
deactivate repo_to_c4
```