```mermaid
graph LR
subgraph Salon
api_to_test_code[Automated Python test code generation]
repo_to_text[Codebase processing and analysis]
repo_to_c4.py[C4 architecture diagram generation]
end
subgraph LLMs
OpenAI
GPT-3
end
subgraph APIs
PagerepositoryApi[Concrete API]
end
api_to_test_code --> PagerepositoryApi
api_to_test_code --> OpenAI
repo_to_text --> OpenAI
repo_to_c4.py --> repo_to_text
repo_to_c4.py --> OpenAI
```