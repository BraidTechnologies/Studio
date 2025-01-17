# Copyright (c) 2024 Braid Technologies Ltd


import argparse
import sys
import json
import os
import logging
from typing import Optional, Union
import yaml
from openai import OpenAI

# Configure logging
logging.basicConfig(level=logging.ERROR, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = OpenAI()
api_key = os.environ.get("OPENAI_API_KEY")

# Define code snippet markers for extraction
START_POINT_CODE = '```python'
END_POINT_CODE = '```'


class LocalArgumentParser(argparse.ArgumentParser):
    """
    Custom argument parser that overrides the default error handling.

    This class extends `argparse.ArgumentParser` to provide a custom error
    method that writes an error message to stderr, displays the help message,
    and exits the program with a status code of 2.

    Methods:
        error(message): Overrides the default error handling to display a
        custom error message and help information before exiting.
    """
    def error(self, message):
        sys.stderr.write('error: %s\n' % message)
        self.print_help()
        sys.exit(2)

def parse_arguments() -> argparse.Namespace:
    """Parse command-line arguments for the script.
    
    Returns:
        argparse.Namespace: Parsed command-line arguments containing the input file path.
    """
    parser = LocalArgumentParser (description="Generate Pytest code from API data in JSON or YAML format.")
    parser.add_argument("input_path", type=str, help="Path to the input JSON or YAML file.")
    parser.add_argument("--eval", action='store_true', help="Optional argument. If true, generate evaluation cases assuming successful operation of the API. If false (default), generate traditional test cases.")
    return parser.parse_args()


def extract_code(content: str) -> Optional[str]:
    """Extracts the Python code snippet between specified start and end markers.
    
    Args:
        content (str): The content from which to extract the code snippet.
    
    Returns:
        Optional[str]: The extracted Python code snippet, or None if markers are not found.
    """
    start_index = content.find(START_POINT_CODE)
    end_index = content.rfind(END_POINT_CODE)

    if start_index != -1 and end_index != -1:
        start_index += len(START_POINT_CODE)
        return content[start_index:end_index].strip()
    else:
        logger.warning("Could not find code markers in the generated content.")
    return None


def load_api_data(file_path: str) -> Union[dict, None]:
    """Loads API data from a JSON or YAML file.
    
    Args:
        file_path (str): The path to the JSON or YAML file.
    
    Returns:
        Union[dict, None]: Parsed JSON or YAML data as a dictionary, or None on failure.
    """
    try:
        with open(file_path, 'r') as file:
            if file_path.endswith('.json'):
                data = json.load(file)
                logger.info("Successfully loaded input JSON file containing API data.")
            elif file_path.endswith('.yaml') or file_path.endswith('.yml'):
                data = yaml.safe_load(file)
                logger.info("Successfully loaded input YAML file containing API data.")
            else:
                logger.error("Unsupported file format. Only JSON and YAML files are accepted.")
                return None
            return data
    except (FileNotFoundError, json.JSONDecodeError, yaml.YAMLError) as e:
        logger.error(f"Failed to load data from {file_path}: {e}")
        return None


def main() -> None:
    """Main function to generate Pytest code from API data in JSON or YAML format."""
    args = parse_arguments()

    # Load API data from input file
    api_data = load_api_data(args.input_path)
    if api_data is None:
        logger.critical("Exiting program due to failure in loading API data.")
        print("Error: Failed to load API data. Please check the input file and try again.")
        exit(1)

    # Determine the file type based on the input file extension for prompt context
    file_type = "JSON" if args.input_path.endswith('.json') else "YAML"

    # Generate the content for the prompt with file type context
    if (args.eval):
       prompt = "Based on the 'request' data type as input, and the 'response' data type as output, generate three test cases in Python using Pytest for an API that takes the input and returns the output.  The first test case should be a test of miniumum function - a very simple input to produce a certain output. The second should be a small variation of the input that should produse the same output. The third shuld be a small variation of the input that produces a different output. Use the domain of sports to produce example inputs and outputs."
    else:
       prompt = "Based on the 'request' data type as input, and the 'response' data type as output, generate test cases in Python using Pytest for an API that takes the input and retruns the output. The tests should cover all combinations of input fields, with appropriate assertions. If there is no specific endpoint listed, generate a placeholder call that takes the 'Request' as input and returns the 'Response'"
    content = (
        f"Please generate Pytest code from the following API data in {file_type} format:\n"
        f"{json.dumps(api_data) if file_type == 'JSON' else yaml.dump(api_data)}"
    )

    # Set up assistant and thread for code generation
    try:
        if (args.eval):
           prompt = "You are a Python code generator."
        else:
           prompt = "You are a Python code generator."
        assistant = client.beta.assistants.create(
            name="API Test Code Generator",
            instructions=prompt,
            tools=[{"type": "code_interpreter"}],
            model="gpt-4o",
        )
        thread = client.beta.threads.create()
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=content
        )
        print(f"Successfully initialized assistant and sent API data in {file_type} format for test code generation.")
    except Exception as e:
        logger.error(f"Failed to initialize assistant or thread: {e}")
        print("Error: Unable to set up assistant for code generation.")
        exit(1)

    # Print static message to indicate response generation without delay
    if (args.eval):
       print("Generating eval code...")
    else:
       print("Generating test code...")

    # Poll for code generation results
    try:
        run = client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=assistant.id,
            instructions="Return the test code"
        )
        if run.status != 'completed':
            logger.error(f"Code generation failed with status: {run.status}")
            print("Error: Code generation did not complete successfully.")
            exit(1)
    except Exception as e:
        logger.error(f"Error during code generation: {e}")
        print("Error: There was an issue during code generation.")
        exit(1)

    # Retrieve generated code from messages
    try:
        messages = client.beta.threads.messages.list(thread_id=thread.id).data
        generated_content = "\n".join(
            text_block.text.value for msg in messages for text_block in msg.content
        )
        extracted_code = extract_code(generated_content)

        if extracted_code:
            # Save extracted code to a .py file in the same directory as the input file
            if (args.eval):
               output_path = os.path.splitext(args.input_path)[0] + '_eval.py'
            else:
               output_path = os.path.splitext(args.input_path)[0] + '_test.py'

            with open(output_path, 'w') as output_file:
                output_file.write(extracted_code)
            logger.info(f"Generated test code saved to {output_path}")
            print(f"Test code successfully generated and saved to {output_path}")
        else:
            logger.warning("No code snippet was extracted from the generated content.")
            print("Warning: No valid test code was generated. Please review the API data.")
    except Exception as e:
        logger.error(f"Failed to retrieve or process messages: {e}")
        print("Error: Could not retrieve the generated code.")
        exit(1)


if __name__ == "__main__":
    main()