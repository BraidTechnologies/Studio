# Common TypeScript Components
This directory contains shared TypeScript components used across both frontend (Browser, Mocha test) and backend (API) components. It also defines the API contracts between client and server, which are used by the 'Salon' component for test code generation.

## Key Components

### API Classes
 **Api**: Base class for all API interactions, handling environment and session management
 **ActivityRepositoryApi**: Manages activity records (save, remove, load, find, recent)
 **ChunkRepositoryApi**: Handles text chunk operations
 **FindEnrichedChunkApi**: Finds and manages enriched text chunks
 **QueryModelApi**: Interfaces with AI models for queries and question generation
 **SessionApi**: Manages user sessions
 **StorableRepositoryApi**: Base repository operations for storable objects

### Data Models & Types
 **IStorable**: Base interface for all storable objects
 **IModel**: Interface defining AI model capabilities
 **EnrichedChunk**: Enhanced chunk data structures with embeddings
 **IEnvironment**: Environment configuration interface

### Utilities
 **Asserts**: Validation utilities
 **Compress**: String compression/decompression utilities
 **Logging**: Standardized logging functions
 **Errors**: Custom error types

### Environment Management
 **DevelopmentEnvironment**
 **StagingEnvironment**
 **ProductionEnvironment**

## Usage
Import components as needed:
