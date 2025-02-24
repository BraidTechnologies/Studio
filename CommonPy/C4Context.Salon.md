```mermaid
graph TD
    User
    subgraph "Common Python Library"
        subgraph "Chunk Management"
            direction TB
            subgraph "Core Components"
                ChunkRepository:::class
                IStoredChunk:::class
                IStoredEmbedding:::class
                IStoredTextRendering:::class
                ChunkUtilities[Utilities for compression and file handling]
            end
            EnrichedQueryApiClient[Enriched Query API Client]
            EmbeddingApiClient[Embedding API Client]
        end

        subgraph "Page Management"
            direction TB
            subgraph "Core Components"
                PageRepository:::class
                IStoredPage:::class
                PageUtilities[Utilities for compression and file handling]
            end
            ChunkRepository
        end

        subgraph "Common Types"
            direction TB
            IStorable:::class
            IStorableQuerySpec:::class
            IStorableOperationResult:::class
            DictToObject[DictToObject: Utility for JSON-to-object conversion]
        end
    end

    ChunkRepository --> IStoredChunk
    IStoredChunk -->|inherits| IStorable
    IStoredPage -->|inherits| IStorable
    ChunkRepository --> EmbeddingApiClient
    ChunkRepository --> EnrichedQueryApiClient
    PageRepository --> ChunkRepository

    classDef class fill:#f9f,stroke:#333,stroke-width:4px;
```
