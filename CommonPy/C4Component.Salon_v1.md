```mermaid
C4Component
    title Common Python Library

    Container_Boundary(library, "Common Python Library") {
        
        Container_Boundary(chunk_management, "Chunk Management") {
            Component(chunk_repo, "ChunkRepository", "Python Class", "Manages CRUD operations for chunks via the Braid API")
            Component(i_stored_chunk, "IStoredChunk", "Python Class", "Data model for chunks")
        }

        Container_Boundary(page_management, "Page Management") {
            Component(page_repo, "PageRepository", "Python Class", "Handles storage and retrieval of pages")
            Component(i_stored_page, "IStoredPage", "Python Class", "Data model for pages")
        }

        Container_Boundary(common_types, "Common Types") {
            Component(i_storable, "IStorable", "Python Class", "Base class for storable entities")
            Component(i_storable_query_spec, "IStorableQuerySpec", "Python Class", "Query parameters for data retrieval")
            Component(i_storable_operation_result, "IStorableOperationResult", "Python Class", "Operation result wrapper")
            Component(dict_to_object, "DictToObject", "Python Class", "Utility for JSON-to-object conversion")
        }

        Container_Boundary(utility, "Utilities") {
            Component(enum_comparable, "EnumComparable", "Python Class", "Rich comparison for Enums")
            Component(cosine_similarity, "cosine_similarity", "Python Function", "Utility function for vector similarity calculations")
            Component(embed_api, "EmbeddingApi", "Python Class", "Client for interacting with embedding API endpoints")
            Component(enriched_query_api, "EnrichedQueryApi", "Python Class", "API client for enriched query service")
            Component(model_driver_base, "ModelDriverBase", "Python Module", "Core abstractions for model drivers")
            Component(model_driver_factories, "ModelDriverFactories", "Python Module", "Factory for model drivers")
        }
    }

    Boundary(chunk_repository_api, "chunk_repository_api.py") {
        Component(chunk_repository_script, "ChunkRepository Script", "Python Script", "Interacts with the Chunk table in the Braid API's database")
    }

    Boundary(page_repository_api, "page_repository_api.py") {
        Component(page_repository_script, "PageRepository Script", "Python Script", "Interacts with the Page table in the Braid API's database")
    }

    chunk_repository_api --> chunk_repo
    page_repository_api --> page_repo
    page_repo --> i_stored_page
    chunk_repo --> i_stored_chunk
    chunk_repo --> i_storable_query_spec
    common_types --> i_storable_query_spec
    common_types --> i_storable_operation_result
    common_types --> dict_to_object
    chunk_management --> common_types
    page_management --> common_types
    utility --> common_types
```
