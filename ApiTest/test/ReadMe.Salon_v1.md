**chunk_test.py**

This Python code tests the `/chunk` API endpoint, which splits text into smaller chunks. It uses the `pytest` framework and sends a POST request to the endpoint with text, chunk size, and overlap specified in the JSON body. The test checks for a 200 OK status code and verifies that the response contains a 'chunks' key with a non-empty list of chunked text.  It uses an environment variable `BRAID_SESSION_KEY` for authentication.  The test runs against a local server at `http://localhost:7071/api`.


**classify_eval_test.py**

This code tests the `/classify` endpoint of a text classification API.  It uses `pytest` and sends POST requests to the endpoint with different sports-related text examples.  The tests check that the API correctly classifies "Shooting hoops" as basketball, even with slightly different phrasing. It also verifies that tennis-related text is classified as "tennis," demonstrating the API's ability to differentiate between sports.  The tests rely on the `BRAID_SESSION_KEY` environment variable for authentication.


**classify_test.py**

This code tests the `/classify` endpoint of a classification API.  It uses `pytest` to define test cases and `requests` to send HTTP requests. The `test_classification_request` function sends a valid classification request with sample text and possible classifications, checking for a successful response (200 status code) and expected content.  The `test_invalid_classification_request` function uses parametrization to test various invalid input scenarios, expecting a 400 error code. The tests rely on environment variables for the session key and assume the API is running locally.


**embed_test.py**

This code tests the `/embed` endpoint of an API.  It uses the `pytest` framework and sends requests to a local server.  `test_embedding_request_structure` checks if a valid request returns a 200 status code and a list of numbers (the embedding). `test_invalid_request_structure` sends a malformed request and expects a 400 error code.  The tests use environment variables and a base URL to construct the API endpoint, and they wrap the requests in a timeout for robustness.


**enriched_query_api_eval_test.py**

This code tests the `/queryModelWithEnrichment` endpoint.  It checks for valid and invalid requests, ensuring correct responses and error handling. It uses `pytest` for testing and includes fixtures for request payloads.  The tests evaluate the API's accuracy by checking the returned answer and related chunks against expected values using cosine similarity.  Several test cases cover different scenarios, including simple question answering, handling YouTube and HTML content, and evaluating response coverage across multiple queries.  Helper functions simulate API calls and manage embedding calculations. The tests aim for high relevance scores and broad coverage of available information.


**enriched_query_util.py**

This Python module provides utilities for testing an "enriched query API".  The `valid_request_payload()` function creates a sample request object of type `IEnrichedQueryRequest`. It populates the request with example data like `repositoryId`, `similarityThreshold`, `question`, and `wordTarget`.  This sample request can then be used in test functions or fixtures to interact with the enriched query API, ensuring consistent and valid test inputs.  The constant `SAMPLE_HOW_LLMS_WORK_RESPONSE` stores example LLM output, though its usage is not shown in this excerpt.


**enumerate_models_test.py**

This code tests the `enumerate_models` API endpoint.  It defines the request and response schemas using JSON Schema, and validates them with example instances.  The tests ensure the response contains required fields like `defaultId` and `smallEmbeddingId`,  doesn't have extra fields, and conforms to the defined schema. It also tests the actual API call using `requests`, checking for a successful 200 status code and validating the returned JSON against the `IEnumerateModelsResponse` schema.  The tests use `pytest` and run against a local server.


**enumerate_repositories_test.py**

This code tests the `/enumerateRepositories` API endpoint.  It checks that the endpoint returns a successful 200 OK status code and validates the returned JSON against a predefined schema. The test uses the `requests` library to make a POST request to the endpoint.  The `BRAID_SESSION_KEY` environment variable is required and used for authentication.  A helper function `validate_response_vs_schema` ensures the response structure matches the expected schema using `jsonschema`. The test runs using `pytest`.


**find_theme_eval_test.py**

This code tests the `/findtheme` endpoint of an API.  It checks if the API correctly identifies the theme of a given text.  The tests use various sport-related descriptions as input.  `test_basic_basketball_theme` and `test_alternative_basketball_description` confirm the API identifies "basketball" as the theme for two different basketball-related texts. `test_football_different_theme` verifies that the API distinguishes between sports, identifying "football" as the theme for a football-related text.  The tests use the `requests` library to send POST requests to the API and assert that the response contains the expected theme. An environment variable `BRAID_SESSION_KEY` is required for authentication.


**find_theme_test.py**

This code tests the `/findtheme` API endpoint. It uses `pytest` to define test cases and `requests` to make HTTP requests. The tests verify the endpoint's behavior with valid input (text and length) and invalid input (missing text or length).  A valid request expects a 200 status code and a JSON response containing a "theme". Requests missing "text" or "length" parameters are expected to return a 400 status code.  The tests use a base URL from an environment variable and wrap request data in a "request" object.


**generate_follow_up_question_api_eval_test.py**

This code tests the `generate_follow_up_question` API.  It uses the `EnrichedQueryApi` to generate follow-up questions based on provided summaries.  Three test cases are defined, each providing a different summary: a simple summary about LLMs, a slightly varied LLM summary, and a summary about climate change. Each test asserts that the API returns a question and that the question is relevant to the provided summary, checking for keywords like "LLM" or "climate change".  The `suggest_content_fixture` simplifies calling the API within the tests.


**page_repository_test.py**

This code tests the `/getpage` endpoint of a Page Repository API.  It uses `pytest` and `requests` to send HTTP requests to a local API instance running on port 7071.  The tests check for successful page retrieval when a valid page ID is provided, and expect a 404 error when the ID is missing.  Authentication is handled via a session key stored in the `BRAID_SESSION_KEY` environment variable.  The tests use a base URL and construct the full endpoint URL dynamically, including the session key.


**prompt_eval_test.py**

This test suite validates the prompt management functionality.  `test_developer_assistant` checks the "DeveloperAssistant" persona by asking "What does LLM stand for?" and verifying the answer contains "large language model". `test_article_summariser` tests the "ArticleSummariser" persona with a short sports article about the Lakers beating the Warriors. It asserts a successful response (status code 200) and checks if the generated 3-word summary contains the expected phrase indicating the Lakers' victory. Both tests use different API endpoints and request structures, demonstrating varied prompt handling.


**studio_test.py**

This code tests the Studio Boxer API. It uses `pytest` for testing, `requests` for making HTTP requests, and `jsonschema` for validating the responses against a predefined schema.  The core test (`test_studio_boxer`) sends a POST request to the `/StudioForTeams-Boxer` endpoint with a sample question. It then checks if the response status is 200 (OK) and if the response structure matches the expected JSON schema. Helper functions validate the structure of the returned enrichment data, ensuring it contains required fields like 'id' and 'summary'.  Additionally, `test_invalid_studio_request` checks the API's handling of bad requests, expecting a 400 status code.


**summarise_eval_test.py**

This code tests the `/summarize` endpoint of a sports summarization API.  It uses `pytest` and sends POST requests with different game descriptions to verify the API's behavior.  `test_basic_sports_summary` checks for a basic summary.  `test_same_game_different_wording` ensures consistent summaries even with varied input phrasing.  `test_different_game_different_summary` confirms that different game details result in different summaries.  All tests assert a 200 status code and the presence of a "summary" in the JSON response.


**summarise_filter_eval_test.py**

This code tests a summarization API endpoint. It defines three test cases. `test_basic_summary` and `test_different_summary` send slightly different game descriptions to the `/summarize` endpoint and check if the summaries mention "Lakers" and "Warriors".  `test_different_game_different_summary` sends a request with minimal content expecting a failure message. It then sends the generated summary to a `/TestForSummariseFail` endpoint to verify that the failure is detected.  The tests use environment variables and the `requests` library for HTTP interactions.


**summarise_test.py**

This code tests the `/Summarize` endpoint of an API.  It uses `pytest` for testing and `requests` for making HTTP calls.  The tests cover standard text summarization, specialized summarization for surveys and code using personas, and error handling for missing or invalid parameters.  The `test_valid_summarise_*` functions send POST requests to the endpoint with different payloads and verify the response status code and the presence of a 'summary' in the response.  The error handling tests check for appropriate status codes (400 or 500) when requests are missing required parameters or are empty.  The code also retrieves the source code of the current file for testing code summarization.


Generated by Salon from Braid Technologies, 28/02/2025