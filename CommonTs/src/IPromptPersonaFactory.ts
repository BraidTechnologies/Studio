/**
 * @module IPromptPersonaFactory
 * 
 * This module provides functionality to generate specialized AI prompt personas
 * for different types of content summarization (articles, code, surveys).
 * Each persona includes a system prompt and an item prompt tailored to the
 * specific summarization task.
 * 
 * The module exports:
 * - Predefined persona templates for summarization etc
 * - getChatPersona function to generate configured prompt personas with
 *   optional customized parameters
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd


import { IChatModelDriverParams } from "./IModelDriver";
import { EPromptPersona, IPromptPersona } from "./IPromptPersona";
import { PromptInMemoryRepository, IStoredPrompt } from "./IPromptRepository";
import { throwIfUndefined } from "./Asserts";
import Prompts from "./Prompts.json";
import { 
    // Boxer prompts
    defaultPromptId, 
    developerAssistantPromptId, 
    articleSummariserPromptId, 
    developerQuestionGeneratorPromptId, 
    developerImaginedAnswerGeneratorPromptId,  
    
    // Waterfall prompts
    articleClassifierPromptId,
    themeFinderPromptId,
    testForSummmariseFailurePromptId,
} from "./GeneratedPromptNames";

const promptRepository = new PromptInMemoryRepository(Prompts);
const defaultWordCount = 50;
const questionWordCount = 10;
const themeFinderWordCount = 1;

function postProcessPrompt(prompt: IStoredPrompt | undefined, defaultWordCount: number, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{wordCount}", defaultWordCount.toString());
      let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
      return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
   }
   throw new Error("Prompt not found");
}

function postProcessClassifierPrompt(prompt: IStoredPrompt | undefined, classifications: string, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{classifications}", classifications);
      let userPrompt = prompt.userPrompt.replace("{userInput}", userInput);
      return {userPrompt: userPrompt, systemPrompt: systemPrompt, name: prompt.personaName};
   }
   throw new Error("Prompt not found");
}

const ArticleContextSummariserPersona: IPromptPersona = {

   name: EPromptPersona.kArticleContextSummariser,
   systemPrompt: "",
   userPrompt: ""
}

const CodeSummariserPersona: IPromptPersona = {

   name: EPromptPersona.kCodeSummariser,
   systemPrompt: "",
   userPrompt: ""
};

const C4DiagrammerPersona: IPromptPersona = {

   name: EPromptPersona.kC4Diagrammer,
   systemPrompt: "",
   userPrompt: ""
};

const SurveySummariserPersona: IPromptPersona = {

   name: EPromptPersona.kSurveySummariser,
   systemPrompt: "",
   userPrompt: ""
};


export function getChatPersona(persona: EPromptPersona, userPrompt: string, params?: IChatModelDriverParams): IPromptPersona {

   let wordString = "50";
   if (params && params.wordTarget) {
      wordString = params.wordTarget.toString();
   }
   let promptParam1 = "";
   if (params && params.promptParam1) {
      promptParam1 = params.promptParam1;
   }

   let prompt: IStoredPrompt | undefined = undefined;

   switch (persona) {
      
      // Boxer Prompts   
      case EPromptPersona.kDeveloperAssistant:
         prompt = promptRepository.getPrompt(developerAssistantPromptId);
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);
       
      case EPromptPersona.kDeveloperQuestionGenerator:
         prompt = promptRepository.getPrompt(developerQuestionGeneratorPromptId);
         return postProcessPrompt(prompt, questionWordCount, userPrompt);
         
      case EPromptPersona.kDeveloperImaginedAnswerGenerator:
         prompt = promptRepository.getPrompt(developerImaginedAnswerGeneratorPromptId);
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);         

      // Waterfall Prompts
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

      // Salon Prompts
      case EPromptPersona.kSurveySummariser:
         const surveyTemplate = SurveySummariserPersona;
         surveyTemplate.systemPrompt = "You are an AI assistant that summarises survey responses in "
            + wordString +
            " words or less, to explain it to the management team that issues the survey.";
   
         surveyTemplate.userPrompt = "Please summarise the following survey result in "
   
      case EPromptPersona.kCodeSummariser:
         const codeTemplate = CodeSummariserPersona;
         codeTemplate.systemPrompt = "You are an AI assistant that summarises code to help explain the code to new developers. Please summarise the following code in "
            + wordString + " words. Make each distinct point a separate paragraph. List the important classes or functions in the module";
   
         codeTemplate.userPrompt = userPrompt;
         return codeTemplate;
   
      case EPromptPersona.kC4Diagrammer:
         const c4Template = C4DiagrammerPersona;
         c4Template.systemPrompt = "You are an AI assistant that generates a diagram in mermaid format from a description of a software system "
            + "to help explain the system to new developers.";
   
         c4Template.userPrompt = userPrompt;
         return c4Template;
   
      case EPromptPersona.kArticleContextSummariser:
         const articleContextTemplate = ArticleContextSummariserPersona;
         articleContextTemplate.systemPrompt = "You are an AI assistant that summarises text in "
            + wordString +

            " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Translate to English if necessary. Make each distinct point a separate paragraph.";
         articleContextTemplate.userPrompt = userPrompt;
         return articleContextTemplate;         
      default:
         prompt = promptRepository.getPrompt(defaultPromptId);
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);
   }
}


