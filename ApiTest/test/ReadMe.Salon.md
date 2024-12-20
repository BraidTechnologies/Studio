**chunk_test.py**

This code is a test module for an API endpoint responsible for text chunking. It includes integration tests for the `/chunk` endpoint to ensure it correctly splits input text into smaller chunks with configurable size and overlap.

**Important classes or functions:**
- `chunk_request_data`: A pytest fixture that returns example request data for chunking.
- `test_chunk_endpoint(chunk_request_data)`: Sends a POST request to the `/chunk` endpoint and verifies the API response status code and content.

**Functionality:**
- Defines the base URL and appends the session key for authentication from environment variables.
- Validates valid chunking requests and ensures the API response contains the expected data structure.
- Uses pytest to manage fixtures and run tests, verifying that the server response contains desired keys and chunked text data.

**classify_test.py**

This module tests the `/classify` endpoint of an API.

It imports necessary modules such as `pytest`, `requests`, and `os`. It configures the base URL for the API and retrieves the session key from environment variables.

Two classes of data are defined: `classify_request_data` for valid classification requests and `response_data` for expected classification responses. The `classify_url` constructs the endpoint URL with the session key.

The `test_classification_request` function sends a valid classification request and checks for a successful response that includes the classifications.

The `test_invalid_classification_request` function uses `pytest.mark.parametrize` to test various invalid data scenarios and ensures the API returns a 400 status code for each case.

**embed_test.py**

The module is a test suite designed to verify the functionality of the `/embed` API endpoint, which generates vector embeddings from text input.

### Key Functions:

- **`test_embedding_request_structure`**: This test checks the successful generation of embeddings from a valid text input. It ensures the response is structured correctly and that the embedding produced is a list of numeric values.

- **`test_invalid_request_structure`**: This test verifies error handling when the request is malformed, specifically when a required `text` field is missing, expecting a 400 status code in response.

### Key Configurations:

- **`BASE_URL`** and **`SESSION_KEY`**: Configures the API base URL and Session Key, fetched from environment variables.
- **`embed_url`**: Constructs the full URL for the embedding endpoint including the session key.

The tests use `pytest` for execution and `requests` to simulate API calls.

**enumerate_models_test.py**

This module contains test cases for validating the `/enumerateModels` API endpoint, ensuring proper schema and functionality. 

The schemas to be validated include `IEnumerateModelsRequest` and `IEnumerateModelsResponse`. 

The module also tests various cases including valid objects, missing required fields, and extra disallowed fields.

Key functions and classes:
1. `validate_enumerate_models_schema(instance, schema_name)`: Validates JSON instances against schema definitions.
2. `test_ienumerate_models_request_valid()`: Tests a valid `IEnumerateModelsRequest` schema.
3. `test_ienumerate_models_response_valid()`: Tests a valid `IEnumerateModelsResponse` schema.
4. `test_ienumerate_models_response_missing_fields()`: Tests `IEnumerateModelsResponse` with missing fields.
5. `test_ienumerate_models_response_additional_fields()`: Tests `IEnumerateModelsResponse` with extra disallowed fields.
6. `test_enumerate_request()`: Validates the full API request/response for functionality. 

The module uses `pytest` for running the tests and `jsonschema` for schema validation.

**enumerate_repositories_test.py**

This module is designed to test the `EnumerateRepositories` API endpoint, which returns a list of repository IDs. 

The environment variable `SessionKey` is required for this test. The `BASE_URL` is set to `http://localhost:7071/api`, and the endpoint URL is constructed using the `SessionKey`.

It includes a schema for the expected API response which mandates that `repositoryIds` be an array.

The function `validate_response_vs_schema` checks if the API response adheres to the schema using `jsonschema`.

The `test_enumerate_repositories` function sends a POST request to the endpoint, checks for a 200 status code, and validates the response against the schema.

Important functions:
- `validate_response_vs_schema`
- `test_enumerate_repositories`

**find_theme_test.py**

This is a test module for the `/findtheme` API endpoint, which analyzes text to identify themes. The module includes test cases for verifying the request parameters and response formats for this endpoint.

The `BASE_URL` is set up for the API, and `SESSION_KEY` is retrieved from environment variables to construct the complete URL of the `/findtheme` endpoint.

A `pytest` fixture named `valid_request_data` provides a sample request payload containing text and its length.

There are three test functions:
1. `test_find_theme_with_valid_request`: Tests the endpoint with valid request data and asserts that the response status is 200 and contains the "theme" key.
2. `test_find_theme_with_missing_text`: Tests the endpoint with a request missing the 'text' field and expects a 400 status code.
3. `test_find_theme_with_missing_length`: Tests the endpoint with a request missing the 'length' field and expects a 400 status code. 

The `if __name__ == "__main__":` block allows the tests to be run directly with `pytest`.

**page_repository_test.py**

This module performs integration tests for `/getpage` API endpoint. 

It tests successful page retrieval with a valid `id` parameter, ensuring that the server returns a 200 status code. 

It also checks the server's response to missing parameters, expecting a 404 status code. 

The tests depend on a live API instance running on port 7071 and a valid `session key` stored in environment variables.

Important functions:
- `test_get_page_success`: Verifies the endpoint returns status 200 when provided with a valid `id`.
- `test_get_page_missing_param`: Tests the endpoint response (status 404) without the required `id` parameter.

**studio_test.py**

This module tests the Studio Boxer API endpoints using `pytest`, focusing on response validation, structure validation, and error handling for invalid requests. Dependencies include `pytest`, `requests`, and `jsonschema`.

`validate_response_vs_schema`: Ensures the response data matches the provided schema definition, failing the test if it doesn't. 

`test_IStudioBoxerResponseEnrichment_structure` and `test_IStudioBoxerResponse_structure`: Helper functions that check the structure and required fields of the response enrichments.

`test_studio_boxer`: Sends a valid request to the Studio Boxer API and validates the response schema and structure.

`test_invalid_studio_request`: Tests the API's error handling by sending an invalid request and checking for a 400 status code.

Main classes/functions:
- `validate_response_vs_schema`
- `test_IStudioBoxerResponseEnrichment_structure`
- `test_IStudioBoxerResponse_structure`
- `test_studio_boxer`
- `test_invalid_studio_request`

**summarise_test.py**

This module contains integration tests for a text summarization API endpoint.

The "BASE_URL" and "SESSION_KEY" are configured from environment variables for API access. Various test cases are implemented using the pytest framework and the requests library, including summarizing standard text, survey responses (using a specialized persona), and code.

Tests cover proper handling of edge cases and errors, such as missing length or text parameters, empty requests, and validating the response status codes and content.

Key functions:
- `summarise_endpoint_url`: Constructs the URL for the summarization API.
- `get_current_source`: Retrieves the current script's source code for code summarization tests.
- `test_valid_summarise_request`: Tests standard summarization.
- `test_valid_summarise_survey_request`: Tests summarization using survey data.
- `test_valid_summarise_code_request`: Tests summarization using code.
- `test_summarise_request_without_length`: Tests behavior when length is not provided.
- `test_summarise_request_missing_text`: Tests behavior when text is not provided.
- `test_empty_summarise_request`: Tests behavior with an empty request.

Dependencies include pytest, requests, pathlib, and os.

