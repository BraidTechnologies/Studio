```mermaid
graph LR
subgraph Backend
    subgraph Web Services
        subgraph Common TypeScript Components
            Common TypeScript Components[[
                API Classes
                Data Models & Types
                Utilities
                Environment Management
            ]]
    end
    subgraph Fluid
        Fluid[[
            fluid
            FluidAPI
            fluidAPITypes
        ]]
    end
    subgraph AI Models
        AI Models[[
            IModel
            IModelDriver
            IModelFactory
            IPromptPersona
            IPromptPersonaFactory
            ModelDrivers
        ]]
    end
end
subgraph Frontend
    Frontend[[
        Login API
        Session API
        Summarise API
    ]]
end
```