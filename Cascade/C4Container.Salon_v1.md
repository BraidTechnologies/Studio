```mermaid
sequenceDiagram
participant extension
participant API
participant scraper
participant popup
extension->popup: Input session key
popup->API: Validate session
API->popup: Validation confirmation
popup->scraper: Start scraping
scraper->API: Summarize text
API->scraper: Summary
scraper->popup: Display result
```