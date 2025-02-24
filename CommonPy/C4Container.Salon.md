```mermaid
---
title: Common Python Library - C4 Container Diagram
---

flowchart BT
    %% Container Boundaries
    subgraph MainModules [Main Modules]
        direction TB
    
        subgraph ChunkManagement [Chunk Management]
            direction LR
            cr1(ChunkRepository)
            iStoredChunk(IStoredChunk):::dataModel
            cr1 --> iStoredChunk
        end
    
        subgraph PageManagement [Page Management]
            direction LR
            pr1(PageRepository)
            iStoredPage(IStoredPage):::dataModel
            pr1 --> iStoredPage
        end
    
        subgraph CommonTypes [Common Types]
            direction LR
            iStorable(IStorable):::baseModel
            iStorableQuerySpec(IStorableQuerySpec):::baseModel
            iStorableOperationResult(IStorableOperationResult):::baseModel
            dictToObject(DictToObject)
            
            subgraph Utilities [ ]
                direction TB
                compressUtils --> dictToObject
            end
        end
    end
   
    %% External Boundaries
    subgraph ExternalAPI [ ] 
        braidAPI(Braid API)
        ExternalAPI --> braidAPI
    end

    %% Relationships
    cr1 -->|Uses| braidAPI
    pr1 -->|Uses| braidAPI
    cr1 --> iStorable
    pr1 --> iStorable
    
    classDef dataModel fill:#e8f1f2,stroke:#6b8e23,stroke-width:2px;
    classDef baseModel fill:#f0e6e6,stroke:#987654,stroke-width:2px;
```
