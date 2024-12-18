// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Summarise API

import { EPromptPersona } from "./IPromptPersona";
/**
 * Defines the structure of a summarise request object.
 */
export interface ISummariseRequest{
   
   persona: EPromptPersona;
   text: string;
   lengthInWords?: number | undefined;
}

/**
 * Defines the structure of a summarise response object.
 */
export interface ISummariseResponse {

   summary: string;
}