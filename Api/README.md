API Documentation

**Overview**
This is an Azure Functions-based API layer that centralizes interactions with OpenAI and CosmosDB. The API provides various text processing capabilities including summarization, classification, chunking, and theme detection.

**Text Processing**
- Summarization: Supports different types of content summarization (articles, code, surveys)
- Classification: Categorizes text into predefined categories (Technology, Business, Politics, Health)
- Chunking: Splits large texts into manageable pieces while maintaining context
- Theme Detection: Identifies common themes across text passages
- Embedding: Generates text embeddings using Azure AI services

**Storage & Authentication**
CosmosDB Integration: Handles CRUD operations for various storable objects
Session Management: Validates session keys for secure API access
LinkedIn Authentication: Supports OAuth integration with LinkedIn

**Repository Layer**
The codebase includes several repository implementations:
ActivityRepository
ChunkRepository
PageRepository
Each repository supports standard CRUD operations with session validation.

**Testing Framework**
The project uses Mocha and Expect for testing, with comprehensive test suites for:
Session validation
Text processing functions
Storage operations
API endpoints

**Utility Functions**
Session validation
Error handling
HTTP response formatting
Token generation for Azure services

**Testing**
The codebase includes extensive test coverage for:
Valid/invalid session handling
Text processing accuracy
API response validation
Error handling scenarios

**Deployment**
Deploy to Azure: func azure functionapp publish Braid-Api
Local development: npm start

**Architecture Notes**
Uses Azure Functions for serverless architecture
Implements retry logic for API calls
Centralizes key management and logging
Supports both local and production environments
Implements the repository pattern for data access

For detailed information about specific modules, refer to the individual test files in the test directory and their corresponding implementation files in src/functions