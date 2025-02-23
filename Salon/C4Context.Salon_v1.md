```mermaid
  context Salon

  Repo
  APIAutoTest
  NotebookLM
  ReadMeSummarization
  DirectoryWalker
  C4Diagrams

  APIAutoTest --> Repo
  APIAutoTest --> NotebookLM
  ReadMeSummarization --> Repo
  DirectoryWalker --> Repo
  C4Diagrams --> Repo
  DirectoryWalker --> ReadMeSummarization
  DirectoryWalker --> C4Diagrams
  DirectoryWalker --> APIAutoTest
  DirectoryWalker --> NotebookLM
  User --> Repo
  User --> APIAutoTest
  User --> NotebookLM
  User --> ReadMeSummarization
  User --> DirectoryWalker
  User --> C4Diagrams
```