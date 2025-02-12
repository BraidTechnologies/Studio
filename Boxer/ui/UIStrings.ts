// Copyright (c) 2024, 2025 Braid Technologies Ltd

export enum EUIStrings {

   kMaxColumnWidth = "896px",
   kJoinPagePreamble = "To join a conversation with @Boxer, you need to enter the key from your contact at Braid, pick a conversation to join, then login with LinkedIn to identify yourself.",
   kJoinConversationKeyPrompt = "Key",
   kJoinConversationKeyPlaceholder = "Key... ",  
   kJoinConversationDoesNotLookLikeKey = "It does not look like the key is valid.",
   kJoinConversationLooksLikeKeyOk = "It looks like the key is valid, you can try to join the conversation via LinkedIn.",
   kJoinConversationWithLinkedInPrompt = "Join with LinkedIn... ",  
   kJoinConversationPicker = "Select a conversation to join.",

   kCohort1ConversationName = "Cohort 1 - Paris Olympics 2024",
   kCohort1Team1ConversationName = "4x100m swim",
   kCohort1Team2ConversationName = "Triathlon",
   kCohort1Team3ConversationName = "Judo",   
   kDemoConversationName = "Demo",
   kTestConversationName = "Test", 

   kPageErrorCaption = "Error",
   
   kJoinApiError = "Sorry, we were not able to connect to the conversation.",
   kAiApiError = "Sorry, we were not able to connect to the AI.", 
   kSecretError = "Sorry, we were not able to validate end-end security in your login. Please try again. If this rekeeps happening, please ask your contact at Braid for support.",  

   kSendMessagePreamble = "Type a message below. If you want @Boxer to reply, put '@Boxer' in the message. Treat your messages as public and do not enter confidential information.",
   kNoThanks = "No thanks.",
   kLikedThis = "Click to like.",
   kDidNotLikeThis = "Click if you don't like it any more.",
   kDeleteMessage = "Delete message.",
   kSendMessagePlaceholder = "Write a message... ",  
   kMessageTextPrompt = "Ctrl+Enter to send or Esc to cancel.",
   kCopyConversationUrlButtonPrompt = "Copy the URL for this conversation to the clipboard.",
   kTrimConversationButtonPrompt = "Delete the conversation history.",
   kExitConversationButtonPrompt = "Leave this conversation.",   
   kBoxerMoreChatButtonPrompt = "Make @Boxer chattier. Currently %%1 out of %%2.",
   kBoxerLessChatButtonPrompt = "Make @Boxer less chatty. Currently %%1 out of %%2.",   
   kAiHasNoSuggestedDocuments = "No suggestions at present. Interacting with @Boxer will generate suggestions.", 
   kPomptToGetStarted = "Where is a good place to start learning about building applications with LLMs? With some examples in Python?",

   kAiNoGoodSources = "@Boxer does not have good backup for this answer. AI can make mistakes. Consider checking important information.",
   kAiContentWarning = "AI can make mistakes. Consider checking important information.",

   kLLMNameReminder = "Just checking...  if you want your request to be sent to @Boxer, include the phrase '@Boxer' in your message. With an '@' sign.",

   kLikeSignular = "like.",
   kLikePlural = "likes.",

   kWelcomeWouldYouLikeRecap = "Welcome, would you like a recap?",
   kSummarising = "Summarising ..."
};

export var initialQuestions: Array<string> = [
      "What are some common use cases for generative AI?",
      "How can Python be used to interact with an LLM?",
      "What is the purpose of tokenization in LLMs?",
      "Explain the difference between static and dynamic tokenization.",
      "How do you handle out-of-vocabulary words in tokenization?",
      "What are embeddings in the context of NLP?",
      "How do you load a pre-trained LLM in Python using Hugging Face Transformers?",
      "Describe the process of fine-tuning an LLM.",
      "What are the benefits of fine-tuning a pre-trained model?",
      "How can you generate text using GPT-3 in Python?",
      "What is the role of the `generate` function in text generation?",
      "How do you control the length of generated text in an LLM?",
      "Explain the concept of 'temperature' in text generation.",
      "What is top-k sampling in the context of LLMs?",
      "How does nucleus sampling (top-p) work in text generation?",
      "Describe beam search as a decoding strategy.",
      "What are the trade-offs between beam search and greedy decoding?",
      "How can you evaluate the quality of generated text?",
      "What are common metrics for evaluating generative models?",
      "How do you prevent an LLM from generating inappropriate content?",
      "What is the purpose of prompt engineering?",
      "How can you improve the coherence of generated text?",
      "What is zero-shot learning in LLMs?",
      "How does few-shot learning differ from zero-shot learning?",
      "Describe the role of context in text generation.",
      "How do you manage large-scale LLMs in a production environment?",
      "What are the computational challenges of training an LLM?",
      "Explain the concept of model parallelism.",
      "How can you reduce the inference time of an LLM?",
      "What is model distillation in the context of LLMs?",
      "Describe how to use the `transformers` library to implement a chatbot.",
      "What is the role of an API in interacting with an LLM?",
      "How do you secure an API endpoint for an LLM?",
      "What ethical considerations should be taken when using generative AI?",
      "How can you detect and mitigate biases in LLMs?",
      "What is the impact of training data on the performance of an LLM?",
      "How do you perform hyperparameter tuning for an LLM?",
      "Explain the role of learning rate schedules in training LLMs.",
      "How can you use Python to preprocess text data for LLM training?",
      "What are some techniques for data augmentation in NLP?",
      "How do you implement a feedback loop for improving an LLM?",
      "Describe a real-world application of generative AI.",
      "What is the significance of multilingual capabilities in LLMs?",
      "How can transfer learning benefit the deployment of LLMs in different domains?"
];
