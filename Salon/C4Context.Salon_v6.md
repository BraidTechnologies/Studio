```mermaid
sequenceDiagram
participant User
participant Salon
User ->> Salon: Upload code snippet
Salon ->> OpenAI: Summarize code
OpenAI ->> Salon: Text summary
User -> Salon: Choose template
Salon -> OpenAI: Generate diagram
alt success
    OpenAI -> Salon: C4 diagram
    Salon -> User: Download diagram
else
    OpenAI -> Salon: Invalid input
    Salon -> User: Request failed
end
```