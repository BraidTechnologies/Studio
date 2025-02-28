/**
 * @module IPromptPersonaFactory
 * 
 * This module provides a factory for creating specialized AI prompt personas used in different
 * conversational contexts. It loads prompt templates from multiple sources (Default, Boxer,
 * Waterfall, Salon) and provides functionality to:
 * 
 * - Create personas for article summarization and classification
 * - Generate code documentation and C4 diagrams
 * - Assist with developer questions and answers
 * - Process survey responses and find themes
 * 
 * Each persona is configured with system and user prompts that can be customized with
 * parameters like word count limits and specific classifications.
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd


import { IChatModelDriverParams } from "./IModelDriver";
import { EPromptPersona, IPromptPersona } from "./IPromptPersona";
import { PromptInMemoryRepository, IStoredPrompt } from "./IPromptRepository";
import { throwIfUndefined } from "./Asserts";

import DefaultPrompts from "./Default.Prompts.json";
import BoxerPrompts from "./Boxer.Prompts.json"; 
import WaterfallPrompts from "./Waterfall.Prompts.json";
import SalonPrompts from "./Salon.Prompts.json";
import { 
    defaultPromptId
} from "./GeneratedDefaultPromptNames";

import { 
   developerAssistantPromptId, 
   developerQuestionGeneratorPromptId, 
   developerImaginedAnswerGeneratorPromptId,  
} from "./GeneratedBoxerPromptNames";

import { 
   articleClassifierPromptId,
   articleSummariserPromptId,
   themeFinderPromptId,
   testForSummmariseFailurePromptId,
   surveySummariserPromptId,
   articleContextSummariserPromptId
} from "./GeneratedWaterfallPromptNames";

import {
   codeSummariserPromptId,
   c4DiagrammerPromptId
} from "./GeneratedSalonPromptNames";

const allPrompts = [...DefaultPrompts, ...BoxerPrompts, ...WaterfallPrompts, ...SalonPrompts];
const promptRepository = new PromptInMemoryRepository(allPrompts);

const defaultWordCount = 50;

/**
 * Post-processes a stored prompt by replacing placeholders with actual values
 * @param prompt The stored prompt template to process
 * @param wordCount The default word count to use in the prompt
 * @param userInput The user input to insert into the prompt
 * @returns A processed prompt persona with placeholders replaced
 * @throws Error if the prompt is not found
 */

function postProcessPrompt(prompt: IStoredPrompt | undefined, wordCount: number, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{wordCount}", wordCount.toString());
      let userPrompt = prompt.userPrompt.replace("{userInput}", userInput).replace("{wordCount}", wordCount.toString());
      return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
   }
   throw new Error("Prompt not found");
}

/**
 * Post-processes a classifier prompt by replacing classification and input placeholders
 * @param prompt The stored prompt template to process
 * @param classifications The classification categories to use
 * @param userInput The user input to classify
 * @returns A processed prompt persona with placeholders replaced
 * @throws Error if the prompt is not found
 */
function postProcessClassifierPrompt(prompt: IStoredPrompt | undefined, classifications: string, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{classifications}", classifications);
      let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
      return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
   }
   throw new Error("Prompt not found");
}

/**
 * Post-processes a C4 diagrammer prompt by replacing the user input and C4 diagram type placeholders
 * @param prompt The stored prompt template to process
 * @param c4DiagramType The type of C4 diagram to generate
 * @param userInput The user input to insert into the prompt
 * @returns A processed prompt persona with placeholders replaced
 */
function postProcessC4DiagrammerPrompt(prompt: IStoredPrompt | undefined, c4DiagramType: string, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let userPrompt = prompt.userPrompt.replace("{userInput}", userInput).replace("{C4DiagramType}", c4DiagramType);
      return {userPrompt: userPrompt, systemPrompt: prompt.systemPrompt, name: prompt.personaName};
   }
   throw new Error("Prompt not found");
}

function postProcessArticleContextPrompt(prompt: IStoredPrompt | undefined, wordCount: number, chunk: string, document: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{wordCount}", wordCount.toString());
      let userPrompt = prompt.userPrompt.replace("{chunk}", chunk).replace("{document}", document).replace("{wordCount}", wordCount.toString());
      return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
   }  
   throw new Error("Prompt not found");
}

/**
 * Creates a chat persona with a specific prompt persona and user input
 * @param persona The prompt persona to use
 * @param userPrompt The user input to insert into the prompt
 * @param params Optional parameters for the prompt   
 * @returns A processed prompt persona with placeholders replaced
 */
export function getChatPersona(persona: EPromptPersona, userPrompt: string, params?: IChatModelDriverParams): IPromptPersona {

   let wordTarget = defaultWordCount;
   if (params && params.wordTarget) {
      wordTarget = params.wordTarget;
   }
   let promptParam1 = "";
   if (params && params.promptParam1) {
      promptParam1 = params.promptParam1;
   }
   let c4DiagramType = "";
   if (params && params.c4DiagramType) {
      c4DiagramType = params.c4DiagramType;
   }
   let chunk = "";
   if (params && params.chunk) {
      chunk = params.chunk;
   }
   let document = "";
   if (params && params.document) {
      document = params.document;
   }

   let prompt: IStoredPrompt | undefined = undefined;
   switch (persona) {
      
      // Boxer Prompts   
      case EPromptPersona.kDeveloperAssistant:
         prompt = promptRepository.getPrompt(developerAssistantPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);
       
      case EPromptPersona.kDeveloperQuestionGenerator:
         prompt = promptRepository.getPrompt(developerQuestionGeneratorPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);
         
      case EPromptPersona.kDeveloperImaginedAnswerGenerator:
         prompt = promptRepository.getPrompt(developerImaginedAnswerGeneratorPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);         

      // Waterfall Prompts
      case EPromptPersona.kArticleSummariser:
         throwIfUndefined(params?.wordTarget);             
         prompt = promptRepository.getPrompt(articleSummariserPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);

      case EPromptPersona.kArticleClassifier:
         throwIfUndefined(params?.classifications);
         prompt = promptRepository.getPrompt(articleClassifierPromptId);
         return postProcessClassifierPrompt(prompt, params.classifications, userPrompt);       

      case EPromptPersona.kThemeFinder:
         throwIfUndefined(params?.wordTarget);         
         prompt = promptRepository.getPrompt(themeFinderPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);

      case EPromptPersona.kTestForSummariseFail:
         prompt = promptRepository.getPrompt(testForSummmariseFailurePromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);  

      case EPromptPersona.kSurveySummariser:
         prompt = promptRepository.getPrompt(surveySummariserPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt); 

      // Salon Prompts         
      case EPromptPersona.kCodeSummariser:
         prompt = promptRepository.getPrompt(codeSummariserPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt); 
   
      case EPromptPersona.kC4Diagrammer:
         prompt = promptRepository.getPrompt(c4DiagrammerPromptId);
         return postProcessC4DiagrammerPrompt(prompt, c4DiagramType, userPrompt);
   
      case EPromptPersona.kArticleContextSummariser:
         throwIfUndefined(params?.chunk);
         throwIfUndefined(params?.document);
         prompt = promptRepository.getPrompt(articleContextSummariserPromptId);
         return postProcessArticleContextPrompt(prompt, wordTarget, params?.chunk, params?.document);   

      case EPromptPersona.kDeveloperQuestionGenerator:
         prompt = promptRepository.getPrompt(developerQuestionGeneratorPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);

      case EPromptPersona.kDeveloperAssistant:
         prompt = promptRepository.getPrompt(developerAssistantPromptId);
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);

      case EPromptPersona.kArticleSummariser:
         throwIfUndefined(params?.wordTarget);             
         prompt = promptRepository.getPrompt(articleSummariserPromptId);
         return postProcessPrompt(prompt, params.wordTarget, userPrompt);

      case EPromptPersona.kArticleClassifier:
         throwIfUndefined(params?.classifications);
         prompt = promptRepository.getPrompt(articleClassifierPromptId);
         return postProcessClassifierPrompt(prompt, params.classifications, userPrompt);       

      case EPromptPersona.kThemeFinder:
         throwIfUndefined(params?.wordTarget);         
         prompt = promptRepository.getPrompt(themeFinderPromptId);
         return postProcessPrompt(prompt, params.wordTarget, userPrompt);

      case EPromptPersona.kTestForSummariseFail:
         prompt = promptRepository.getPrompt(testForSummmariseFailurePromptId);
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);                 

      default:
         prompt = promptRepository.getPrompt(defaultPromptId);
         return postProcessPrompt(prompt, wordTarget, userPrompt);
   }
}


