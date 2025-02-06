/**
 * @fileoverview Type definitions for the Classification API
 * Contains interfaces for classification requests and responses used in the text classification system.
 * These types ensure type safety when making classification API calls and handling responses.
 * 
 * @module ClassifyApi.Types
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd
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