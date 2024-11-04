# Copyright (c) 2024 Braid Technologies Ltd

from openai import OpenAI
import argparse
import json
import os

client = OpenAI()
api_key = os.environ.get("OPENAI_API_KEY")

# Define the start and end code markers
start_point_code = '```python'
end_point_code = '```'

# Command-line argument parsing
parser = argparse.ArgumentParser(description="Generate Pytest code from API JSON data.")
parser.add_argument("input_path", type=str, help="Path to the input JSON file.")
args = parser.parse_args()

# Function to extract code snippet between the start and end markers
def extract_code(content):
    print(f"[extract_code] Content type: {type(content)}")
    print(f"[extract_code] Content preview: {content[:200]}")  # Show first 200 chars for context

    start_index = content.find(start_point_code)
    end_index = content.rfind(end_point_code)

    # Only process if both markers are found
    if start_index != -1 and end_index != -1:
        start_index += len(start_point_code)  # Move past the start marker
        code_snippet = content[start_index:end_index].strip()
        return code_snippet
    return None

# Load the API data from the input file
with open(args.input_path, 'r') as file:
    api_data = json.load(file)

print(f"[main] Loaded API data type: {type(api_data)}")
print(f"[main] Loaded API data preview: {json.dumps(api_data)[:200]}")  # Show first 200 chars for context

# Generate the assistant
assistant = client.beta.assistants.create(
    name="API Test Code Generator",
    instructions="You are a Python expert. Generate production-ready Pytest test cases for all endpoints defined in the given API JSON data. The tests should cover various scenarios, including positive, negative, and edge cases, and include appropriate assertions.",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4o",
)

# Create a thread and message to request test code generation
thread = client.beta.threads.create()
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=f"Please generate comprehensive Pytest test code from the following API JSON data:\n{json.dumps(api_data)}"
)

# Run the code generation and wait for the result
run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant.id,
    instructions="in the response make sure to just return the error-free test code"
)

if run.status == 'completed':
    # Retrieve all messages from the thread using the .data attribute
    messages = client.beta.threads.messages.list(thread_id=thread.id).data
    print(f"[main] Messages type: {type(messages)}")
    print(f"[main] Messages content: {messages}")

    # Ensure there are messages and concatenate their content
    if messages:
        # Extract text from each message's content
        generated_content = "\n".join(
            text_block.text.value for msg in messages for text_block in msg.content
        )
        print(f"[main] Generated content preview:\n{generated_content[:500]}")  # Show first 500 chars for context

        extracted_code = extract_code(generated_content)

        if extracted_code:
            # Construct the output file path with the same location and name as the input file but with a .py extension
            output_path = os.path.splitext(args.input_path)[0] + '.py'
            with open(output_path, 'w') as output_file:
                output_file.write(extracted_code)
            print(f"Generated test code saved to {output_path}")
        else:
            print("Error: Could not find code markers in the generated content.")
    else:
        print("Error: No messages received in the response.")
else:
    print(f"Generation failed with status: {run.status}")
