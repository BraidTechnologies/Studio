// Copyright (c) 2024 Braid Technologies Ltd


export enum EPromptPersona {

   kArticleSummariser = "ArticleSummariser", 
   kCodeSummariser = "CodeSummariser"  
};

export interface IPromptPersona {

   name : string;
   systemPrompt: string;
   itemPrompt: string;
}


