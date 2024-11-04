# Copyright (c) 2024 Braid Technologies Ltd

from openai import OpenAI
import argparse
import json
import os
import logging
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

client = OpenAI()
api_key = os.environ.get("OPENAI_API_KEY")

# Define code snippet markers for extraction
START_POINT_CODE = '```python'
END_POINT_CODE = '```'


def parse_arguments() -> argparse.Namespace:
    """Parse command-line arguments for the script.

    Returns:
        argparse.Namespace: Parsed command-line arguments containing the input file path.
    """
    parser = argparse.ArgumentParser(description="Generate Pytest code from API JSON data.")
    parser.add_argument("input_path", type=str, help="Path to the input JSON file.")
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
        code_snippet = content[start_index:end_index].strip()
        return code_snippet
    else:
        logger.warning("Could not find code markers in the generated content.")
    return None


def load_api_data(file_path: str) -> dict:
    """Loads API data from a specified JSON file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        dict: Parsed JSON data as a dictionary.
    """
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        logger.error(f"Failed to load JSON data from {file_path}: {e}")
        raise


def main() -> None:
    """Main function to generate Pytest code from API JSON data."""
    args = parse_arguments()

    # Load API data from input JSON file
    try:
        api_data = load_api_data(args.input_path)
        logger.info("Successfully loaded API data.")
    except Exception as e:
        logger.critical("Exiting program due to failure in loading API data.")
        exit(1)

    # Set up assistant and thread for code generation
    try:
        assistant = client.beta.assistants.create(
            name="API Test Code Generator",
            instructions="You are a Python expert. Generate production-ready Pytest test cases for all endpoints defined in the given API JSON data. The tests should cover various scenarios, including positive, negative, and edge cases, and include appropriate assertions.",
            tools=[{"type": "code_interpreter"}],
            model="gpt-4o",
        )
        thread = client.beta.threads.create()
        client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=f"Please generate comprehensive Pytest test code from the following API JSON data:\n{json.dumps(api_data)}"
        )
    except Exception as e:
        logger.error(f"Failed to initialize assistant or thread: {e}")
        exit(1)

    # Poll for code generation results
    try:
        run = client.beta.threads.runs.create_and_poll(
            thread_id=thread.id,
            assistant_id=assistant.id,
            instructions="in the response make sure to just return the error-free test code"
        )
        if run.status != 'completed':
            logger.error(f"Code generation failed with status: {run.status}")
            exit(1)
    except Exception as e:
        logger.error(f"Error during code generation: {e}")
        exit(1)

    # Retrieve generated code from messages
    try:
        messages = client.beta.threads.messages.list(thread_id=thread.id).data
        generated_content = "\n".join(
            text_block.text.value for msg in messages for text_block in msg.content
        )
        extracted_code = extract_code(generated_content)

        if extracted_code:
            # Write extracted code to a .py file in the same directory as the input file
            output_path = os.path.splitext(args.input_path)[0] + '.py'
            with open(output_path, 'w') as output_file:
                output_file.write(extracted_code)
            logger.info(f"Generated test code saved to {output_path}")
        else:
            logger.warning("No code snippet was extracted from the generated content.")
    except Exception as e:
        logger.error(f"Failed to retrieve or process messages: {e}")
        exit(1)


if __name__ == "__main__":
    main()
