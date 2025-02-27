```mermaid
C4Context
title Common Python Library for Braid API Interaction

System_Boundary(api, "Braid API") {
  Rel(client, api, "Interacts with", "API calls")
}

System_Boundary(library, "Python Library") {
  System(client, "Client Application")

  System_Boundary(chunk_management, "Chunk Management") {
    Component(chunk_repo, "ChunkRepository", "Python", "Manages CRUD operations for chunks", "chunk_repository_api.py")
    Component(chunk_model, "IStoredChunk", "Python", "Data model for chunks", "chunk_repository_api_types.py")
  }

  System_Boundary(page_management, "Page Management") {
    Component(page_repo, "PageRepository", "Python", "Handles storage and retrieval of pages", "page_repository_api.py")
    Component(page_model, "IStoredPage", "Python", "Data model for pages", "page_repository_api_types.py")
  }

  System_Boundary(common_types, "Common Types") {
    Component(storable, "IStorable", "Python", "Base class for storable entities", "storable_types.py")
    Component(query_spec, "IStorableQuerySpec", "Python", "Query parameters for data retrieval", "storable_types.py")
    Component(op_result, "IStorableOperationResult", "Python", "Operation result wrapper", "storable_types.py")
    Component(dict_to_obj, "DictToObject", "Python", "JSON-to-object conversion", "type_utilities.py")
  }

  Rel(chunk_repo, api, "Interacts with", "API calls")
  Rel(page_repo, api, "Interacts with", "API calls")
  Rel(chunk_model, storable, "Inherits from")
  Rel(page_model, storable, "Inherits from")
  Rel(chunk_repo, chunk_model, "Uses")
  Rel(page_repo, page_model, "Uses")
}
```
