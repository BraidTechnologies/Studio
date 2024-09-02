# TestRunner.py
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


from BoxerDataTest_v2 import run_tests, call_openai_chat
from common.ApiConfiguration import ApiConfiguration
from PersonaStrategy import DeveloperPersonaStrategy, TesterPersonaStrategy, BusinessAnalystPersonaStrategy
from openai import AzureOpenAI, OpenAIError, BadRequestError, APIConnectionError

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def TestRunner():
    config = ApiConfiguration()
    test_destination_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/test output/"
    source_dir = "D:/Braid Technologies/BraidTechnologiesRepo/WorkedExamples/BoxerTest/data/"

    try:
        os.makedirs(test_destination_dir, exist_ok=True)
        logger.info(f"Test output directory ensured at: {test_destination_dir}")
    except OSError as e:
        logger.error(f"Failed to create test output directory: {e}")
        raise

    print("Choose a test mode:")
    print("1. Static Questions")
    print("2. Developer Persona")
    print("3. Tester Persona")
    print("4. Business Analyst Persona")
    choice = input("Enter your choice: ")

    if choice == '1':
        questions = [
            'How are LLMs different from traditional AI models?',
            'What is a Large Language Model (LLM)?',
            'What is natural language processing (NLP)?',
        ]
        run_tests(config, test_destination_dir, source_dir, questions)
    elif choice == '2':
        strategy = DeveloperPersonaStrategy()
        run_tests(config, test_destination_dir, source_dir, persona_strategy=strategy)
    elif choice == '3':
        strategy = TesterPersonaStrategy()
        run_tests(config, test_destination_dir, source_dir, persona_strategy=strategy)
    elif choice == '4':
        strategy = BusinessAnalystPersonaStrategy()
        run_tests(config, test_destination_dir, source_dir, persona_strategy=strategy)
    else:
        print("Invalid choice. Exiting.")
        return

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    try:
        TestRunner()
    except Exception as e:
        logger.error(f"An error occurred during testing: {e}")
        raise
