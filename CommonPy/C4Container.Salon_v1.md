```mermaid
sequenceDiagram
participant BraidAPI
participant ChunkRepository
participant IStoredChunk
participant PageRepository
participant IStoredPage
participant IStorable
participant IStorableQuerySpec
participant IStorableOperationResult
participant DictToObject
participant EmbedAPI
participant EmbeddingModelDriver
participant TextChunker
participant OpenAiChatModelDriver
participant OpenAIChatModelInit
participant OpenAiEmbed3EmbeddingModelInit
participant OpenAIEmbeddingModelDriver
participant PageRepositoryAPI
participant IStoredPage


BraidAPI <--> PageRepositoryAPI
BraidAPI <--> ChunkRepository
IStoredChunk <--> ChunkRepository
PageRepository <--> IStoredPage
IStorable <--> PageRepositoryAPI
IStorable <--> ChunkRepository
IStorableQuerySpec <--> ChunkRepository
IStorableQuerySpec <--> PageRepositoryAPI
IStorableOperationResult <--> ChunkRepository
IStorableOperationResult <--> PageRepositoryAPI
DictToObject <--> EmbedAPI
EmbedAPI <--> EmbeddingModelDriver
EmbeddingModelDriver <--> TextChunker
TextChunker <--> OpenAiChatModelDriver
OpenAiChatModelDriver <--> OpenAIChatModelInit
OpenAIEmbeddingModelDriver <--> OpenAiEmbed3EmbeddingModelInit
PageRepositoryAPI <--> IStoredPage
OpenAIEmbeddingModelDriver <--> EmbedAPI
```