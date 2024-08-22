# import os
# import logging

# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Check the API Key
# api_key = os.getenv("AZURE_OPENAI_API_KEY")
# if not api_key:
#     logger.error("API key not found in environment variables.")
# else:
#     logger.info(f"API key is found: {api_key[:4]}...")

# # Check the Resource Endpoint
# resource_endpoint = "https://braidlms.openai.azure.com/"
# logger.info(f"Resource Endpoint: {resource_endpoint}")

# # Check the Deployment Name
# deployment_name = "braidlms"
# logger.info(f"Deployment Name: {deployment_name}")

# # Check the API Version
# api_version = "2024-02-01"
# logger.info(f"API Version: {api_version}")


import os
import logging
import sys
from openai import AzureOpenAI

# Add the project root and scripts directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

# Local Modules
from common.ApiConfiguration import ApiConfiguration

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create a function to test the AzureOpenAI connection
def test_azure_openai_connection(client: AzureOpenAI, config: ApiConfiguration):
    try:
        response = client.chat.completions.create(
            model=config.azureDeploymentName,  # Use your model name, e.g., "gpt-35-turbo"
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Can you tell me a joke?"}
            ],
            temperature=0.7,
            max_tokens=config.maxTokens,
            top_p=0.0,
            frequency_penalty=0,
            presence_penalty=0,
            timeout=config.openAiRequestTimeout
        )
        print(response.choices[0].message.content)
    except Exception as e:
        logger.error(f"An error occurred: {e}")

# Initialize the configuration
config = ApiConfiguration()

# Clean up the resource endpoint (remove trailing slash if any)
if config.resourceEndpoint.endswith('/'):
    config.resourceEndpoint = config.resourceEndpoint[:-1]

# Initialize the AzureOpenAI client
client = AzureOpenAI(
    azure_endpoint=config.resourceEndpoint,
    api_key=config.apiKey.strip(),  # Ensure the API key is stripped of any whitespace
    api_version=config.apiVersion
)

# Test the Azure OpenAI connection
test_azure_openai_connection(client, config)


