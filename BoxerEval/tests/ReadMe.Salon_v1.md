**BoxerDataTest_v1.py**

This Python code evaluates the relevance of test questions against a set of pre-processed question chunks.  It uses Azure OpenAI's text-embedding-ada-002 model to generate embeddings and calculate cosine similarity. The `run_tests` function orchestrates the process: it reads pre-processed chunks, processes test questions by enriching them and calculating their similarity to existing chunks, and saves the results.  A similarity threshold determines if a question is a "hit". The code includes retry logic for OpenAI API calls and detailed logging for debugging.  It focuses on questions related to AI application development using Python and LLMs.


**BoxerDataTest_v2.py**

This Python code evaluates the relevance of generated questions against existing knowledge. It uses Azure OpenAI for text embedding and question generation.  The code reads pre-processed question chunks from JSON files, calculates cosine similarity between embeddings of generated and existing questions, and flags matches above a threshold.  It supports different persona strategies (developer, tester, business analyst) for generating questions. Results, including the original question, enriched question, hit status, and relevance score, are saved to a JSON file.  The code includes retry logic for handling API connection issues and error logging.


**BoxerDataTest_v3.py**

This code implements an AI-powered question generation and evaluation system. It uses Azure OpenAI to generate and enrich questions related to AI application development, primarily using Python and LLMs.  The system leverages pre-calculated embeddings of existing questions (loaded from JSON files) to assess the relevance of newly generated questions using cosine similarity. A follow-up question is also generated for each relevant question and then checked for relevance to the main topic.  The code includes retry logic and error handling for robust API interaction.  Results, including original questions, enriched summaries, relevance scores, and follow-up questions, are saved to a JSON file.  Different persona strategies (developer, tester, business analyst) can be used to guide question generation.


**BoxerDataTest_v4.py**

This code tests the quality of AI-generated answers to developer questions.  It uses several Azure OpenAI models and a Gemini model.  `gpt-4o` generates enriched questions based on initial user questions.  `text-embedding-ada-002` creates embeddings for similarity comparisons between generated answers and a set of pre-processed question chunks.  `gemini-1.5-pro` evaluates the quality of the generated summaries. The code includes retry logic for API calls and saves the results, including follow-up questions and on-topic assessments, to a JSON file.  It supports different persona strategies (developer, tester, business analyst) for generating test questions.


**BoxerDataTest_v5.py**

This code evaluates the performance of a question-answering system using OpenAI and Gemini.  It generates questions based on a chosen persona (developer, tester, or business analyst), enriches them using OpenAI, and then compares them to existing question chunks using cosine similarity of their embeddings.  Gemini evaluates the quality of OpenAI's enriched summaries. The code includes retry logic for OpenAI API calls and saves the results, including follow-up questions and their relevance to AI, to a JSON file. It uses `gpt-4o` for question generation, `text-embedding-3-large` for embeddings, and `gemini-1.5-pro` for evaluation.


**GeminiEvaluator.py**

This module uses Google's Gemini model to evaluate LLM-generated summaries against original content.  The `GeminiEvaluator` class handles the evaluation using the Gemini API and a scoring system from 1 (poor) to 4 (excellent).  The evaluator is initialized with an API key from the `GEMINI_API_KEY` environment variable. The `evaluate` function takes the original content and summary as input, sends them to the Gemini model with a prompt instructing it to score the summary, and returns the score.


**PersonaStrategy.py**

This code implements a Strategy pattern to generate persona-specific questions about LLMs using Azure OpenAI.  An abstract base class `PersonaStrategy` defines the question generation interface.  Concrete strategies like `DeveloperPersonaStrategy`, `TesterPersonaStrategy`, and `BusinessAnalystPersonaStrategy` implement this interface, each using a tailored prompt to generate relevant questions.  The `_generate_questions` method handles the interaction with the OpenAI API, constructing the chat prompt and processing the response.  The code also includes logging and utilizes custom modules for API configuration and common functions.


**run_BoxerDataTest.py**

This script runs a suite of tests for Large Language Models (LLMs) using the Boxer testing framework. It defines a list of LLM-related questions, configures the API and file paths, and then executes the tests using either `BoxerDataTest_v1` or `BoxerDataTest_v2`.  The script sets up logging to track the test process.  It creates a directory for test outputs and handles potential errors during directory creation and test execution.  The core function `run_tests` takes the configuration, output directory, source directory, and the list of questions as input.


**TestRunner.py**

This script, `TestRunner.py`, provides a command-line interface for testing LLM-based systems.  It offers two main testing modes: static question testing and persona-based testing (Developer, Tester, Business Analyst). The script uses Azure OpenAI clients for chat and embeddings, handles configuration, manages directories, and logs results.  Users select a testing mode, and the script executes predefined questions or persona-specific tests against a specified data source, saving the output to a designated directory.  The script incorporates error handling and logging for robust operation.


Generated by Salon from Braid Technologies, 27/02/2025