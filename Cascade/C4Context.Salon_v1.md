```mermaid
flowchart TB
    subgraph Cascade_Chrome_Extension
        direction TB
        User(User)
        BraidAPI(Braid API)
        ExternalAPI(External APIs)
        
        subgraph ContentScript["Content Script (content.ts)"]
            direction TB
            Scraping(Scraping operations with Artoo.js)
            TextExtraction(Text Extraction with fallbacks)
            VisualFeedback(Real-time visual feedback)
        end

        subgraph PopupInterface["Popup Interface (popup.js)"]
            direction TB
            Auth(Session-based Authentication)
            InputHandling(Debounced input handling)
            Validation(Session GUID Validation)
            Display(Displays processing results and feedback)
        end
    end

    User -->|Enters session key| PopupInterface
    PopupInterface -->|Validates session key| BraidAPI
    BraidAPI -->|Validation response| PopupInterface
    PopupInterface -->|Sends messages| ContentScript
    ContentScript -->|Displays results| PopupInterface
    ContentScript -->|Communicates for data processing| ExternalAPI

    note over User: Interacts with extension via popup
    note over ContentScript: Handles web scraping and data classification
    note over PopupInterface: Manages UI and user authentication
    note over BraidAPI: Validates session keys
    note over ExternalAPI: Processes text summarization and classification
```