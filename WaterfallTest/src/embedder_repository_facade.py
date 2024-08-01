# Copyright (c) 2024 Braid Technologies Ltd

from file_repository import FileRespository

class EmbeddingRespositoryFacade:
   #...
   # Class providing an interface to load, save, and existence check for files in the file system. 
   #...

   def __init__(self, output_location: str):
      self.file__repository = FileRespository (output_location)       
      self.output_location = output_location  
      self.extension = "embed.txt" 

   def save(self, path: str, text: str) -> None: 
      '''
      Save the provided text to a file at the specified path within the output location.
   
      Parameters:
         path (str): The path where the file will be saved.
         text (str): The text content to be saved in the file.
      '''   

      return self.file__repository.save (path, self.extension, text)
   
   def load (self, path: str) -> str: 
      '''
      Load content from a file based on the provided path. 
      If the file exists in the output location, its contents are read and returned as a string. 
      If the file does not exist, an empty string is returned.

      Parameters:
         path (str): The path of the file.

      Returns:
         str: The contents of the file if it exists, otherwise an empty string.
      ''' 

      return self.file__repository.load (path, self.extension)
   
   def exists (self, path: str) -> bool: 
      '''
      Checks if a file with the specified path exists in the output location.

      Parameters:
         path (str): The path of the file.

      Returns:
         bool: True if the file exists, False otherwise.
      '''
      return self.file__repository.exists (path, self.extension)

