**As a user, I want to get suggestions based on content I have interacted with, so that I can discover related information**

## Scenarios

### Scenario: Generate follow-up suggestions from a simple summary of how LLMs work
**Given** I have a simple summary of an article about how LLMs work  
**When** I send the summary to the suggestion API  
**Then** I receive a suggested follow-up question related to LLMs

### Scenario: Generate follow-up suggestions from a slightly varied summary of how LLMs work
**Given** I have a slightly varied summary of an article about how LLMs work  
**When** I send the summary to the suggestion API  
**Then** I receive the same suggested follow-up question related to LLMs

### Scenario: Generate follow-up suggestions from a significantly varied summary on a different topic
**Given** I have a significantly varied summary of an article on a different topic  
**When** I send the summary to the suggestion API  
**Then** I receive a different suggested follow-up question 