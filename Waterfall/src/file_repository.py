'''Module to store data in local file system'''
# Copyright (c) 2024 Braid Technologies Ltd

# Standard Library Imports
import logging
import os
import json

from src.make_local_file_path import make_local_file_path

# Set up logging to display information about the execution of the script
logging.basicConfig(level=logging.WARNING,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
logging.getLogger().setLevel(logging.WARNING)


def strip_quotes(input_string):
    """
 Remove all single and double quotes from the input string.

 Args:
     input_string (str): The string from which quotes will be removed.

 Returns:
     str: The input string with all single and double quotes removed.
    """
    return input_string.replace('\"', '').replace("'", '')


class FileRespository:
    '''
    Class providing load, save, and existence check for files in the file system.
    '''

    def __init__(self, output_location: str):
        self.output_location = output_location

    def save(self, path: str, extension: str, text: str) -> None:
        '''
        Save the provided text to a file at the specified path within the output location.

        Parameters:
           path (str): An Http path.
           extension (str): The extension of the file.
           text (str): The text content to be saved in the file.
        '''

        if not os.path.exists(self.output_location):
            os.makedirs(self.output_location)

        fake_name = make_local_file_path(path)
        content_output_filename = os.path.join(
            self.output_location, f'{fake_name}.' + extension)

        with open(content_output_filename, 'w+', encoding='utf-8') as file:
            json.dump(text, file, indent=4, ensure_ascii=False)
            file.close()

        logger.debug('Saving: %s', path)

        return None

    def load(self, path: str, extension: str) -> str:
        '''
        Load content from a file based on the provided path and extension. 
        If the file exists in the output location, its contents are read and returned as a string. 
        If the file does not exist, an empty string is returned.

        Parameters:
           path (str): An Http path.
           extension (str): The extension of the file.

        Returns:
           str: The contents of the file if it exists, otherwise an empty string.
        '''

        fake_name = make_local_file_path(path)
        content_output_filename = os.path.join(
            self.output_location, f'{fake_name}.' + extension)

        if not os.path.exists(self.output_location):
            os.makedirs(self.output_location)
            return ''

        fake_name = make_local_file_path(path)
        if os.path.exists(content_output_filename):
            with open(content_output_filename, 'r', encoding='utf-8') as file:
                contents = file.read()
                file.close()
            return strip_quotes(contents)

        return ''

    def exists(self, path: str, extension: str) -> bool:
        '''
        Checks if a file with the specified path and extension exists in the output location 
        of the FileRepository.

        Parameters:
           path (str): An Http path.
           extension (str): The extension of the file.

        Returns:
           bool: True if the file exists, False otherwise.
        '''
        if not path:
            return False

        fake_name = make_local_file_path(path)
        content_output_filename = os.path.join(
            self.output_location, f'{fake_name}.' + extension)

        if not os.path.exists(self.output_location):
            os.makedirs(self.output_location)
            return False

        if os.path.exists(content_output_filename):
            return True

        return False
