```mermaid
graph LR
    subgraph Salon Container
        api_to_test_code
        repo_to_text
        repo_to_c4.py
    end

    subgraph External Services
        OpenAI
    end

    api_to_test_code --> repo_to_text
    repo_to_text --> OpenAI
    OpenAI --> api_to_test_code
    repo_to_c4.py --> OpenAI
    OpenAI --> repo_to_c4.py
```