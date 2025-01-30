**As a user, I want to process open-source documents from the web (YouTube videos, and plain HTML text) so that I can access AI-related material from both source types**.

### Scenario: YouTube Content Found
**Given** I ask a question that matches YouTube content  
**When** there is at least one relevant YouTube document available  
**Then** I receive an answer  
**And** at least one link to the relevant YouTube content is provided

### Scenario: HTML Content Found
**Given** I ask a question that matches HTML content  
**When** there is at least one relevant HTML document available  
**Then** I receive an answer  
**And** at least one link to the relevant HTML content is provided