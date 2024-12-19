**chunk_test.py**

This module tests the text chunking API endpoint at `/chunk`, ensuring it functions correctly under different scenarios such as valid and invalid requests, and edge cases.

The `BASE_URL` for the API is configured, and the test requires a `SessionKey` for access. The full endpoint URL is constructed with the session key.

The `chunk_request_data` fixture provides example input data, including text to be chunked, chunk size, and the number of overlapping words.

The `test_chunk_endpoint` function sends a POST request to the endpoint with the chunk request data, verifies the response status code is 200, and checks the response data for expected keys and structure.

Important functions: `test_chunk_endpoint`, `chunk_request_data`.

**classify_test.py**

This module tests the `/classify` API endpoint. It includes two primary test functions:
- `test_classification_request` verifies successful classification responses given valid data.
- `test_invalid_classification_request` checks error handling for various invalid data scenarios through parameterized tests.

Tests assume a valid session key from the environment and a running API server at `BASE_URL`.

`classify_request_data` and `response_data` are sample payloads and expected outcomes. The `classify_url` constructs the API endpoint URL with a session key. Key external dependencies include `pytest` for testing, `requests` for HTTP requests, and `os` to access environment variables.

**embed_test.py**

This code defines a test module for verifying the functionality of the `/embed` API endpoint which generates vector embeddings from text input. 

### Key Classes/Functions
- `test_embedding_request_structure`: Sends a valid request to the `/embed` endpoint, verifies a successful response (status code 200), checks the structure of the response, ensures the 'embedding' field is a list, and all elements in the list are numeric.
  
- `test_invalid_request_structure`: Sends an invalid request missing the required 'text' field, verifies the API returns a status code 400 for a bad request.

### Setup
- BASE_URL and SESSION_KEY are configured using environment variables.
- `embed_url` is constructed by appending the session key to the BASE_URL.

### Additional Details
- Tests utilize the `requests` library for sending HTTP POST requests.
- Uses pytest framework for running the tests.


**enumerate_models_test.py**

The provided module tests the `enumerate_models` API endpoint. It includes validating the schemas of `IEnumerateModelsRequest` and `IEnumerateModelsResponse`.

- **Schemas**: Defines valid structures for `IEnumerateModelsRequest` (an empty object) and `IEnumerateModelsResponse` which contains fields like `defaultId`, `largeId`, etc.
- **Functions**:
  - `validate_enumerate_models_schema(instance, schema_name)`: Utility to validate a JSON instance against a schema.
  - `test_ienumerate_models_request_valid()`: Tests if an empty request object is valid.
  - `test_ienumerate_models_response_valid()`: Validates a correctly structured response object.
  - `test_ienumerate_models_response_missing_fields()`: Checks for validation errors in responses missing required fields.
  - `test_ienumerate_models_response_additional_fields()`: Ensures additional fields not in the schema cause validation errors.
  - `test_enumerate_request()`: Sends a request to the API and validates the returned response.

Configuration of the API URL and session key are retrieved, and the JSON schema is defined inline. 



**enumerate_repositories_test.py**

This code is a test module for the `EnumerateRepositories` API endpoint. 

The module tests the functionality of the API endpoint, which returns a list of available repository IDs, and includes schema validation and basic HTTP response testing.

The module requires the `SessionKey` environment variable to be set. 

The `BASE_URL` and the `enumerate_repositories_url` are defined to configure the API endpoints. 

A schema for the API request and response is defined in `ENUMERATE_REPOSITORIES_API_SCHEMA`.

The `validate_response_vs_schema` function validates a given response against the defined schema. 

The `test_enumerate_repositories` function sends a POST request to the API endpoint, validates the status code, and checks the response against the schema. 

The script is intended to be run using `pytest`.

**find_theme_test.py**

This module tests the `/findtheme` API endpoint, ensuring accurate theme identification and validation of requests. 

- **`BASE_URL`** and **`find_theme_url`** configure the API endpoint URL. The `SessionKey` is fetched from environment variables.
  
- The **`valid_request_data`** fixture provides dummy input text and length for test requests.

- **`test_find_theme_with_valid_request`**: Sends a valid POST request to `/findtheme` and verifies a 200 status code and presence of the "theme" in the response.

- **`test_find_theme_with_missing_text`**: Checks for a 400 status code when the ‘text’ field is missing.

- **`test_find_theme_with_missing_length`**: Checks for a 400 status code when the ‘length’ field is missing.

Important classes and functions include pytest, `requests.post`, and `request_timeout`.

**page_repository_test.py**

The code is written in Python and utilizes the pytest framework for testing.

It configures the base URL for an API, with `BASE_URL` pointing to a local server and `SESSION_KEY` fetched from an environment variable.

The `get_page_url` variable constructs the URL for a specific API endpoint with the session key appended.

The `test_get_page_success` function tests a successful API request to `/getpage` with a valid `id` parameter, expecting a 200 status code in response.

The `test_get_page_missing_param` function tests an API request without the required `id` parameter, expecting a 404 status code.

Important functions: `test_get_page_success`, `test_get_page_missing_param`.

**studio_test.py**

This module provides test cases and helper functions to validate the behavior of the Studio Boxer API. It includes response schema validation, structural validation of enrichment data models, and error handling for invalid requests. 

### Key Classes/Functions:
1. **validate_response_vs_schema**: Checks if the API response matches the predefined schema using `jsonschema`.
2. **test_IStudioBoxerResponseEnrichment_structure**: Ensures the enrichment data structure contains required fields and correct data types.
3. **test_IStudioBoxerResponse_structure**: Validates the general response structure of the API.
4. **test_studio_boxer**: Validates a proper API response against the schema definition.
5. **test_invalid_studio_request**: Tests the API’s error handling for invalid requests.

The module uses `pytest` for testing, `requests` for making HTTP requests, and `jsonschema` for schema validation. The base URL and session key for the API are configured through environment variables.

**summarise_test.py**

This module tests various scenarios for a text summarization API endpoint.

Functions included:
- `summarise_endpoint_url()`: Constructs the endpoint URL for the API.
- `get_current_source()`: Reads the current source code.

Test functions:
- `test_valid_summarise_request()`: Sends a valid summarization request and checks if the response contains a summary.
- `test_valid_summarise_survey_request()`: Tests summarization with a specific survey summarizer persona.
- `test_valid_summarise_code_request()`: Tests summarization for code with a specific code summarizer persona.
- `test_summarise_request_without_length()`: Tests a request without specifying the length of the summary.
- `test_summarise_request_missing_text()`: Validates error handling when text is missing.
- `test_empty_summarise_request()`: Tests error handling on empty payloads.

Uses `requests` for sending HTTP requests and `pytest` for test execution.

