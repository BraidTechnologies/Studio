```mermaid
flowchart TD
    subgraph Chrome Extension
        subgraph ContentScript[Content Script (content.ts)]
            direction TB
            C1[Handles web scraping operations]
            C2[Manages text extraction with fallback mechanisms]
            C3[Enforces text length limits (100KB max)]
            C4[Provides visual feedback during operations]
            C5[Sends messages to external APIs for processing]
        end
        
        subgraph PopupInterface[Popup Interface (popup.js)]
            direction TB
            P1[Manages user authentication via session keys]
            P2[Validates session GUIDs (36-character format)]
            P3[Debounced input handling]
            P4[Displays processing results and feedback]
            P5[Sends messages to Braid API for validation]
        end
    end

    subgraph API_Integration
        BraidAPI[Braid API\n(braid-api.azurewebsites.net)]
        ExternalAPIs[External APIs\n(Text summarization and classification)]
    end

    PopupInterface -- Validates session keys --> BraidAPI
    PopupInterface -- Sends messages to --> ContentScript
    ContentScript -- Sends processing requests to --> ExternalAPIs

    subgraph ErrorHandling[Error Handling]
        EH1[Suppress unhandled promise rejections]
        EH2[Input validation]
        EH3[API call error handling]
        EH4[Fallback mechanisms for scraping]
        EH5[Rate limiting protection]
    end

    PopupInterface -.->|Uncaught Promise| ErrorHandling
    ContentScript -.->|Input Error| ErrorHandling
    ContentScript -.->|API Error| ErrorHandling

    subgraph MessageFlow[Message Flow]
        MF1[User inputs session key in popup]
        MF2[Session key validated by Braid API]
        MF3[Popup sends valid key to content scripts]
        MF4[Content script performs scraping and processing]
        MF5[Results are displayed in popup interface]
    end

    PopupInterface -- Input received --> MF1
    BraidAPI -- Returns validation --> MF2
    PopupInterface -- Validates key --> MF2
    ContentScript -- Starts scraping --> MF3
    ContentScript -- Returns processing results --> MF5
    PopupInterface -- Displays results --> MF5
```
