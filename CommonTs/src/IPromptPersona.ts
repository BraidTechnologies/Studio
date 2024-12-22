// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module IPromptPersona
 * @description Defines interfaces and enums for managing different prompt personas.
 * 
 * This module provides the core types for configuring different AI prompt personas,
 * each specialized for specific summarization tasks. It includes:
 * - EPromptPersona enum for different persona types (Article, Code, Survey)
 * - IPromptPersona interface defining the structure of a prompt persona
 * 
 * Each persona contains configuration for system-level and item-level prompting,
 * allowing for specialized behavior across different summarization contexts.
 */


export enum EPromptPersona {

   kArticleSummariser = "ArticleSummariser", 
   kCodeSummariser = "CodeSummariser",
   kSurveySummariser = "SurveySummariser"
};

export interface IPromptPersona {

   name : string;
   systemPrompt: string;
   itemPrompt: string;
}


