# Copyright (c) 2024 Braid Technologies Ltd

import logging
import os
import sys

# Set up logging to display information about the execution of the script

# Get the current directory (tests folder)
current_dir = os.path.dirname(os.path.abspath(__file__))
# Get the parent directory (BoxerTests root)
parent_dir = os.path.dirname(current_dir)
# Add the parent directory to the Python path
sys.path.insert(0, parent_dir)

# Import necessary modules and classes for running the tests
from BoxerDataTest_v2 import run_tests, call_openai_chat
from common.ApiConfiguration import ApiConfiguration
from PersonaStrategy import DeveloperPersonaStrategy, TesterPersonaStrategy, BusinessAnalystPersonaStrategy
from openai import AzureOpenAI, OpenAIError, BadRequestError, APIConnectionError

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def TestRunner():
    """
    Runs tests using the provided configuration, test destination directory, source directory, and questions.

    This script provides a command-line interface to run tests using the BoxerDataTest_v2 module.
    Depending on the user's choice, it can run static question tests or persona-based tests.

    Parameters:
        None

    Returns:
        None
    """
    
    # Initialize the API configuration
    config = ApiConfiguration()

    # Define the directories for test output and data sources
    test_destination_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/test output/"
    source_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/data/"

    try:
        # Ensure the test output directory exists, create if it doesn't
        os.makedirs(test_destination_dir, exist_ok=True)
        logger.info(f"Test output directory ensured at: {test_destination_dir}")
    except OSError as e:
        # Log an error if the directory cannot be created
        logger.error(f"Failed to create test output directory: {e}")
        raise

    # Provide the user with options to choose the test mode
    print("Choose a test mode:")
    print("1. Static Questions")
    print("2. Developer Persona")
    print("3. Tester Persona")
    print("4. Business Analyst Persona")
    choice = input("Enter your choice: ")

    # Run tests based on the user's choice
    if choice == '1':
        questions = [
            'How are LLMs different from traditional AI models?',
            'What is a Large Language Model (LLM)?',
            'What is natural language processing (NLP)?',
        ]
        run_tests(config, test_destination_dir, source_dir, questions=questions)
        
    elif choice == '2':
        # Developer persona-based testing
        strategy = DeveloperPersonaStrategy()
        run_tests(config, test_destination_dir, source_dir, persona_strategy=strategy)
    elif choice == '3':
        # Tester persona-based testing
        strategy = TesterPersonaStrategy()
        run_tests(config, test_destination_dir, source_dir, persona_strategy=strategy)
    elif choice == '4':
        # Business analyst persona-based testing
        strategy = BusinessAnalystPersonaStrategy()
        run_tests(config, test_destination_dir, source_dir, persona_strategy=strategy)
    else:
        # Handle invalid input
        print("Invalid choice. Exiting.")
        return


if __name__ == "__main__":
    # Run the TestRunner function if the script is executed as the main program
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    try:
        TestRunner()
    except Exception as e:
        # Log any exceptions that occur during the test execution
        logger.error(f"An error occurred during testing: {e}")
        raise
