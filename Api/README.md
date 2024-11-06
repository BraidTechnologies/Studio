**BraidApi** is a set of Azure-hosted functions. All calls to OpenAI and to the CosmoDB database are made via this layer, which includes logging, and allows us to centralize key management. 

Requires the following environment variables:

AzureAiKey
ConversationKey
SessionKey
SessionKey2
LinkedInAppId
LinkedInSecret
CosmosApiKey
