## Features

- **Supports JSON and YAML API Specifications**: Accepts input in both JSON and YAML formats, adapting the output accordingly.
- **Prompt-Optimized Code Generation**: Provides context-aware prompts to OpenAI for more accurate and relevant test code generation.
- **Error Handling and Logging**: Logs critical issues and informs the user with helpful messages in case of any issues.
- **Automated File Output**: Saves generated test code directly to a Python file in the same directory as the input file.
- **Simple CLI Interface**: Command-line interface with clear prompts and instructions for easy usage.

## Installation

1. **Install Required Packages**:
   Ensure that you have the required Python packages installed. You can do this by running:

   ```bash
   pip install openai pyyaml
   ```

2. **Set Up Environment Variable**:
   Set up your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY="your_openai_api_key"
   ```

## Usage

### Command-Line Interface

Run the script from the command line with a single argument specifying the path to the JSON or YAML API specification file.

```bash
python api_to_test_code.py <path_to_api_file>
```

### Example

```bash
python api_to_test_code.py sample_api.json
```

### Output

The generated Pytest code will be saved in the same directory as the input file, with `_test.py` appended to the original filename.

## Code Overview

### 1. Argument Parsing

The `parse_arguments()` function parses the command-line arguments to accept a single input file path, which should point to either a JSON or YAML file.

### 2. Loading API Data

The `load_api_data(file_path: str) -> Union[dict, None]` function reads the JSON or YAML file, validates its content, and converts it into a Python dictionary. The function supports both file types and logs an error if the file format is unsupported or if parsing fails.

### 3. Setting Up the Assistant and Thread

The assistant is initialized using OpenAI’s API to generate Pytest code based on the provided API data. The assistant is configured with prompt instructions that include file format information to ensure precise code generation.

### 4. Extracting the Code Snippet

The `extract_code(content: str) -> Optional[str]` function isolates the generated Python code snippet, which is returned in a `Python` code block format. This is extracted by locating the `START_POINT_CODE` and `END_POINT_CODE` markers.

### 5. Generating and Saving Test Code

Once the code is generated, it is saved as a `.py` file with the original input file’s name followed by `_test.py`. This file is then saved in the same directory as the input file.

### 6. Logging and Error Handling

The tool uses logging to track errors, warnings, and other critical steps throughout the script. The logging level is set to `ERROR` to minimize verbosity unless the developer overrides this.

## Sample Output

After running the script, the generated Pytest code will be saved in a file named `<input_file_name>_test.py` (e.g., `sample_api_test.py`).

## Error Handling

In case of an error (such as an invalid input file or failure in code generation), clear and concise error messages will be displayed, and the program will exit gracefully.

## Dependencies

- `openai`: For connecting to the OpenAI API.
- `pyyaml`: For parsing YAML input files.
- `argparse`, `json`, `logging`, and `os`: Standard Python libraries for command-line argument parsing, JSON handling, logging, and file management.

## License

© 2024 Braid Technologies Ltd. All rights reserved.
