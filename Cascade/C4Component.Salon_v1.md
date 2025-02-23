```mermaid
graph LR
  subgraph Background Script
    Content Script
    Popup Interface
  end
  subgraph External APIs
    Braid API
    Text Summarization API
    Classification API
  end
  Content Script --> Cascade: Fetch/Process Content
  Cascade: Scrape Results --> Popup Interface
  Popup Interface --> Braid API: Validate Session Key
  Braid API --> Popup Interface: Validation Result
  Popup Interface --> External APIs: Process Content
  External APIs --> Content Script: Results
```