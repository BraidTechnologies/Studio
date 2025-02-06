**ApiTest** is generated source code to test Apis. The **Salon** application was used to generate the source. 

# API Test Suite Documentation

## Overview
This test suite validates various endpoints of a text processing API that handles operations like chunking, classification, embedding, and summarization. The API appears to be running locally on port 7071 and requires session-based authentication.

## Setup Requirements
- Python with pytest and requests libraries
- Environment Variables:
  - `SESSION_KEY`: Required for authentication
  - `BASE_URL`: Typically set to `http://localhost:7071/api`

## Endpoint Test Coverage

### Text Processing Endpoints
1. **Chunk (`/chunk`)**
   - Validates text splitting with configurable size and overlap
   - Tests request structure and response validation

2. **Classify (`/classify`)**
   - Tests text classification functionality
   - Includes validation for both valid and invalid request scenarios

3. **Embed (`/embed`)**
   - Validates vector embedding generation from text input
   - Tests response structure and error handling

4. **Find Theme (`/findtheme`)**
   - Tests theme identification in text
   - Validates required parameters (text and length)

5. **Summarize (`/summarise`)**
   - Tests text summarization capabilities
   - Supports different modes:
     - Standard text summarization
     - Survey response summarization
     - Code summarization
   - Includes edge case handling

### System Endpoints
1. **Enumerate Models (`/enumerateModels`)**
   - Tests model listing functionality
   - Includes schema validation for requests and responses

2. **Enumerate Repositories (`/enumerateRepositories`)**
   - Validates repository ID listing
   - Includes response schema validation

3. **Page Repository (`/getpage`)**
   - Tests page retrieval functionality
   - Validates successful retrieval and error cases

4. **Studio Boxer**
   - Tests Studio Boxer-specific endpoints
   - Includes response structure validation and error handling

## Test Structure
Each endpoint has its own dedicated test file following these common patterns:
- Request validation
- Response structure verification
- Error case handling
- Schema validation where applicable

## Running Tests
Tests can be run using pytest
