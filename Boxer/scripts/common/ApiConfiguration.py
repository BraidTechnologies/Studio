# Copyright (c) 2024 Braid Technologies Ltd

# Standard library imports
import os

azure = True                  

if azure:
   API_TYPE = "Azure" #AZURE VERSION WAS "Azure"
   # API_KEY = os.environ["AZURE_OPENAI_API_KEY"] #AZURE VERSION WAS os.environ["AZURE_OPENAI_API_KEY"]           #uncomment if code breaks - changes for script to exectable on both Windows and Unix machines.  
   API_KEY = os.getenv("AZURE_OPENAI_API_KEY")  # Use os.getenv() to safely retrieve environment variables       #comment if code breaks  - changes for script to exectable on both Windows and Unix machines. 
   API_VERSION = "2024-06-01" #AZURE VERSION WAS "2023-07-01-preview"
   RESOURCE_ENDPOINT = "https://studiomodels.openai.azure.com:443" #AZURE VERSION WAS os.environ["AZURE_OPENAI_ENDPOINT"] 
else:
   API_TYPE = "open_ai" #AZURE VERSION WAS "Azure"
   API_KEY = os.environ["OPENAI_API_KEY"] #AZURE VERSION WAS os.environ["AZURE_OPENAI_API_KEY"] 
   API_VERSION = "2020-11-07" #AZURE VERSION WAS "2023-07-01-preview"
   RESOURCE_ENDPOINT = "https://api.openai.com/v1" #AZURE VERSION WAS os.environ["AZURE_OPENAI_ENDPOINT"] 



class ApiConfiguration:
    def __init__(self) -> None:
        self.apiKey = API_KEY
        self.apiVersion = API_VERSION
        self.resourceEndpoint = RESOURCE_ENDPOINT
        self.azureDeploymentName = "StudioLarge"
        self.azureEmbedDeploymentName="StudioEmbeddingLarge"
        self.modelName="gpt-35-turbo-16k"
        self.embedModelName="text-embedding-ada-002"
        self.processingThreads = 1
        self.openAiRequestTimeout = 60
        self.summaryWordCount = 50      # 50 word summary
        self.chunkDurationMins = 10     # 10 minute long video clips
        self.maxTokens = 4096           # Upper limit on total tokens in an API call. 10 minutes of video = 600 words = 2400 tokens, plus approx 2x headroom
        self.discardIfBelow = 100       # Dont index if less than 100 tokens in an article

    apiType: str
    apiKey: str
    apiVersion: str
    resourceEndpoint: str
    azureDeploymentName: str
    azureEmbedDeploymentName: str
    modelName: str
    embedModelName: str
    processingThreads: int
    openAiRequestTimeout: int
    summaryWordCount: int
    chunkDurationMins: int
    maxTokens: int
    discardIfBelow: int 



