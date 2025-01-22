**As a user, I want to ask questions to an LLM, and get both an answer and a link to relevant content, so that I can learn about AI.**

## Scenarios

### Scenario: No Relevant Documents Found
**Given** I ask a question to the LLM  
**When** there are no relevant documents available  
**Then** I receive an answer from the LLM  
**And** no links to relevant content are provided

### Scenario: One Relevant Document Found
**Given** I ask a question to the LLM  
**When** there is one relevant document available  
**Then** I receive an answer from the LLM  
**And** a link to the relevant content is provided

### Scenario: Multiple Relevant Documents Found
**Given** I ask a question to the LLM  
**When** there are multiple relevant documents available  
**Then** I receive an answer from the LLM  
**And** links to all relevant content are provided