```mermaid
graph LR
classDef black dashed IStorable
classDef blue dotted IStorableQuerySpec
classDef green dotted IStorableOperationResult

classDef red chunk_repository_api.py
chunk_repository_api.py"ChunkRepository" -- "IStoredChunk"
chunk_repository_api.py"DictToObject" -- "IStoredChunk"
chunk_repository_api.py"DictToObject" -- "IStoredTextRendering"
chunk_repository_api.py"DictToObject" -- "IStoredEmbedding"


classDef red chunk_repository_api_types.py
chunk_repository_api_types.py"IStoredEmbedding" --> "IStoredChunk"
chunk_repository_api_types.py"IStoredTextRendering" --> "IStoredChunk"

subgraph chunk_repository_api.py
class IStorable
class IStoredChunk
class IStoredTextRendering
class IStoredEmbedding
end

classDef blue comparable_enum.py
comparable_enum.py"EnumComparable" --> "IStorable"
comparable_enum.py"EnumComparable" --> "IStoredQuerySpec"

subgraph comparable_enum.py
class EnumComparable
end

classDef orange cosine_similarity.py
cosine_similarity.py"cosine_similarity" -- "IStoredEmbedding"

subgraph cosine_similarity.py
class cosine_similarity
end

classDef yellow embed_api.py
embed_api.py"EmbeddingApi" --> "IEmbedRequest"
embed_api.py"EmbeddingApi" --> "IEmbedResponse"

subgraph embed_api.py
class EmbeddingApi
class IEmbedRequest
class IEmbedResponse
end

classDef yellow embed_api_types.py
embed_api_types.py"IEmbedResponse" --> "IStoredEmbedding"
embed_api_types.py"IEmbedRequest" --> "IStoredEmbedding"

subgraph embed_api_types.py
class IEmbedRequest
class IEmbedResponse
end

classDef purple enriched_query_api.py
enriched_query_api.py"EnrichedQueryApi" --> "IEnrichedChunkSummary"
enriched_query_api.py"EnrichedQueryApi" --> "IModelConversationElement"
enriched_query_api.py"EnrichedQueryApi" --> "IEnrichedChunk"
enriched_query_api.py"EnrichedQueryApi" --> "IChunkQuerySpec"
enriched_query_api.py"EnrichedQueryApi" --> "IRelevantEnrichedChunk"
enriched_query_api.py"EnrichedQueryApi" --> "IEnrichedQueryRequest"
enriched_query_api.py"EnrichedQueryApi" --> "IGenerateQuestionRequest"
enriched_query_api.py"EnrichedQueryApi" --> "IEnrichedResponse"

subgraph enriched_query_api.py
class EnrichedQueryApi
class IEnrichedChunkSummary
class IModelConversationElement
class IEnrichedChunk
class IChunkQuerySpec
class IRelevantEnrichedChunk
class IEnrichedQueryRequest
class IGenerateQuestionRequest
class IEnrichedResponse
end

classDef purple enriched_query_api_types.py
enriched_query_api_types.py"IEnrichedChunk" --> "IEnrichedChunkSummary"
enriched_query_api_types.py"IRelevantEnrichedChunk" --> "IEnrichedChunk"

subgraph enriched_query_api_types.py
class IEnrichedChunkSummary
class IModelConversationElement
class IEnrichedChunk
class IChunkQuerySpec
class IRelevantEnrichedChunk
class IEnrichedQueryRequest
class IGenerateQuestionRequest
class IEnrichedResponse
end

classDef blue model_driver_base.py
model_driver_base.py"ModelProvider"
model_driver_base.py"Model"
model_driver_base.py"MessageRole"
model_driver_base.py"Message"
model_driver_base.py"ChatPrompt"
model_driver_base.py"ChatModelDriver"
model_driver_base.py"EmbeddingModelDriver"
model_driver_base.py"TextChunker"

subgraph model_driver_base.py
class ModelProvider
class Model
class MessageRole
class Message
class ChatPrompt
class ChatModelDriver
class EmbeddingModelDriver
class TextChunker
end

classDef green model_driver_factories.py
model_driver_factories.py"get_default_chat_model_driver" --> "ChatModelDriver"
model_driver_factories.py"get_default_embedding_model_driver" --> "EmbeddingModelDriver"
model_driver_factories.py"get_default_text_chunker" --> "TextChunker"

subgraph model_driver_factories.py
class ChatModelDriver
class EmbeddingModelDriver
class TextChunker
end

classDef orange openai_chat_model_driver.py
openai_chat_model_driver.py"OpenAiChatModelInit" --> "OpenAiChatModelDriver"

subgraph openai_chat_model_driver.py
class OpenAiChatModelInit
class OpenAiChatModelDriver
end

classDef orange openai_chunker.py
openai_chunker.py"Tokenizer" --> "OpenAITextChunker"

subgraph openai_chunker.py
class Tokenizer
class OpenAITextChunker
end

classDef orange openai_embedding_model_driver.py
openai_embedding_model_driver.py"OpenAiEmbeddingModelInit" --> "OpenAIEmbeddingModelDriver"

subgraph openai_embedding_model_driver.py
class OpenAiEmbeddingModelInit
class OpenAIEmbeddingModelDriver
end

classDef purple page_repository_api.py
page_repository_api.py"PageRepository" -- "IStoredPage"

subgraph page_repository_api.py
class PageRepository
class IStoredPage
end

classDef purple page_repository_api_types.py
page_repository_api_types.py"IStoredPage" --> "IStorable"

subgraph page_repository_api_types.py
class IStoredPage
end

classDef blue storable_types.py
storable_types.py"IStorable" --> "IStorableQuerySpec"
storable_types.py"IStorable" --> "IStorableOperationResult"

subgraph storable_types.py
class IStorable
class IStorableQuerySpec
class IStorableOperationResult
end

classDef orange type_utilities.py
type_utilities.py"DictToObject" --> "IStoredChunk"
type_utilities.py"DictToObject" --> "IStoredTextRendering"
type_utilities.py"DictToObject" --> "IStoredEmbedding"

subgraph type_utilities.py
class DictToObject
end
```