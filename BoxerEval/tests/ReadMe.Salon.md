**BoxerDataTest_v1.py**

This code is designed to process questions through similarity embedding and to generate enriched questions using the Azure OpenAI API. 

The `configure_openai_for_azure` function initializes the Azure OpenAI client. The `TestResult` class is used to hold test results, which include the original question, enriched question, hit status, and relevance.

The `call_openai_chat` and `get_text_embedding` functions call the OpenAI API with retry logic using the `tenacity` library. 

The `cosine_similarity` function calculates similarity between vectors. The `generate_enriched_question` function generates enriched questions via the OpenAI API.

The `process_questions` function handles the evaluation of each question against processed question chunks, and the `read_processed_chunks` function reads JSON files containing these chunks. 

Finally, the `save_results` function writes the results to a file, and `run_tests` orchestrates the entire process.

**BoxerDataTest_v2.py**

This Python code facilitates question generation, similarity analysis, and evaluation in the context of AI-based applications using OpenAI's Azure services.

**Classes & Functions:**
- **`configure_openai_for_azure`**: Configures OpenAI for Azure.
- **`TestResult`**: Class for storing test results.
- **`call_openai_chat`**: Calls OpenAI API with retry logic.
- **`get_text_embedding`**: Retrieves text embeddings.
- **`cosine_similarity`**: Calculates cosine similarity between vectors.
- **`generate_enriched_question`**: Generates enriched questions using OpenAI API.
- **`process_questions`**: Processes test questions.
- **`read_processed_chunks`**: Reads processed JSON files containing pre-processed question chunks.
- **`save_results`**: Saves test results to a specified directory.
- **`run_tests`**: Orchestrates the entire testing sequence.

**BoxerDataTest_v3.py**

This module facilitates persona-based question generation and evaluation using OpenAI's Azure services. It imports standard libraries and third-party packages like Tenacity for retry logic and AzureOpenAI from OpenAI. 

Key components include:
- **ApiConfiguration**: Holds API settings.
- **TestResult**: Stores results for each test question.
- **configure_openai_for_azure**: Configures the OpenAI client.
- **call_openai_chat**: Handles API calls with retries.
- **get_text_embedding**: Fetches text embeddings.
- **cosine_similarity**: Computes similarity between vectors.
- **generate_enriched_question**: Produces enriched questions.
- **generate_follow_up_question** and **assess_follow_up_on_topic**: Handle follow-up question generation and assessment.
- **process_questions**, **read_processed_chunks**, and **save_results**: Manage question processing, reading processed data, and saving results.
- **run_tests**: The main function to execute tests utilizing generated or provided questions.

**BoxerDataTest_v4.py**

This Python module handles persona-based question generation, similarity embedding, and evaluation. 

### Key Classes and Functions:

- **`configure_openai_for_azure`**: Configures and returns an AzureOpenAI client.
- **`TestResult` class**: Stores the results of the test, including question, enriched question summary, hit status, hit relevance, follow-up question, and Gemini evaluation.
- **`call_openai_chat`**: Calls the OpenAI API with retry logic to manage session consistency and fault tolerance.
- **`get_text_embedding`**: Retrieves text embedding for a given text using the OpenAI API.
- **`cosine_similarity`**: Computes cosine similarity between two vectors.
- **`generate_enriched_question`** and **`generate_follow_up_question`**: Generates enriched questions and follow-up questions using OpenAI API.
- **`assess_follow_up_on_topic`**: Determines if the follow-up question is relevant to AI.
- **`process_questions`**: Processes test questions, assesses relevance, and evaluates the enriched answers.
- **`read_processed_chunks`**: Reads and processes JSON data from a specified directory.
- **`save_results`**: Saves the processed question results to a JSON file.
- **`run_tests`**: Main test function that initiates the Azure OpenAI client, generates questions using a persona strategy, processes them, and saves the results.

### Constants and Logging:
Constants manage settings like similarity thresholds and prompts. Logging is set up for debugging and tracking the process.

**BoxerDataTest_v5.py**

The code is a suite for generating and evaluating AI-related questions using OpenAI's API, integrated with Azure.

Key Classes:
1. **TestResult**: Metadata storage for questions, follow-ups, and evaluations.
2. **ApiConfiguration**: Configures AzureOpenAI client.
3. **GeminiEvaluator**: Assess follow-up question relevance.

Important Functions:
1. **configure_openai_for_azure**: Sets up Azure OpenAI client.
2. **call_openai_chat**: Handles API calls with retries.
3. **get_text_embedding**: Fetches text embeddings.
4. **cosine_similarity**: Computes similarity between vectors.
5. **generate_enriched_question**: Creates enriched questions.
6. **generate_follow_up_question**: Generates follow-up questions.
7. **assess_follow_up_on_topic**: Validates follow-up relevance.
8. **process_questions**: Main routine for question processing and evaluation.
9. **read_processed_chunks**: Reads pre-processed question sets.
10. **save_results**: Writes results to JSON.

### Flow:
1. OpenAI clients for chat/embedding initialization.
2. Process and enrich questions based on strategies.
3. Evaluate relevance and save outputs.

**GeminiEvaluator.py**

**GeminiEvaluator Module**

**Overview:**
The GeminiEvaluator module evaluates the quality of summaries generated by large language models (LLM) using Google's Gemini model. It assesses how well summaries encapsulate core information from the original content and address user queries.

**Key Class:**
- **GeminiEvaluator Class:** This class initiates the evaluation process using Gemini's API. It authenticates using an API key and sets instructions for evaluating summaries.

**Key Function:**
- **evaluate(original_content: str, summary: str) -> str:** This function takes original content and a generated summary as inputs. It uses Gemini LLM to score the summary on a scale of 1 (poor) to 4 (excellent).

**Dependencies:**
- google.generativeai
- os

**PersonaStrategy.py**

This module uses the Strategy pattern for generating persona-specific questions using LLM (large language models) technology and Azure OpenAI services.

The PersonaStrategy abstract class defines the interface for creating persona-based question generation strategies. Concrete implementations include DeveloperPersonaStrategy, TesterPersonaStrategy, and BusinessAnalystPersonaStrategy, each generating questions from their respective perspectives.

The _generate_questions method is a helper function for generating questions using specific prompts and handles calling the OpenAI chat model. Error handling and logging mechanisms are included for robustness.

Key classes:
- PersonaStrategy (ABC)
- DeveloperPersonaStrategy
- TesterPersonaStrategy
- BusinessAnalystPersonaStrategy

**run_BoxerDataTest.py**

This module is designed to run tests for LLM-related questions using the Boxer Data Testing framework. It handles the execution of tests, supports different test implementation versions (v1/v2), and manages file operations for test inputs and outputs.

Key functions include loading and processing test questions, configuring test environments and directories, executing tests, and handling logging.

Key classes and functions:
- `run_tests` from `BoxerDataTest_v1 (or v2)`
- `ApiConfiguration` from `common.ApiConfiguration`

The script sets up logging and directories, lists predefined questions about LLMs, and executes tests while handling potential errors.

**TestRunner.py**

**TestRunner Module**

The `TestRunner` module for running automated tests on LLM-based systems supports static question testing and persona-based testing using Developer, Tester, and Business Analyst strategies. This module leverages Azure OpenAI clients for chat and embedding, configurable test output directories, logging, error handling, and directory management.

**Classes and Functions**
1. **TestRunner**: Main function to run tests based on user choice via a command-line interface, handling API configurations, directory management, and test execution.
2. **run_tests, call_openai_chat, configure_openai_for_azure**: Imported from `BoxerDataTest_v5` for executing tests.
3. **ApiConfiguration**: Manages API configurations.
4. **PersonaStrategy implementations**: DeveloperPersonaStrategy, TesterPersonaStrategy, BusinessAnalystPersonaStrategy for persona-based test execution.

### Other Relevant Points
- Logging is set up for test execution tracking.
- Ensures test output directory exists or creates it.
- Prompts users to choose testing modes and executes corresponding test strategies.

