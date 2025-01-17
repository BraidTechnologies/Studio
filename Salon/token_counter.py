import argparse
import sys
import tiktoken
from pprint import pprint

def count_tokens(text, tokenizer):
    return len(tokenizer.encode(text))

def main():
    parser = argparse.ArgumentParser(description="Token Counter Utility")
    parser.add_argument('--f', required=True, help='Path to the input file.')
    parser.add_argument('--v', action='store_true', help='Optional flag to calculate how many copies fit into a 65536 token context window.')
    
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
        tokenizer = tiktoken.get_encoding("gpt-4")
    except Exception as e:
        print(f"Error initializing tokenizer: {e}")
        sys.exit(1)
    
    token_count = count_tokens(content, tokenizer)
    print(f"Number of tokens in the file: {token_count}")
    
    if args.v:
        context_window = 65536
        num_copies = context_window // token_count if token_count > 0 else 0
        pprint(f"Number of copies that fit into a {context_window} token context window: {num_copies}")

if __name__ == "__main__":
    main() 