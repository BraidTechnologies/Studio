"""
A utility for counting tokens in text files using the tiktoken tokenizer.

This script provides functionality to:
- Count the number of tokens in a text file using OpenAI's tiktoken tokenizer
- Optionally calculate how many copies of the text would fit in a 65536 token context window

Usage:
    python count_tokens.py --f <input_file> [--v]

Arguments:
    --f : Path to the input text file
    --v : Optional flag to calculate copies that fit in context window

The script uses the cl100k_base tokenizer which is compatible with GPT-4 and recent
GPT-3.5 models.

Prompt: 'Generate python code for a command line utility. The utility takes an argument prefixed with --f which is a path to a file. 
The utility opens the file and load the contents into a text string. It then creates a GPT4-compatible tokenizer, and counts the tokens in the string. 
It prints the number of tokens in the string. 
The utility has an optional argument, prefixed --v, which if present the utility counts how many copies of the file would fit in a  context window of 65536 tokens. 
It prints the whole number of copies of the file that would fit in a 65536 token context window.'

"""


import argparse
import sys
import tiktoken
from pprint import pprint


def count_tokens(text, tokenizer):
    return len(tokenizer.encode(text))


def main():
    parser = argparse.ArgumentParser(description="Token Counter Utility")
    parser.add_argument('--f', required=True, help='Path to the input file.')
    parser.add_argument('--v', action='store_true',
                        help='Optional flag to calculate how many copies fit into a 65536 token context window.')

    args = parser.parse_args()

    try:
        with open(args.f, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        print(f"File not found: {args.f}")
        sys.exit(1)
    except Exception as e:
        print(f"Error reading file {args.f}: {e}")
        sys.exit(1)

    try:
        tokenizer = tiktoken.get_encoding("cl100k_base")
    except Exception as e:
        print(f"Error initializing tokenizer: {e}")
        sys.exit(1)

    token_count = count_tokens(content, tokenizer)
    print(f"Number of tokens in the file: {token_count}")

    if args.v:
        context_window = 65536
        num_copies = context_window // token_count if token_count > 0 else 0
        print(f"Number of copies that fit into a {
              context_window} token context window: {num_copies}")


if __name__ == "__main__":
    main()
