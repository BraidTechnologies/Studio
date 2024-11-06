// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

/**
 * Represents a classification request object with text and classifications.
 */
export interface IClassifyRequest{

   text: string;
   classifications: Array<string>;
}

/**
 * Interface for the classification response object.
 */
export interface IClassifyResponse {

   classification: string;
}