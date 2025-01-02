// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Summarise API
/**
 * @module SummariseApi.Types
 * @description Defines the data types and interfaces used by the Summarise API.
 * 
 * This module contains the interfaces that define the structure of:
 * - Summarisation requests and responses
 * - Configuration options for summary generation
 * 
 * These types support the SummariseApi module in providing type-safe
 * text summarisation operations.
 */

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