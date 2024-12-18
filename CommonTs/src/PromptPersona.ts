// Copyright (c) 2024 Braid Technologies Ltd


import { EPromptPersona } from "./IPromptPersona";
import { IPromptPersona } from "./IPromptPersona";

export const ArticleSummariserPersona: IPromptPersona = {

   name: EPromptPersona.kArticleSummariser,
   systemPrompt: "",
   itemPrompt: ""
};

export const CodeSummariserPersona: IPromptPersona = {

   name: EPromptPersona.kCodeSummariser,
   systemPrompt: "",
   itemPrompt: ""
};