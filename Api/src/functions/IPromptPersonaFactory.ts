// Copyright (c) 2024 Braid Technologies Ltd


import { EPromptPersona, IPromptPersona } from "../../../CommonTs/src/IPromptPersona";

const ArticleSummariserPersona: IPromptPersona = {

   name: EPromptPersona.kArticleSummariser,
   systemPrompt: "",
   itemPrompt: ""
};

const CodeSummariserPersona: IPromptPersona = {

   name: EPromptPersona.kCodeSummariser,
   systemPrompt: "",
   itemPrompt: ""
};

export function getSummariser (persona: EPromptPersona, wordTarget: number, textToSummarise: string) : IPromptPersona {


   switch (persona) {
      case EPromptPersona.kCodeSummariser:
         let codeTemplate = CodeSummariserPersona;
         codeTemplate.systemPrompt = "You are an AI asistant that summarises code in "
         + wordTarget.toString() +
         " words or less, to help explain the code it to new developers. Please summarise the following code in "
         + wordTarget.toString() + " words. ";

         codeTemplate.itemPrompt = textToSummarise;
         return codeTemplate;

      case EPromptPersona.kArticleSummariser:
      default:

         let articleTemplate = ArticleSummariserPersona; 
         
         articleTemplate.systemPrompt = "You are an AI asistant that summarises text in "
         + wordTarget.toString() +
         " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Please summarise the following text in "
         + wordTarget.toString() + " words.  Translate to English if necessary. ";

         articleTemplate.itemPrompt = textToSummarise;
         return ArticleSummariserPersona;
   }
}