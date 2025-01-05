**PagerepositoryApi.Types_test.py**

The code imports `pytest` for testing, `requests` to make HTTP requests, and `patch` from `unittest.mock` to mock HTTP responses.

`BASE_URL` is set as the base URL for the API that the functions will interact with.

The variable `sample_successful_html` holds sample HTML data for successful response testing.

`test_get_page_success` function checks a successful GET request to the API, mocking `requests.get` to return a 200 status and JSON containing `sample_successful_html`.

`test_get_page_missing_param` function tests a GET request where required parameters are missing, mocking `requests.get` to return a 400 status and "Bad Request" message.

