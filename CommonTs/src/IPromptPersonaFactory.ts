/**
 * @module IPromptPersonaFactory
 * 
 * This module provides functionality to generate specialized AI prompt personas
 * for different types of content summarization (articles, code, surveys).
 * Each persona includes a system prompt and an item prompt tailored to the
 * specific summarization task.
 * 
 * The module exports:
 * - Predefined persona templates for Article, Code, and Survey summarization
 * - getSummariser function to generate configured prompt personas with
 *   customized word count targets
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd


import { IChatModelDriverParams } from "./IModelDriver";
import { EPromptPersona, IPromptPersona } from "./IPromptPersona";
import { PromptInMemoryRepository, IStoredPrompt } from "./IPromptRepository";
import Prompts from "./Prompts.json";

const promptRepository = new PromptInMemoryRepository(Prompts);
const defaultWordCount = 50;

function postProcessPrompt(prompt: IStoredPrompt | undefined, defaultWordCount: number, userInput: string): IPromptPersona {

   if (typeof prompt !== "undefined") {   
      let systemPrompt = prompt.systemPrompt.replace("{wordCount}", defaultWordCount.toString());
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

const TestForSummariseFailPersona: IPromptPersona = {

   name: EPromptPersona.kTestForSummariseFail,
   systemPrompt: "",
   userPrompt: ""
};

const ClassifierPersona: IPromptPersona = {

   name: EPromptPersona.kClassifier,
   systemPrompt: "",
   userPrompt: ""
};

const ThemeFinderPersona: IPromptPersona = {

   name: EPromptPersona.kThemeFinder,
   systemPrompt: "",
   userPrompt: ""
};

const DeveloperQuestionGeneratorPersona: IPromptPersona = {

   name: EPromptPersona.kDeveloperQuestionGenerator,
   systemPrompt: "",
   userPrompt: ""
};

const DeveloperImaginedAnswerGeneratorPersona: IPromptPersona = {

   name: EPromptPersona.kDeveloperImaginedAnswerGenerator,
   systemPrompt: "",
   userPrompt: ""
};

export function getChatPersona(persona: EPromptPersona, userPrompt: string, params: IChatModelDriverParams): IPromptPersona {

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

      case EPromptPersona.kSurveySummariser:
         const surveyTemplate = SurveySummariserPersona;
         surveyTemplate.systemPrompt = "You are an AI assistant that summarises survey responses in "
            + wordString +
            " words or less, to explain it to the management team that issues the survey.";

         surveyTemplate.userPrompt = "Please summarise the following survey result in "
            + wordString + " words. Make each distinct point a separate paragraph.\n\n## The Survey##\n\n" + userPrompt;
         return surveyTemplate;

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

      case EPromptPersona.kTestForSummariseFail:
         const testForSummariseFailTemplate = TestForSummariseFailPersona;
         testForSummariseFailTemplate.systemPrompt = "You are an AI assistant that reviews the work of a summariser. The summariser occasionally cannot find the main body of the text to summarise. The summariser may apologise for this, or may say there is not enough relevant information to summarise, or may state the text contains only web page navigation, all of which are failed summaries.";
         testForSummariseFailTemplate.userPrompt = " Please review the following summary and reply 'No' if the summariser has not been able to create a good summary of a body of text, otherwise reply 'Yes'." +
            + userPrompt;
         return testForSummariseFailTemplate;

      case EPromptPersona.kClassifier:
         const classifierTemplate = ClassifierPersona;
         classifierTemplate.systemPrompt = "You are an assistant that can classify text into one of the following subjects: "
            + promptParam1 + "."
         classifierTemplate.userPrompt = "Try to classify the subject of the following text. The classification is a single word from the list "
            + promptParam1
            + ". If you cannot classify it well, answer 'Unknown'." + userPrompt;
         return classifierTemplate;

      case EPromptPersona.kThemeFinder:
         const themeFinderTemplate = ThemeFinderPersona;
         themeFinderTemplate.systemPrompt = "You are an AI assistant that finds a common theme from a number of paragraphs of text in "
            + wordString + " words or less."
         themeFinderTemplate.userPrompt = "Please find the most common theme in the following text in "
            + wordString + " words. Do not start your reply with the phrase 'The most common theme in the text is'. Translate to English if necessary. "
            + "## The Text ##\n\n" + userPrompt;
         return themeFinderTemplate;

      case EPromptPersona.kDeveloperQuestionGenerator:
         const developerQuestionGeneratorTemplate = DeveloperQuestionGeneratorPersona;
         developerQuestionGeneratorTemplate.systemPrompt = "You are an AI assistant that generates a question after a developer has read an article about AI. The question is a single sentence of no more than 10 words. The question is one that the developer might ask as a follow up to reading the article. The question must be about generative AI or LLMs.";
         developerQuestionGeneratorTemplate.userPrompt = userPrompt;
         return developerQuestionGeneratorTemplate;

      case EPromptPersona.kDeveloperImaginedAnswerGenerator:
         const developerImaginedAnswerGeneratorTemplate = DeveloperImaginedAnswerGeneratorPersona;
         developerImaginedAnswerGeneratorTemplate.systemPrompt = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You will be provided with a question about building applications that use generative AI technology. Write a "
            + wordString + " word summary of an article that would be a great answer to the question. Enrich the summary with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n";
         developerImaginedAnswerGeneratorTemplate.userPrompt = userPrompt;
         return developerImaginedAnswerGeneratorTemplate;

      case EPromptPersona.kArticleContextSummariser:
         const articleContextTemplate = ArticleContextSummariserPersona;
         articleContextTemplate.systemPrompt = "You are an AI assistant that summarises text in "
            + wordString +
            " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Translate to English if necessary. Make each distinct point a separate paragraph.";
         articleContextTemplate.userPrompt = userPrompt;
         return ArticleContextSummariserPersona;

      case EPromptPersona.kDeveloperAssistant:
         prompt = promptRepository.getPrompt("4761bf88-9329-4bd0-95ca-dc3bc70b6d4d");
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);

      case EPromptPersona.kArticleSummariser:
         prompt = promptRepository.getPrompt("716c667d-9074-4d9a-8335-3194212eba90");
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);

      default:
         prompt = promptRepository.getPrompt("3983ba1b-895d-46fe-a47e-e4230b06c0d6");
         return postProcessPrompt(prompt, defaultWordCount, userPrompt);
   }
}


