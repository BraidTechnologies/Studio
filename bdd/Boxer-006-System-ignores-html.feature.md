**As a user, when I look at summarised web pages, I want the system to have ignored irrelevant text such as web page navigation and javascript.**

### Scenario: Basic HTML Formatting Removal
**Given** a web page with HTML formatting and content about AI  
**When** the system processes and summarizes the page  
**Then** the summary contains the meaningful content  
**And** HTML tags and formatting are excluded from the summary

### Scenario: Different HTML Formatting Same Content
**Given** a versions of the same AI article with different HTML formatting  
**When** the system processes and summarizes the page    
**Then** both versions produce identical summaries  
**And** the formatting differences are ignored

### Scenario: Different HTML Formatting Different Content
**Given** a versions of the same AI article with different HTML formatting and different content 
**When** the system processes and summarizes the page    
**Then** the system produces a different summary 
**And** the new summary differs from the original


