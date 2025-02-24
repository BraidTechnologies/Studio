```mermaid
context User, Salon, Frontend, Backend, API, Environment

User --> Salon
Salon --> Frontend
Salon --> Backend
Frontend --> API
Backend --> API
API --> Environment
```