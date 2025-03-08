**classify_eval.py**

This code is a test module for a text classification API endpoint. It contains integration tests for the `/classify` endpoint, focusing on sports-related text classification. The tests evaluate the API's accuracy in differentiating among predefined classifications, such as basketball, soccer, and tennis.

Three main test functions are defined:

1. `test_basic_basketball_classification()`: Ensures basic basketball-related text is correctly classified as "basketball".

2. `test_similar_basketball_classification()`: Verifies that text with different wording but similar context to basketball is consistently classified as "basketball".

3. `test_different_sport_classification()`: Checks that text related to a different sport, such as tennis, is correctly classified as "tennis".

Important components: `simple_test`, `mutation_test`, `variant_test`, `request_timeout`, `article_classifier_prompt_id`, `BASE_URL`, `SESSION_KEY`, `API_ENDPOINT`.

**enriched_query_api_eval_test.py**

This module tests the enriched query API endpoint `/queryModelWithEnrichment`, validating its functionality under various conditions. Key aspects include checking valid and invalid requests, and the accuracy of responses for sample queries.

Functions `valid_request_payload()` and `invalid_request_payload()` create valid and invalid payloads for testing. 

The `test_enriched_query_invalid_payload` tests handling of invalid payloads, ensuring appropriate error responses.

The function `test_enriched_query_success()` validates correct responses, including accuracy checks using cosine similarity.

Specific tests (`test_enriched_simple_function`, `test_enriched_simple_function_variant`, `test_enriched_simple_function_negative`, `test_enriched_simple_function_list`, `test_enriched_from_youtube`, and `test_enriched_from_html`) verify correct functioning under different scenarios. 

These tests use fixtures such as `valid_request_payload_fixture()` and `invalid_request_payload_fixture()` for payload preparation. 

Important classes/functions in the module: `EnrichedQueryApi`, `valid_request_payload`, `invalid_request_payload`, `test_enriched_query_invalid_payload`, `test_enriched_query_success`, `test_enriched_simple_function`, `test_enriched_simple_function_variant`, `test_enriched_simple_function_negative`, `test_enriched_simple_function_list`, `test_enriched_from_youtube`, `test_enriched_from_html`.

**find_theme_eval.py**

This module tests the theme finding API endpoint using integration tests for the `/findtheme` endpoint, which identifies the main theme of input text. It verifies if the API correctly identifies sports themes and maintains consistency for similar content.

Environment variables like `BRAID_SESSION_KEY` are required for authentication.

Key tests:
- `test_basic_basketball_theme`: Basic basketball description should be identified as basketball.
- `test_alternative_basketball_description`: Variant basketball description should still be identified as basketball.
- `test_football_different_theme`: A football description should return a football theme.

Important classes/functions:
- `simple_test`, `mutation_test`, `variant_test` (decorators).
- `test_basic_basketball_theme`
- `test_alternative_basketball_description`
- `test_football_different_theme`

**generate_follow_up_question_api_eval_test.py**

The code tests the `generate_follow_up_question` API within three distinct scenarios using the `pytest` framework.

The `suggest_content` function calls the `generate_question` method of the `EnrichedQueryApi` class, passing an `IGenerateQuestionRequest` object and returning an `IQuestionGenerationResponse` object.

A pytest fixture named `suggest_content_fixture` is defined to call the `suggest_content` function.

Three decorated test functions utilize `simple_test`, `mutation_test`, and `variant_test` decorators. These functions, `test_generate_follow_up_suggestions_simple_summary`, `test_generate_follow_up_suggestions_slightly_varied_summary`, and `test_generate_follow_up_suggestions_significantly_varied_summary`, each check that a valid follow-up question is generated based on different input summaries.

Important classes/functions/modules: `suggest_content`, `suggest_content_fixture`, `EnrichedQueryApi`, `IGenerateQuestionRequest`, `IQuestionGenerationResponse`, `simple_test`, `mutation_test`, `variant_test`.

**summarise_eval.py**

This code module is an integration test suite for the `/summarize` API endpoint, focusing on sports event summarization. It verifies the endpoint's consistency, accuracy, and handling of different inputs.

- `BASE_URL` and `API_ENDPOINT` configure the base and full URL for the API calls.
- `test_basic_sports_summary` checks basic summarization of a simple sports event.
- `test_same_game_different_wording` verifies that different wordings of the same event produce similar summaries.
- `test_different_game_different_summary` ensures that a different game's summary is accurately reflected.

The main functions are `test_basic_sports_summary`, `test_same_game_different_wording`, and `test_different_game_different_summary`. These tests use `simple_test`, `mutation_test`, and `variant_test` decorators for categorization.

**summarise_filter_eval.py**

This code tests the summarization functionality of an API.

The `BASE_URL` for the API endpoints is configured using an environment variable for the session key.

Three test functions (`test_basic_summary`, `test_different_summary`, `test_different_game_different_summary`) leverage decorators (`@simple_test`, `@mutation_test`, `@variant_test`) for running categorized tests.

`test_basic_summary` ensures that the summarizer correctly summarizes a simple sports event HTML text.

`test_different_summary` checks to see if reworded versions of the same event consistently produce similar summaries.

`test_different_game_different_summary` verifies that empty or nonsensical HTML inputs lead to a failed summary and the failure is detectable via a second endpoint.

Important functions/classes: `simple_test`, `mutation_test`, `variant_test`, and `requests.post`.

Generated by Salon from Braid Technologies, 06/03/2025