"""
A tool to analyze a repository and generate C4 diagrams by processing its contents.

This module provides functionality to:
- Walk through repository directories
- Process relevant files and their contents 
- Generate C4 architectural diagrams via an API endpoint
- Summarize code structure and relationships

The main class RepoToC4 handles the repository traversal and processing logic.
"""

import os
import argparse
from pathlib import Path
import requests

from CommonPy.src.request_utilities import request_timeout

BASE_URL = 'http://localhost:7071/api'
SESSION_KEY = os.environ['SessionKey']

def summarise_endpoint_url():
    # Construct the full URL for the summary endpoint
    return f'{BASE_URL}/Summarize?session=' + SESSION_KEY

def summarise_code(source: str) -> str:


    payload = {
        'persona': 'C4Diagrammer',
        'text': source,
        'lengthInWords': 1000
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

class RepoToC4:
    """
    A class to process a GitHub repository and generate C4 diagrams.
    """
    def __init__(self, repo_path):
        # Convert relative path to absolute path
        self.repo_path = Path(repo_path).resolve()
    
    def write_file_version(self, dir_name, file_name, content):

        output_file = os.path.join(self.repo_path, dir_name, file_name)
        try:
            written = False
            # Add version number to filename if file exists
            version = 1
            base_path = Path(output_file)
            while os.path.exists(output_file) and not written:
                # Get the parent directory and filename parts
                parent = base_path.parent
                stem = base_path.stem
                suffix = base_path.suffix
                # Create new filename with version number
                output_file = str(
                    parent / f"{stem}_v{version}{suffix}")
                version += 1
                with open(output_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                    print(f"Wrote diagram to {output_file}")
                    written = True
        except IOError as e:
           print(f"Error writing to {output_file}: {e}")



    def process_repo(self):
        """
        Walk through the repository directory and process files.
        """   

        dirs = [d for d in os.listdir(self.repo_path) if os.path.isdir(os.path.join(self.repo_path, d))]        
        dirs.append(".")

        for d in dirs:
            have_readme_and_salon_files = False    

            print(f"Processing directory: {d}")
            # Check if there is a file named 'readme.md' (or a case variation) in the directory
            readme_file = next((f for f in os.listdir(
                os.path.join(self.repo_path, d)) if f.lower() == 'readme.md'), None)
            
            if readme_file:
                print(f"Found 'readme.md' (or a case variation of that file name) in the directory: {d}")
                readme_text = ""
                with open(os.path.join(self.repo_path, d, readme_file), 'r', encoding='utf-8') as file:
                    readme_text = file.read()

                sub_dirs = os.listdir(os.path.join(self.repo_path, d))
                for sub_d in sub_dirs:
                    if sub_d.lower() != 'test' and Path(sub_d).is_dir():
                        sub_dir_path = os.path.join(self.repo_path, d, sub_d)
                        # Check if there is a file named 'ReadMe.Salon.Md' (or a case variation) in the subdirectory
                        readme_salon_file = next((f for f in os.listdir(
                            sub_dir_path) if f.lower() == 'readme.salon.md'), None)
                        if readme_salon_file:
                            have_readme_and_salon_files = True
                            print(f"Found 'ReadMe.Salon.Md' (or a case variation of that file name) in the subdirectory: {
                                sub_dir_path}")
                            with open(os.path.join(self.repo_path, d, sub_dir_path, readme_salon_file), 'r', encoding='utf-8') as file:
                                readme_salon_text = file.read() 
                                readme_text += "\n\n"
                                readme_text += readme_salon_text    
                
                if have_readme_and_salon_files:
                    print(f"Found 'readme.md' and 'ReadMe.Salon.Md' in the directory: {d}")
                    prompt = "Please generate a C4Context diagram in mermaid format from the following description of a software system. Include the User. Only generate mermaid content."
                    prompt += "\n\n"
                    prompt += readme_text

                    summary = summarise_code(prompt)                    
                    self.write_file_version(d, 'C4Context.Salon.md', summary)

                    prompt = "Please generate a C4Container diagram in mermaid format from the following description of a software system. Only generate mermaid content. "
                    prompt += "\n\n"
                    prompt += readme_text

                    summary = summarise_code(prompt)                    
                    self.write_file_version(d, 'C4Container.Salon.md', summary)

                    prompt = "Please generate a C4Component diagram in mermaid format from the following description of a software system. Only generate mermaid content. "
                    prompt += "\n\n"
                    prompt += readme_text

                    summary = summarise_code(prompt)     
                    self.write_file_version(d, 'C4Component.Salon.md', summary)                       

            
def parse_arguments():
    """Parse command line arguments"""
    parser = argparse.ArgumentParser(
        description='Process a GitHub repository and concatenate file contents with word limit.',
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        '--repo_path',
        type=str,
        help='Path to the local GitHub repository (absolute or relative)'
    )       
    
    return parser.parse_args()


def validate_args(args):
    """Validate command line arguments"""
    if not args.repo_path:
        raise ValueError(f"No repository path provided.")
        
    # Convert relative path to absolute path
    repo_path = Path(args.repo_path).resolve()
    
    # Check if repo path exists and is a directory
    if not repo_path.exists():
        raise ValueError(f"Repository path does not exist: {repo_path}.")
    if not repo_path.is_dir():
        raise ValueError(f"Repository path is not a directory: {repo_path}.") 
    
    # Update args with resolved paths
    args.repo_path = repo_path


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
        processor = RepoToC4(args.repo_path)

        processor.process_repo()
        return 0
    
    except Exception as e:
        print(f"Error during processing: {e}")
        return 1


if __name__ == "__main__":
    main()