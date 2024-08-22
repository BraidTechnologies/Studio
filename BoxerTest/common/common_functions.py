# Standard library imports
import os
from openai import AzureOpenAI

from common.ApiConfiguration import ApiConfiguration

config = ApiConfiguration()

def ensure_directory_exists(directory):
    """
    Checks if the directory at the given destination exists.
    If it does not exist, creates the directory.

    Parameters:
    directory (str): The path to the directory.
    """
    # Use os.path.join() to handle path construction across different platforms
    if not os.path.exists(directory):
        os.makedirs(directory)
        #print(f"Directory '{directory}' created.")  #  can remove or comment out this print statement for production
    else:
        # print(f"Directory '{directory}' already exists.")
        pass

# Construct the path using os.path.join() for cross-platform compatibility
HTML_DESTINATION_DIR = os.path.join("data", "web")
ensure_directory_exists(HTML_DESTINATION_DIR)

def get_embedding(text : str, client : AzureOpenAI, config : ApiConfiguration):

   text = text.replace("\n", " ")
   response = client.embeddings.create(input = [text], 
                                   model=config.azureEmbedDeploymentName,
                                   timeout=config.openAiRequestTimeout)
   
   return response.data[0].embedding


