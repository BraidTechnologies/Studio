# Copyright (c) 2024 Braid Technologies Ltd

# Standard library imports
import os

azure = False    
gemini = True              

if azure:
   API_TYPE = "Azure" 
   API_KEY = os.getenv("AZURE_OPENAI_API_KEY")  
   API_VERSION = "2024-02-01" #AZURE VERSION WAS "2023-07-01-preview"
   RESOURCE_ENDPOINT = "https://braidlms.openai.azure.com/" 
elif gemini:
    API_TYPE = "Gemini"
    API_KEY = os.getenv("GEMINI_API_KEY")
    API_VERSION = "v1"  # Gemini API version
    RESOURCE_ENDPOINT = "https://api.gemini.google.com/v1"
else:
   API_TYPE = "open_ai" #AZURE VERSION WAS "Azure"
   API_KEY = os.environ["OPENAI_API_KEY"] 
   API_VERSION = "2020-11-07" #AZURE VERSION WAS "2023-07-01-preview"
   RESOURCE_ENDPOINT = "https://api.openai.com/v1" 



class ApiConfiguration:
    def __init__(self) -> None:
        if azure:
            self.apiType = "Azure"
        elif gemini:
            self.apiType = "Gemini"
        else:
            self.apiType = "open_ai"
        self.apiKey = API_KEY
        self.apiVersion = API_VERSION
        self.resourceEndpoint = RESOURCE_ENDPOINT
        self.azureDeploymentName = "braidlms"
        self.azureEmbedDeploymentName="braidlmse"
        self.modelName="gpt-4"      
        self.embedModelName="text-embedding-ada-002"
        self.processingThreads = 4
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