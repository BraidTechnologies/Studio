# Test Scripts README

This README provides instructions on how to run the test scripts located in the `scripts/test/` folder and explains their expected output.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Running the Tests](#running-the-tests)
3. [Test Scripts](#test-scripts)
   - [test_web_pipeline.py](#test_web_pipelinepy)
   - [test_youtube_pipeline.py](#test_youtube_pipelinepy)
4. [Expected Output](#expected-output)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

Before running the tests, ensure you have the following:

- Python 3.12.4 installed
- Virtual environment activated
- All required dependencies installed (run `pip install -r scripts/requirements.txt` from the project root)
- Proper environment variables set in your `.env` file

## Running the Tests

To run the test scripts, follow these steps:

1. Navigate to the `scripts/test/` directory:

   ```
   cd scripts/test/
   ```

2. Run the tests using pytest:
   ```
   pytest test_web_pipeline.py test_youtube_pipeline.py
   ```

You can also run each test script separately:

```
pytest -v "test_web_pipeline.py"
pytest -v "test_youtube_pipeline.py"
```

## Test Scripts

### test_web_pipeline.py

This script tests the web content processing pipeline. It includes tests for:

- Downloading HTML content
- Enriching text chunks
- Generating summaries
- Creating embeddings
- Counting URL hits

### test_youtube_pipeline.py

This script tests the YouTube content processing pipeline. It includes tests for:

- Downloading YouTube transcripts
- Enriching transcript chunks
- Generating summaries
- Creating embeddings
- Counting URL hits
- Handling various YouTube API exceptions

## Expected Output

When running the tests, you should see output similar to the following:

```
============================= test session starts ==============================
platform darwin -- Python 3.12.4, pytest-7.4.0, pluggy-1.2.0
rootdir: /path/to/your/project/scripts/test
collected X items

test_web_pipeline.py ...                                                 [ 33%]
test_youtube_pipeline.py ......                                          [100%]

============================== X passed in Y.YYs ===============================
```

Each dot (.) represents a passed test. If a test fails, you'll see an 'F' instead, followed by detailed error information.

## Troubleshooting

If you encounter any issues while running the tests:

1. Ensure all prerequisites are met and dependencies are installed.
2. Check that your `.env` file contains the necessary API keys.
3. Verify that you're running the tests from the correct directory.
4. If a specific test is failing, review the error message and stack trace for more information.
