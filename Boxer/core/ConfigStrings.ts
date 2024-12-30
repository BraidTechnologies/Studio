// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module ConfigStrings
 * @description Provides constants for configuration strings used in the Boxer application.
 * 
 * This module includes strings for logging categories, font names, URLs, Azure settings, and more.
 * It also includes constants for various IDs and keys used in the application, such as session keys,
 * conversation keys, and AI model IDs.
 */

export enum EConfigStrings {

   kCoreLogCategory = "Core",
   kApiLogCategory = "API",
   kDbLogCategory = "DB",   

   kFontNameForTextWrapCalculation = "12pt Segoe UI",

   kHomeRelativeUrl= "/boxer.html",           
   
   kAzureTenantId = "b9576484-5c2e-4613-bfdf-039948cdd521",
   kAzureProductionFluidHost = "https://eu.fluidrelay.azure.com",
   kAzureLocalFluidHost = "http://localhost:7070",

   kLLMName = 'Boxer',
   kLLMNameLowerCase = 'boxer',   
   kLLMGuid = "313aafdb-a05c-4dc7-98d0-4db7f28f122f",
   kLLMRequestSignature = '@Boxer',
   kLLMRequestSignatureLowerCase = '@boxer',
   kLLMNearRequestSignature = 'Boxer',
   kLLMNearRequestSignatureLowerCase = 'boxer',   
   
   // These are applied serially - watch out for adding terms in early edits that then get replaced again later on
   // Spaces are significant
   kPromptLookFor1 = "an LLM",
   kPromptReplaceWith1 = "a Large Language Model (LLM)",
   kPromptLookFor2 = "LLMs",
   kPromptReplaceWith2 = "Large Language Models (LLMs)",   
   kPromptLookFor3 = " LLM ",
   kPromptReplaceWith3 = " Large Language Model (LLM) ",   
   kPromptLookFor4 = " LLm ",
   kPromptReplaceWith4 = " Large Language Model (LLM) ", 
   kPromptLookFor5 = " lLM ",
   kPromptReplaceWith5 = " Large Language Model (LLM) ",
   kPromptLookFor6 = " LlM ",
   kPromptReplaceWith6 = " Large Language Model (LLM) ",

   // Use these to detect questions where we are not relevant
   kResponseNotRelevantMarker = "That doesn't seem to be about AI",
   kResponseDontKnowMarker = "I don't know",   

   kErrorConnectingToKeyAPI = "Error connecting to the Boxer server.",
   kErrorConnectingToAiAPI = "Error connecting to AI server.",

   kSessionParamName = "session",
   kConversationParamName = "conversation",   
   kEmailParamName = "email",
   kNameParamName = "name",
   kSecretParamName = "secret",

   kCohort1ConversationKey = "eb948951-1b53-460e-a023-26e39895dec6",
   kCohort1Team1ConversationKey = "c43edc61-cedc-43f6-9224-db847d1ed0eb",   
   kCohort1Team2ConversationKey = "1eadf3a2-148d-4afd-b69f-c9f72e824486",
   kCohort1Team3ConversationKey = "121ffdef-ced6-45dd-84be-f16171b8b406",   
   kDemoConversationKey = "c70f4a2d-8a56-42d5-b9ce-88bdc50029c8",

   kAdminUserNames = "Jon Verrier" // Comma seperated list of names, at run time we just check if the user name is included in this list. 
};

export enum EConfigNumbers {
   kInitialHelpfulPromptDelayMsecs = 1000,
   kBoxerChattinessMessageCount = 20,
   kMaximumLinkTextlength = 40,
   kMaximumLinkTextlengthMobile = 30,   
   kHelpfulPromptMinimumGapMins = 10, // At least 10 minutes between AI suggestions
   kMessagePrompt2VBorder = 24,       // How much to allow for top + bottom inset
   kMessagePrompt2HBorder = 24,       // How much to allow for left & right inset
   kMessagePromptLineSpace = 8,       // How much to allow between lines
   kMessagePromptMaxCharacters = 2048,
   kMaxDownloadWaitSeconds = 30,
   kMaxMessagesBack = 20,          // Go up to 20 messages back for context to send to the LLM
   kMaxChatLevel = 4, // 0-4 to set how chatty the AI is
   kMinMessagesforRecap = 5 ,// 5 mesages and we offer a recap at the start,
   kSummaryLengthWords = 50
}

// This is used for local running only, as in browser we cannot access environment variables
// NEVER PUT PRODUCTION SECRETS IN HERE
let KStubEnvironmentVariables = {
   SessionKey : "49b65194-26e1-4041-ab11-4078229f478a",
   ConversationKey : "abcde"
};

export {KStubEnvironmentVariables};
   