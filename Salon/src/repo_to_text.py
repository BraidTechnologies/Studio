"""
repo_to_text.py

This script processes a local GitHub repository by concatenating the contents of its files into text files, 
with a specified word limit per file.
When it encounters a source file it creates a summary, and acccumulates summaries for all source files ina given directory. 
These are written out at the end. 

Usage:
    python repo_to_text.py --cfg <path_to_config_yaml_file> --repo_path <path-to-repo> [options]

Options:
    --cfg             Path to the config file 
    --repo_path       Path to the local GitHub repository (absolute or relative).
    -w, --max_words   Maximum number of words per output file (default: 200,000).
    -o, --output_dir  Directory to save the output files (default: current directory).
    --skip_patterns   Additional file patterns to skip (e.g., "*.md" "*.txt").
    --skip_dirs       Additional directories to skip.
    -v, --verbose     Enable verbose output.

Example:
    python src/repo_to_text.py --cfg config.yaml --repo_path . -o test_output
    python src/repo_to_text.py --cfg config.yaml --repo_path ./my_repo -w 100000 -o ./output --skip_patterns "*.md" "*.txt" --skip_dirs "tests" -v
"""


import os
import fnmatch
import argparse
from datetime import datetime
from pathlib import Path
import requests
import yaml
import nltk
from nltk.tokenize import word_tokenize

from CommonPy.src.request_utilities import request_timeout

nltk.download('punkt', quiet=True)

SUMMARY_FILENAME='ReadMe.Salon.md'

class SummarisedDirectory:
    def __init__(self):
        self.name = ''
        self.summary = ''


# Dictionary to store processed content with string keys
directories = {}

# Dictionary to store common files with string keys
common_files = {}

def load_yaml(fname):
    # Load configuration from the YAML config file
    try:
        with open(fname, 'r') as config_file:
            config = yaml.safe_load(config_file)
    except FileNotFoundError:
        print(f"Error: Configuration file '{fname}' not found.")
        config = {}
    except yaml.YAMLError as e:
        print(f"Error parsing YAML file: {e}")
        config = {}

    return config

# Configure the base URL for the API.
BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['BRAID_SESSION_KEY']

def summarise_endpoint_url():
    """Construct the full URL for the summary endpoint"""
    return f'{BASE_URL}/Summarize?session=' + SESSION_KEY

def summarise_code(source: str) -> str:
    """
    Summarize source code text using an API endpoint.
    
    Args:
        source (str): The source code text to summarize
        
    Returns:
        str: The summarized text if successful, None otherwise
    """


    payload = {
        'persona': 'CodeSummariser',
        'text': source,
        'lengthInWords': 100
    }
    wrapped = {
        'request': payload
    }
    response = requests.post(summarise_endpoint_url(),
                             json=wrapped, timeout=request_timeout)
    if response.status_code == 200:
        data = response.json()
        if 'summary' in data:
            return data['summary']

    return None
    
    

class RepoContentProcessor:
    def __init__(self, repo_path, config_path={}, max_words=200000):
        # Convert relative path to absolute path
        self.repo_path = Path(repo_path).resolve()
        self.content = ""
        self.file_counter = 1
        self.current_word_count = 0
        self.MAX_WORDS = max_words
        
        config = load_yaml(config_path)

        # Define directories to skip
        self.skip_dirs = config.get("skip_dirs", [])
        # Define file patterns to skip
        self.skip_patterns = config.get("skip_patterns", [])
        # Define file patterns to use a source for chunk size assessment & active code summarisation
        self.source_patterns = config.get("source_patterns", [])
        # Define common directories to use for skipping duplicates where the directories are copied around for deployment reasons
        self.common_directories_patterns = config.get("common_directories_patterns", [])

    def make_common_file_name (self, directory_name, file_name):
        """Make a common file name by combining directory and file name"""
        return directory_name + "-" + file_name
    
    def format_file_block(self, relative_path, file_content):
        """Format a file's content block with consistent indentation"""
        separator = "*" * 40
        return f"{separator}\n{relative_path}\n{separator}\n{file_content}\n{separator}\n"

    def count_words(self, text):
        """Count words in the given text using NLTK tokenizer"""
        return len(word_tokenize(text))
    
    def is_in_git_directory(self, path):
        """Check if the path is inside a .git directory"""
        parts = path.relative_to(self.repo_path).parts
        return '.git' in parts
    
    def is_skip_dir (self, path):
        """Check if the path includes a component in the skip_dirs list"""
        for skip_item in self.skip_dirs:
            if skip_item in path.parts:
               return True
        return False

    def is_in_common_dir (self, path):
        """Check if the path includes a component in the common_directories_patterns list"""
        for common_dir in self.common_directories_patterns:
            if common_dir in path.parts:
               return True
        return False
    
    def extract_common_dir (self, path):
        """Extract the common directory from the path"""
        for common_dir in self.common_directories_patterns:
            if common_dir in path.parts:
               return common_dir
        return None
        
    def is_summary_file(self, path):
        """
        Check if a path is a summary file
        """

        if SUMMARY_FILENAME in path.parts:
            return True
        
        return False
            
    def is_source_file(self, path):
        """
        Check if a path is a source file
        """

        if path.is_file():
            base_name = os.path.basename(path)
            skip1 = any(fnmatch.fnmatch(base_name, pattern)
                      for pattern in self.source_patterns)
            if skip1:
                return True
        
        return False
    
    def should_resummarise_code(self, path):
        """
        Check if a path should be resummarised
        """
        earliest = datetime(1970, 1, 2)
        readme_timestamp = earliest.timestamp()

        # If there is no readme, we need to summarise
        directory = os.path.dirname(path)
        readme_path = os.path.join(directory, SUMMARY_FILENAME)
        if not os.path.exists(readme_path):
            return True
        
        # If the readme is older than the source file, we need to summarise
        readme_timestamp = os.path.getmtime(readme_path)
        
        # Check if any source files are newer than the readme
        for file in os.listdir(directory):
            file_path = os.path.join(directory, file)
            if os.path.isfile(file_path) and self.is_source_file(Path(file_path)):
                file_timestamp = os.path.getmtime(file_path)
                if file_timestamp > readme_timestamp:
                    return True
                    
        return False
    
    def should_skip_path(self, path):
        """
        Check if a path should be skipped
        """
        # Skip anything in .git directory
        if self.is_in_git_directory(path):
            return True
            
        # Skip directories in skip_dirs
        if self.is_skip_dir(path):
            return True
            
        # Skip summary files where there are amended- we add them later on
        if self.is_summary_file(path) and self.should_resummarise_code(path):
            return True
        
        # Skip files matching patterns
        if path.is_file():
            base_name = os.path.basename(path)
            skip1 = any(fnmatch.fnmatch(base_name, pattern)
                      for pattern in self.skip_patterns)
            if skip1:
                return True
        
        return False
    
    def save_directory_content(self):
        """
        Save the directory summaries to the repo path
        """
        
        # Save current working directory 
        current_working_directory = os.getcwd()

        # Change to the repo path
        os.chdir(self.repo_path)

        # Save current directory summaries 
        for directory, item in directories.items():
            if len (item.summary) > 0:
                full_file_path = os.path.join(item.name, SUMMARY_FILENAME)
                with open(full_file_path, 'w+', encoding='utf-8') as f:
                    f.write(item.summary)                
                    print(f"Created {full_file_path}")
        
        os.chdir(current_working_directory)

        # Add summaries to the text accumulation buckets
        for directory, item in directories.items():
            if len (item.summary) > 0:
                full_file_path = os.path.join(item.name, SUMMARY_FILENAME)
                repo_path = os.path.join(self.repo_path, full_file_path)
                self.process_file(Path(repo_path))                           


    def save_current_content(self):
        """Save current content to a numbered file"""
        if self.content:
            output_file = f'repo_content_{self.file_counter}.txt'
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(self.content.rstrip() + "\n")  # Ensure single newline at end of file
            print(f"Created {output_file} with {self.current_word_count} words")
            self.file_counter += 1
            self.content = ""
            self.current_word_count = 0
    
        
    def process_file(self, file_path):
        """Process a single file and add its content to the accumulator"""
        try:
            # Skip if the file is in a common directory and we have already processed a copy of it
            if self.is_in_common_dir(file_path):
                common_file_name = self.make_common_file_name(self.extract_common_dir (file_path), file_path.name)
                if common_file_name in common_files:
                    print(f"Skipping duplicate common file {file_path}")                    
                    return
            
            print(f"Processing: {file_path}")            
            with open(file_path, 'r', encoding='utf-8') as f:
                file_content = f.read().rstrip()  # Remove trailing whitespace
            
            # Create the content block with consistent formatting
            relative_path = str(file_path.relative_to(self.repo_path))
            path_block = self.format_file_block(relative_path, file_content)
            
            # Count words in the new block
            block_word_count = self.count_words(path_block)
            
            # Check if adding this block would exceed the word limit
            if self.current_word_count + block_word_count > self.MAX_WORDS:
                self.save_current_content()
            
            # Add the new block with a single newline for separation
            if self.content:
                self.content += "\n"  # Add separator line only between blocks
            self.content += path_block
            self.current_word_count += block_word_count
            
            if self.is_in_common_dir(file_path):
                common_file_name = self.make_common_file_name(self.extract_common_dir (file_path), file_path.name)
                common_files[common_file_name] = True    

        except (UnicodeDecodeError, IOError) as e:
            print(f"Skipping {file_path}: {str(e)}")
    
    def process_repo(self):
        """Process all files in the repository"""
        print(f"Processing repository at: {self.repo_path}")
        
        if not self.repo_path.exists():
            raise ValueError(f"Path does not exist: {self.repo_path}")
        
        file_count = 0
        skipped_count = 0
        skipped_dirs = set()
        
        # Use Path.rglob instead of os.walk for better path handling
        for file_path in self.repo_path.rglob('*'):
            try:
                rel_path = file_path.relative_to(self.repo_path)                
                # Skip if path should be skipped
                if self.should_skip_path(file_path):
                    if file_path.is_dir():
                        if str(rel_path) not in skipped_dirs:
                            skipped_dirs.add(str(rel_path))
                    else:
                        skipped_count += 1
                    continue
                else:
                    # Ingest only files, not directories
                    if file_path.is_file():
                        self.process_file(file_path)
                        file_count += 1

                        if self.is_source_file(file_path) and self.should_resummarise_code(file_path):
                            file_content = ""
                            summary = None
                            with open(file_path, 'r', encoding='utf-8') as f:
                                file_content = f.read().rstrip()  # Remove trailing whitespace
                            if (len(file_content) > 250):
                                summary = summarise_code(file_content)
                            if summary:
                                file_name = file_path.name
                                directory_path = file_path.parent
                                directory_rel_path = str(directory_path.relative_to(self.repo_path))
                                if directory_rel_path not in directories:
                                    directories[directory_rel_path] = SummarisedDirectory()
                                    (directories[directory_rel_path]).name = str(directory_rel_path)
                                name_and_summary = '**' + file_name + "**\n\n" + summary + '\n\n'
                                existing_summary = directories[directory_rel_path].summary
                                if existing_summary:
                                    accumulated_summary = existing_summary + name_and_summary
                                else:
                                    accumulated_summary = name_and_summary
                                directories[directory_rel_path].summary  = accumulated_summary
                    else:
                        # Keep a dictionary of directories - when we find source files, we add to the summary
                        print(f"Directory: {rel_path}")
                        directories[str(rel_path)] = SummarisedDirectory()
                        (directories[str(rel_path)]).name = str(rel_path)
                                                
                    
            except ValueError as e:
                print(f"Error processing path {file_path}: {e}")
                continue
        
        # Save the directory summaries
        self.save_directory_content()
                
        # Save any remaining content
        if self.content:
            self.save_current_content()
            
        print(f"\nProcessed {file_count} files, skipped {skipped_count} files")




def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Process a GitHub repository and concatenate file contents with word limit.',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )

    parser.add_argument(
        '--cfg',
        type=str,
        default="config.yaml",
        help='Path to the config.yaml file'
    )
    
    parser.add_argument(
        '--repo_path',
        type=str,
        help='Path to the local GitHub repository (absolute or relative)'
    )
    
    parser.add_argument(
        '-w', '--max_words',
        type=int,
        default=200000,
        help='Maximum number of words per output file'
    )
    
    parser.add_argument(
        '-o', '--output_dir',
        type=str,
        default='.',
        help='Directory to save the output files'
    )
    
    parser.add_argument(
        '--skip_patterns',
        type=str,
        nargs='+',
        help='Additional file patterns to skip (e.g., "*.md" "*.txt")'
    )
    
    parser.add_argument(
        '--skip_dirs',
        type=str,
        nargs='+',
        help='Additional directories to skip'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Enable verbose output'
    )
    
    return parser.parse_args()


def validate_args(args):
    """Validate command line arguments"""
    # Convert relative path to absolute path
    repo_path = Path(args.repo_path).resolve()
    
    # Check if repo path exists and is a directory
    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}")
    
    # Check if output directory exists, create if it doesn't
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Validate max words
    if args.max_words <= 0:
        raise ValueError("Maximum words must be greater than 0")
    
    # Update args with resolved paths
    args.repo_path = repo_path
    args.output_dir = output_dir


def main():
    # Parse and validate arguments
    args = parse_arguments()
    try:
        validate_args(args)
    except ValueError as e:
        print(f"Error: {e}")
        return 1
       
    # Process the repository
    try:
        processor = RepoContentProcessor(args.repo_path, args.cfg, args.max_words)
        
        # Add any additional skip patterns from command line
        if args.skip_patterns:
            processor.skip_patterns.update(args.skip_patterns)
        
        # Add any additional skip directories from command line
        if args.skip_dirs:
            processor.skip_dirs.update(args.skip_dirs)
            
        # Change to output directory
        os.chdir(str(args.output_dir))

        processor.process_repo()
        return 0
    except Exception as e:
        print(f"Error during processing: {e}")
        return 1


if __name__ == "__main__":
    main()