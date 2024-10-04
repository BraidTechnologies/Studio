'''Facade to store embeddings in local file system'''

# Copyright (c) 2024 Braid Technologies Ltd

import os
from glob import glob

from file_repository import FileRespository

spec = "embed.txt"


def read_file_names(path: str, file_spec: str):
    return list(glob(os.path.join(path, file_spec)))


class EmbeddingRespositoryFacade:
    '''
    Class providing an interface to load, save, and existence check for files in the file system.
    '''

    def __init__(self, output_location: str):
        self.file__repository = FileRespository(output_location)
        self.output_location = output_location
        self.extension = spec

    @staticmethod
    def spec() -> str:
        return "*." + spec

    def list_contents(self) -> list[str]:
        paths = read_file_names(self.output_location,
                                EmbeddingRespositoryFacade.spec())

        file_names = []
        for path in paths:
            # strip twice as we have double extensions in file names
            stripped = os.path.splitext(os.path.splitext(path)[0])[0]
            filename = os.path.basename(stripped)
            file_names.append(filename)

        return file_names

    def save(self, path: str, embedding: list[float]) -> None:
        '''
        Save the provided text to a file at the specified path within the output location.

        Parameters:
           path (str): The path where the file will be saved.
           text (str): The text content to be saved in the file.
        '''
        return self.file__repository.save(path, self.extension, str(embedding))

    def load(self, path: str) -> list[float]:
        '''
        Load content from a file based on the provided path. 
        If the file exists in the output location, its contents are read and returned as a string. 
        If the file does not exist, an empty string is returned.

        Parameters:
           path (str): The path of the file.

        Returns:
           str: The contents of the file if it exists, otherwise an empty string.
        '''

        loaded = self.file__repository.load(path, self.extension)

        return self.text_to_float (loaded)

    def exists(self, path: str) -> bool:
        '''
        Checks if a file with the specified path exists in the output location.

        Parameters:
           path (str): The path of the file.

        Returns:
           bool: True if the file exists, False otherwise.
        '''
        return self.file__repository.exists(path, self.extension)
    
    def text_to_float(self, embedding: str) -> list[float]:
        '''
        Converts a string representation of numbers to a list of floating-point numbers.

        Parameters:
           embedding (str): A string containing numbers to be converted.

        Returns:
           list: A list of floating-point numbers extracted from the input string.
        '''
        characters_to_remove = '[]'
        translation_table = str.maketrans('', '', characters_to_remove)

        numbers = embedding.split(',')

        stripped_number_array = [number.translate(
            translation_table) for number in numbers]

        number_array = [float(number) for number in stripped_number_array]

        return number_array