**As a user, I want to ask questions to an LLM, and get both an answer and a link to relevant content, so that I can learn about AI.**

## Scenarios

### Scenario: No Relevant Documents Found
**Given** I ask a question to the LLM that is not about AI
**When** there are no relevant documents available  
**Then** I receive an answer from the LLM that is not about AI 
**And** no links to relevant content are provided

### Scenario: Multiple Relevant Documents Found
**Given** I ask a question to the LLM that is about AI
**When** there are multiple relevant documents available  
**Then** I receive an answer from the LLM that is about AI
**And** at least one link to relevant content is provided

### Scenario: Multiple Relevant Documents Found
**Given** I ask a small variation of the question to the LLM that is about AI
**When** there are multiple relevant documents available  
**Then** I receive an answer from the LLM that is about AI
**And** at least one link to relevant content is provided

### Scenario: No Relevant Documents Found
**Given** I ask a small variation of the question to the LLM that is about AI, but the variation makes the question not about AI
**When** there are multiple relevant documents available  
**Then** I receive an answer from the LLM that is not about AI
**And** no links to relevant content are provided