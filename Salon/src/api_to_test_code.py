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

# Global OpenAI client
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
    """
    def error(self, message):
        sys.stderr.write('error: %s\n' % message)
        self.print_help()
        sys.exit(2)


def parse_arguments() -> argparse.Namespace:
    """
    Parse command-line arguments for the script.

    Returns:
        argparse.Namespace: Parsed command-line arguments
    """
    parser = LocalArgumentParser(
        description="Generate Pytest code from API data in JSON or YAML format. "
                    "Allows iterative prompt refinement."
    )
    parser.add_argument("input_path", type=str,
                        help="Path to the input JSON or YAML file.")
    parser.add_argument(
        "--eval",
        action='store_true',
        help="Optional argument. If true, generate specialized evaluation test cases. "
             "If false (default), generate traditional test cases."
    )
    return parser.parse_args()


def extract_code(content: str) -> Optional[str]:
    """
    Extracts the Python code snippet between specified start and end markers.

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
    """
    Loads API data from a JSON or YAML file.

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
    """
    Main function to generate Pytest code from API data in JSON or YAML format,
    allowing iterative enhancements to the prompt in a conversational manner.
    """
    args = parse_arguments()

    # 1. Load API data
    api_data = load_api_data(args.input_path)
    if api_data is None:
        logger.critical("Exiting program due to failure in loading API data.")
        print("Error: Failed to load API data. Please check the input file and try again.")
        exit(1)

    # 2. Determine the file type for context in the prompt
    file_type = "JSON" if args.input_path.endswith('.json') else "YAML"

    # 3. Build a baseline instruction set depending on --eval
    baseline_instructions = (
        "You are a highly skilled Python test automation expert.\n"
        "Assume there is a base URL that takes the Request object as a parameter, "
        "and returns the Response object.\n"
        "You must:\n"
        "1) Cover positive, negative, and edge test cases.\n"
        "2) Write well-structured code with clear naming conventions and consistent formatting.\n"
        "3) Use 'Request' for input data structures and 'Response' for output data structures.\n"
        "4) Output only the complete code snippet in triple backticks, with no additional explanation.\n"
    )

    if args.eval:
        # If --eval is used, generate specialized 'evaluation' test cases
        baseline_instructions += (
            "\nAdditional instructions:\n"
            "Based on the 'request' data type as input, and the 'response' data type as output, "
            "generate three test cases in Python using Pytest for an API that takes the input "
            "and returns the output. The first test case should test a minimal input, the second "
            "a small variation that produces the same result, and the third a small variation "
            "that produces a different result. Use sports domain examples.\n"
            "Generate the code with test cases that are error free."
        )
    else:
        # Otherwise, generate broader test coverage
        baseline_instructions += (
            "\nAdditional instructions:\n"
            "Based on the 'request' data type as input, and the 'response' data type as output, "
            "generate test cases in Python using Pytest for an API that takes the input and "
            "returns the output. The tests should cover all combinations of input fields "
            "with appropriate assertions. If no specific endpoint is listed, generate a placeholder "
            "call that takes the 'Request' as input and returns the 'Response'.\n"
            "Generate the code with test cases that are error free."
        )

    # Convert the API data to JSON or YAML snippet
    api_data_snippet = (
        json.dumps(api_data, indent=2) if file_type == "JSON" else yaml.dump(api_data)
    )

    # 4. Prepare the OpenAI assistant
    try:
        assistant = client.beta.assistants.create(
            name="API Test Code Generator",
            instructions=baseline_instructions,
            tools=[{"type": "code_interpreter"}],
            model="gpt-4o",
        )
    except Exception as e:
        logger.error(f"Failed to initialize assistant: {e}")
        print("Error: Unable to set up assistant for code generation.")
        exit(1)

    # 5. Iterative generation:
    generation_count = 1

    while True:
        # If this is the first generation, we generate with no additional user prompt
        # Otherwise, ask the user for refinements
        if generation_count == 1:
            # Initial prompt
            user_input_prompt = ""
            print("\nInitial generation in progress...")
        else:
            # Ask user for additional instructions or to quit
            print("\nPlease enter additional instructions to refine your code generation, or type 'Q' to quit:")
            user_input_prompt = input(">> ").strip()
            if user_input_prompt.upper() == "Q":
                print("Exiting iterative generation.")
                break

        # Combine everything into the final content for this generation
        combined_content = (
            f"API data provided ({file_type}):\n{api_data_snippet}\n\n"
            "User instructions:\n"
            f"{user_input_prompt}\n"
            "Please return only the complete Python code between triple backticks.\n"
        )

        # Create a new thread for each generation attempt
        try:
            thread = client.beta.threads.create()
        except Exception as e:
            logger.error(f"Failed to create thread: {e}")
            print("Error: Unable to start a new conversation thread.")
            break

        # Post the user’s combined content
        try:
            client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=combined_content
            )
        except Exception as e:
            logger.error(f"Failed to add user message: {e}")
            print("Error: Unable to send content to the model.")
            continue

        # Run the generation, polling until complete
        try:
            run = client.beta.threads.runs.create_and_poll(
                thread_id=thread.id,
                assistant_id=assistant.id,
                instructions="Return only the complete Python code in triple backticks, no additional commentary."
            )
        except Exception as e:
            logger.error(f"Error during code generation run: {e}")
            print("Error: There was an issue during code generation.")
            continue

        if run.status != 'completed':
            logger.error(f"Code generation failed with status: {run.status}")
            print("Error: Code generation did not complete successfully.")
            continue

        # Retrieve generated code from messages
        try:
            messages = client.beta.threads.messages.list(thread_id=thread.id).data
            generated_content = "\n".join(
                text_block.text.value
                for msg in messages
                if msg.role == "assistant" and hasattr(msg, "content")
                for text_block in msg.content
                if hasattr(text_block, "text") and text_block.text.value
            )
        except Exception as e:
            logger.error(f"Failed to retrieve or process messages: {e}")
            print("Error: Could not retrieve the generated code from the assistant.")
            continue

        # Extract code from the generated content
        extracted_code = extract_code(generated_content)
        if extracted_code:
            # Construct the output filename with generation number
            base_name = os.path.splitext(args.input_path)[0]
            if args.eval:
                output_path = f"{base_name}_eval_{generation_count}.py"
            else:
                output_path = f"{base_name}_test_{generation_count}.py"

            try:
                with open(output_path, 'w', encoding='utf-8') as output_file:
                    output_file.write(extracted_code)
                logger.info(f"Generated test code saved to {output_path}")
                print(f"\nTest code successfully generated and saved to {output_path}")
            except Exception as e:
                logger.error(f"Could not save the test code to {output_path}: {e}")
                print("Warning: Could not save the test code to a file.")

            # Show the user the generated code in the console for review
            print("\n------ Generated Code Start ------")
            print(extracted_code)
            print("------ Generated Code End   ------\n")
        else:
            logger.warning("No code snippet was extracted from the generated content.")
            print("Warning: No valid test code was generated. Please refine your prompt or check the API data.")

        generation_count += 1


if __name__ == "__main__":
    main()
