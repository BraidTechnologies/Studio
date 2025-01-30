**As a user, I want to use a system that adapts to rapidly evolving AI fields by processing and summarizing current content, so that I can stay up-to-date with developments in the field**.

### Scenario: Process New HTML Content
**Given** a new AI-related article is published online  
**When** the system processes the HTML content  
**Then** the article is summarized and added to the searchable content  
**And** the content becomes available for user queries

### Scenario: Process New YouTube Content
**Given** a new AI-related video is uploaded to YouTube  
**When** the system processes the video content  
**Then** the video is transcribed and summarized  
**And** the content becomes available for user queries

### Scenario: Handle Multiple Content Types Simultaneously
**Given** multiple new AI resources become available  
**When** the system processes a mix of HTML and YouTube content  
**Then** all content is properly processed according to its type  
**And** all new information is integrated into the searchable database

### Scenario: Update Existing Content
**Given** an existing article or video in the system has been updated  
**When** the system detects the change  
**Then** the content is reprocessed and updated  
**And** users receive the most current information in their search results