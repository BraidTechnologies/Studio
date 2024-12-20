**BoxerDataTest_v1.py**

This code handles the generation of enriched questions and calculation of their similarity embeddings using OpenAI APIs (AzureOpenAI). 

Classes/Functions:
1. `configure_openai_for_azure()`: Configures the Azure OpenAI API client.
2. `TestResult`: A class to store information about test results.
3. `call_openai_chat()`: Communicates with OpenAI API for chat-based responses, with retry logic.
4. `get_text_embedding()`: Retrieves text embeddings via the OpenAI API.
5. `cosine_similarity()`: Computes cosine similarity between two vectors.
6. `generate_enriched_question()`: Uses OpenAI API to generate an enriched version of a question.
7. `process_questions()`: Processes a list of questions and assesses their similarity to pre-processed data.
8. `read_processed_chunks()`: Reads and processes JSON files from a directory.
9. `save_results()`: Saves test results in a JSON file.
10. `run_tests()`: Manages the overall test run by coordinating other functions.

**BoxerDataTest_v2.py**

The code provided is for generating and processing AI-assisted questions using `gpt-3.5-turbo` and `text-embedding-ada-002` for OpenAI services integrated with Azure. It involves defining functions and classes for configuring Azure OpenAI clients, generating enriched questions, calculating cosine similarity, and handling retries for API calls.

Important classes and functions:
- `configure_openai_for_azure(config: ApiConfiguration)`: Sets up the Azure OpenAI client.
- `TestResult`: Stores results from test questions.
- `call_openai_chat(client, messages, config, logger)`: Handles retries for calling the OpenAI Chat API.
- `get_text_embedding(client, config, text, logger)`: Retrieves text embeddings.
- `cosine_similarity(a, b)`: Calculates cosine similarity between two vectors.
- `generate_enriched_question(client, config, question, logger)`: Generates enriched questions.
- `process_questions(client, config, questions, processed_question_chunks, logger)`: Processes and evaluates test questions.
- `read_processed_chunks(source_dir)`: Reads and processes JSON files.
- `save_results(test_destination_dir, question_results, test_mode)`: Saves test results.
- `run_tests(config, test_destination_dir, source_dir, num_questions, questions, persona_strategy)`: Main function to run tests. 

Logging, retry mechanisms, and strategy patterns are utilized to improve reliability and clarity in generating and processing AI inquiries.

**BoxerDataTest_v3.py**

This Python module generates persona-specific questions using AI, primarily integrating with OpenAI and Azure services. It includes setup for logging and relevant third-party packages.

**Key Classes and Functions:**
1. **ApiConfiguration:** A local module for handling API configurations.
2. **DeveloperPersonaStrategy, TesterPersonaStrategy, BusinessAnalystPersonaStrategy, PersonaStrategy:** Classes for persona-based question strategies.
3. **TestResult:** A class storing test results.
4. **configure_openai_for_azure(config):** Configures Azure OpenAI API client.
5. **call_openai_chat(client, messages, config, logger):** Calls OpenAI API with configured retry logic.
6. **get_text_embedding(client, config, text, logger):** Retrieves text embeddings from OpenAI API.
7. **cosine_similarity(a, b):** Calculates cosine similarity between two vectors.
8. **generate_enriched_question(client, config, question, logger):** Generates enriched questions using OpenAI.
9. **generate_follow_up_question(client, config, text, logger):** Generates follow-up questions.
10. **assess_follow_up_on_topic(client, config, follow_up, logger):** Assesses the relevance of follow-up questions.
11. **process_questions(client, config, questions, processed_question_chunks, logger):** Processes and evaluates a list of test questions.
12. **read_processed_chunks(source_dir):** Reads processed data from a directory.
13. **save_results(test_destination_dir, question_results, test_mode):** Saves generated questions and their results.
14. **run_tests(config, test_destination_dir, source_dir, num_questions, questions, persona_strategy):** Main function to execute test processes.

**BoxerDataTest_v4.py**

This Python module provides functionality for AI-powered question generation, embedding similarity checks, and evaluation using generative models.

1. **Key Classes and Functions**:
   - `configure_openai_for_azure(config: ApiConfiguration)`: Configures an Azure OpenAI client using the provided settings.
   - `TestResult`: A class to store test results including enriched questions and follow-up questions.
   - `call_openai_chat(...)`: A function to call the OpenAI API with retry logic for generating responses.
   - `get_text_embedding(...)`: Retrieves text embeddings using OpenAI API.
   - `cosine_similarity(...)`: Calculates cosine similarity between two vectors.
   - Functions like `generate_enriched_question(...)`, `generate_follow_up_question(...)`, and `assess_follow_up_on_topic(...)` handle different stages of question processing and evaluation.
   - `process_questions(...)`: Processes a list of questions to evaluate their relevance based on similarity to pre-processed question chunks.
   - Functions `read_processed_chunks(...)` and `save_results(...)` handle reading and saving test data respectively.
   - `run_tests(...)`: Main function to run tests using the provided configuration, persona strategy, and directories.

2. **Logging and Retry Mechanism**: 
   - The module utilizes Python's `logging` package for logging messages.
   - The OpenAI API interactions use a retry mechanism with exponential backoff, to handle transient errors.

3. **Configuration and Class Usage**:
   - Configurations are managed with `ApiConfiguration`.
   - Uses `GeminiEvaluator` to assess quality of generated content from GPT-4o outputs.
   - Incorporates `PersonaStrategy` for generating different types of persona-based questions.

Overall, this module facilitates generating and evaluating AI-driven questions using Azure OpenAI, with robust error handling and logging.

**BoxerDataTest_v5.py**

This code is designed for generating, processing, and evaluating AI-based enriched questions using OpenAI tools.

**Imports and Dependencies:** 
- It imports libraries such as logging, json, numpy, AzureOpenAI, and tenacity.

**Configurations and Constants:** 
- Defines constants for similarity thresholds, retry attempts, and sets up logging.

Important Functions and Classes:

1. **configure_openai_for_azure:** Configures OpenAI client for Azure.
2. **TestResult Class:** Stores test results including questions and evaluations.
3. **call_openai_chat:** Handles OpenAI's chat API calls with retry logic.
4. **get_text_embedding:** Retrieves text embeddings with retry logic.
5. **cosine_similarity:** Calculates cosine similarity between vectors.
6. **generate_enriched_question:** Generates enriched question summaries.
7. **generate_follow_up_question:** Creates follow-up questions based on AI content.
8. **assess_follow_up_on_topic:** Assesses the relevance of follow-up questions.
9. **process_questions:** Processes and evaluates questions, including similarity checks and follow-ups.
10. **read_processed_chunks:** Reads pre-processed question chunks.
11. **save_results:** Saves generated results to JSON files.
12. **run_tests:** Runs tests based on configurations, generating questions, processing them, and saving results.

The code works with various `PersonaStrategies` for generating questions and uses Azure OpenAI for embedding and chatting. It involves reading questions, generating and evaluating follow-ups, and storing results.

**GeminiEvaluator.py**

The `GeminiEvaluator` class evaluates the quality of summaries generated by a large language model (LLM). It uses the Gemini LLM to determine how well the summary captures core information from the original content and addresses the user's query.

Important functions:
- `__init__`: Initializes the class, sets the API key, endpoint, and system instruction prompt for the evaluation using environment variables and the Google Generative AI library.
- `evaluate`: Assesses the summary quality by creating an evaluation prompt with the original content and summary, generating a response from the Gemini LLM, and returning the evaluation score.

**PersonaStrategy.py**

This code defines a module that generates questions tailored to specific professional personas using the OpenAI chat model.

The code imports necessary libraries such as `abc`, `logging`, `OpenAI`, and manages the API configuration and logging setup.

The `PersonaStrategy` abstract class defines a method to generate persona-based questions, which is meant to be implemented by subclasses. The `_generate_questions` method assists in creating a standard chat interaction to generate these questions using provided prompts.

Three concrete classes extend `PersonaStrategy`: `DeveloperPersonaStrategy`, `TesterPersonaStrategy`, and `BusinessAnalystPersonaStrategy`, each implementing the `generate_questions` method using respective persona prompts.

**run_BoxerDataTest.py**

This code sets up the environment for running tests on BoxerData. It begins by importing standard libraries and setting up the Python path to include the project directories. It then imports necessary modules, including `run_tests` from `BoxerDataTest_v1`.

Logging is configured to the INFO level, and a list of questions about Large Language Models (LLMs) is defined.

It configures API settings through the `ApiConfiguration` class and sets paths for test outputs and source data, ensuring the test output directory exists.

Finally, it runs the tests with error handling, logging the process's start and completion, and catching any exceptions during execution.

**TestRunner.py**

This script sets up logging and adds directories to the system path for module imports. The `TestRunner` function runs different test scenarios based on user input, utilizing the `run_tests` function from `BoxerDataTest_v5`.

It initializes the API configuration through `ApiConfiguration` and prepares Azure resources with `configure_openai_for_azure`. The test output and source directories are defined, and the script ensures the test output directory exists.

The user can select between static question tests or persona-based tests (`DeveloperPersonaStrategy`, `TesterPersonaStrategy`, `BusinessAnalystPersonaStrategy`). The script runs the appropriate tests based on the user’s choice, handling any exceptions and logging errors.

