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


import { IChatModelDriverParams } from "commonts/src/Interfaces/IModelDriver";
import { EPromptPersona, IPromptPersona , IStoredPrompt,
    GeneratedDefaultPromptNames,
    GeneratedBoxerPromptNames,
    GeneratedWaterfallPromptNames, 
    GeneratedSalonPromptNames
   } from "../entry";

import { allPromptsArray as allPrompts} from "../entry";
import { PromptInMemoryRepository} from "./IPromptRepository";
import { throwIfUndefined } from "commonts/src/Asserts";

import  ProcessPrompt  from "./helpers/ProcessPrompt";
import  ProcessClassifierPrompt  from "./helpers/ProcessClassifierPrompt";
import  ProcessC4DigarammerPrompt  from "./helpers/ProcessC4DigarammerPrompt";
import  ProcessArticleContextPrompt  from "./helpers/ProcessArticleContextPrompt";

// const allPrompts = prompts; 
const promptRepository = new PromptInMemoryRepository(allPrompts);

const defaultWordCount = 50;
/**
 * Creates a chat persona with a specific prompt persona and user input
 * @param persona The prompt persona to use
 * @param userPrompt The user input to insert into the prompt
 * @param params Optional parameters for the prompt   
 * @returns A processed prompt persona with placeholders replaced
 */
export function getChatPersona(persona: keyof typeof EPromptPersona, userPrompt: string, params?: IChatModelDriverParams): IPromptPersona {

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
         prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames.eveloperAssistantPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);
       
      case EPromptPersona.kDeveloperQuestionGenerator:
         prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames.developerQuestionGeneratorPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);
         
      case EPromptPersona.kDeveloperImaginedAnswerGenerator:
         prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames.developerImaginedAnswerGeneratorPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);         

      // Waterfall Prompts
      case EPromptPersona.kArticleSummariser:
         throwIfUndefined(params?.wordTarget);             
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.articleSummariserPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);

      case EPromptPersona.kArticleClassifier:
         throwIfUndefined(params?.classifications);
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.articleClassifierPromptId);
         return ProcessClassifierPrompt(prompt, params.classifications, userPrompt);       

      case EPromptPersona.kThemeFinder:
         throwIfUndefined(params?.wordTarget);         
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.themeFinderPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);

      case EPromptPersona.kTestForSummariseFail:
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.testForSummmariseFailurePromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);  

      case EPromptPersona.kSurveySummariser:
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.surveySummariserPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt); 

      // Salon Prompts         
      case EPromptPersona.kCodeSummariser:
         prompt = promptRepository.getPrompt(GeneratedSalonPromptNames.codeSummariserPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt); 
   
      case EPromptPersona.kC4Diagrammer:
         prompt = promptRepository.getPrompt(GeneratedSalonPromptNames.c4DiagrammerPromptId);
         return ProcessC4DigarammerPrompt(prompt, c4DiagramType, userPrompt);
   
      case EPromptPersona.kArticleContextSummariser:
         throwIfUndefined(params?.chunk);
         throwIfUndefined(params?.document);
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.articleContextSummariserPromptId);
         return ProcessArticleContextPrompt(prompt, wordTarget, params?.chunk, params?.document);   

      case EPromptPersona.kDeveloperQuestionGenerator:
         prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames.developerQuestionGeneratorPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);

      case EPromptPersona.kDeveloperAssistant:
         prompt = promptRepository.getPrompt(GeneratedBoxerPromptNames.developerAssistantPromptId);
         return ProcessPrompt(prompt, defaultWordCount, userPrompt);

      case EPromptPersona.kArticleSummariser:
         throwIfUndefined(params?.wordTarget);             
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.articleSummariserPromptId);
         return ProcessPrompt(prompt, params.wordTarget, userPrompt);

      case EPromptPersona.kArticleClassifier:
         throwIfUndefined(params?.classifications);
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.articleClassifierPromptId);
         return ProcessClassifierPrompt(prompt, params.classifications, userPrompt);       

      case EPromptPersona.kThemeFinder:
         throwIfUndefined(params?.wordTarget);         
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.themeFinderPromptId);
         return ProcessPrompt(prompt, params.wordTarget, userPrompt);

      case EPromptPersona.kTestForSummariseFail:
         prompt = promptRepository.getPrompt(GeneratedWaterfallPromptNames.testForSummmariseFailurePromptId);
         return ProcessPrompt(prompt, defaultWordCount, userPrompt);                 

      default:
         prompt = promptRepository.getPrompt(GeneratedDefaultPromptNames.defaultPromptId);
         return ProcessPrompt(prompt, wordTarget, userPrompt);
   }
}


