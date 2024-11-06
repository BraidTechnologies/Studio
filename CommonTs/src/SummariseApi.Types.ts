// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Summarise API

/**
 * Defines the structure of a summarise request object.
 */
export interface ISummariseRequest{

   text: string;
   lengthInWords?: number | undefined;
}

/**
 * Defines the structure of a summarise response object.
 */
export interface ISummariseResponse {

   summary: string;
}