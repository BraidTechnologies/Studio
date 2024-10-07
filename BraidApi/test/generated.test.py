import requests
import os

# Assuming the base URL of the API is known
SESSION_KEY = os.environ['SessionKey']
base_url = 'http://localhost:7071/api/Summarize?session=' + SESSION_KEY

def test_valid_request():
    request = {
        "text": "This is a test text that needs summarizing but needs to be slightly longer than the base provided.",
        "lengthInWords": 10
    }
    wrapped = {
        'request' : request
    }
    response = requests.post(base_url, json=wrapped)
    assert response.status_code == 200, "Expected status code 200 for valid request."
    response_data = response.json()
    assert "summary" in response_data, "Response should contain 'summary'."
    assert isinstance(response_data["summary"], str), "'summary' should be a string."

def test_missing_required_field():
    request = {
        "lengthInWords": 10
    }
    wrapped = {
        'request' : request
    }
    response = requests.post(base_url, json=wrapped)
    assert response.status_code == 400, "Expected status code 400 for missing 'text'."

def test_additional_property_in_request():
    request = {
        "text": "This is a test text.",
        "additional": "This is not allowed."
    }
    response = requests.post(base_url, json=request)
    assert response.status_code == 400, "Expected status code 400 for additional properties."

def test_invalid_type_for_text():
    request = {
        "text": 123456,
        "lengthInWords": 10
    }
    wrapped = {
        'request' : request
    }
    response = requests.post(base_url, json=wrapped)
    assert response.status_code == 400, "Expected status code 400 for invalid type of 'text'."

def test_invalid_type_for_lengthInWords():
    request = {
        "text": "This is a test text that needs summarizing but needs to be slightly longer than the base provided.",
        "lengthInWords": "ten"
    }
    wrapped = {
        'request' : request
    }
    response = requests.post(base_url, json=wrapped)
    assert response.status_code == 400, "Expected status code 400 for invalid type of 'lengthInWords'."

# Running the test cases
if __name__ == "__main__":
    try:
        test_valid_request()
        print("test_valid_request passed.")
    except AssertionError as e:
        print("test_valid_request failed:", e)

    try:
        test_missing_required_field()
        print("test_missing_required_field passed.")
    except AssertionError as e:
        print("test_missing_required_field failed:", e)

    try:
        test_additional_property_in_request()
        print("test_additional_property_in_request passed.")
    except AssertionError as e:
        print("test_additional_property_in_request failed:", e)

    try:
        test_invalid_type_for_text()
        print("test_invalid_type_for_text passed.")
    except AssertionError as e:
        print("test_invalid_type_for_text failed:", e)

    try:
        test_invalid_type_for_lengthInWords()
        print("test_invalid_type_for_lengthInWords passed.")
    except AssertionError as e:
        print("test_invalid_type_for_lengthInWords failed:", e)