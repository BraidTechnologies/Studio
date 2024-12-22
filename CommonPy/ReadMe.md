# Common Python Library
A Python library providing repository patterns and utilities for interacting with the Braid API, specifically focused on managing chunks and pages of data.

## Overview
This library implements repository patterns for two main data types:
 **Chunks**: Pieces of content with associated embeddings, summaries, and metadata
 **Pages**: HTML content with associated metadata

## Core Components

### Chunk Management
 `ChunkRepository`: Manages CRUD operations for chunks via the Braid API
 `IStoredChunk`: Data model for chunks, including:
 - Embeddings
 - Text renderings
 - Summaries
 - Related chunks
 - Metadata

### Page Management
 `PageRepository`: Handles storage and retrieval of pages
 `IStoredPage`: Data model for pages, primarily storing HTML content
 Utilities for compression and file handling

### Common Types
 `IStorable`: Base class for storable entities
 `IStorableQuerySpec`: Query parameters for data retrieval
 `IStorableOperationResult`: Operation result wrapper
 `DictToObject`: Utility for JSON-to-object conversion

## Key Features
- Robust error handling and logging
- Retry mechanisms for API calls
- Base64 compression for HTML content
- Type-safe data models
- Functional key-based querying

