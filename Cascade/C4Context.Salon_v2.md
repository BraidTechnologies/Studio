```mermaid
graph LR

subgraph User
  User
  id User[]
end

subgraph Cascade Chrome Extension
  id Cascade Chrome Extension[]

  Content Script
  Popup Interface
end

subgraph External APIs
  id External APIs[]

  Text Summarization API
  Content Classification API
end

subgraph API
  id API[]

  Braid API
end

User --> Popup Interface
Popup Interface --> Content Script
Content Script --> External APIs
Popup Interface --> Braid API

note right of User: Inputs session key

note right of Popup Interface: Validates session key
note over Popup Interface, Content Script: Manages user authentication
note over Content Script, External APIs: Handles web scraping
note over Popup Interface, Braid API: Communicates with Braid API
```