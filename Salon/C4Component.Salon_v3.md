```mermaid
apiVersion: 0.1.0
graph LR
  subgraph Automation Tools
    repo_to_text
    api_to_test_code
    repo_to_c4.py
  end

  subgraph API
  end

  subgraph **API Testing**
    ApiTest
  end

  subgraph **Static Analysis**
  end

  repo_to_text -- processes --> PaginationRepositoryApi.Types_test.py
  repo_to_text -- processes --> api_to_test_code.py
  repo_to_text -- processes --> repo_to_c4.py
  repo_to_c4.py -- generates --> C4Diagram
```