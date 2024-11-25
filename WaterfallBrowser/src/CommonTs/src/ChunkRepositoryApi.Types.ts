// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the ChunkRepository API

import { IStorable} from "./IStorable";

/**
 * Represents an interface for storing embeddings with a model ID and an array of numbers representing the embedding.
 */
export interface IStoredEmbedding {

   modelId: string;
   embedding: Array<number>;
};

/**
 * Defines the structure of a stored text rendering object.
 */
export interface IStoredTextRendering {

   modelId: string;
   text: string;
};

/**
 * Interface representing a chunk of data.
 * 
 * Core data for a chunk:
 * - parentChunkId: Primary key to parent document
 * - originalText: Original text; 0 if undefined, it has been thrown away (as maybe it can be reconstructed)
 * - url: string | undefined;                 // url to external resource, can be null  
 * - storedEmbedding: Embedding of the original text
 * - storedSummary: Summary of the original text - generated with application-specific prompt 
 * - storedTitle: A generated of the original text - generated with application-specific prompt
 * - related: Array of IDs to related chunks
 */
export interface IStoredChunk extends IStorable {

   parentChunkId: string | undefined;       // primary key to parent document
   originalText: string | undefined;        // original text - if undefined, it has been thrown way (as maybe it can be reconstructed)
   url: string | undefined;                 // url to external resource, can be null  
   storedEmbedding: IStoredEmbedding | undefined;   // Embedding of the original text
   storedSummary: IStoredTextRendering | undefined; // Summary of the original text - generated with application specific prompt
   storedTitle: IStoredTextRendering | undefined;   // Title for the original text - generated with application specific prompt   
   relatedChunks: Array <string> | undefined;       // An optional array of related chunks - often the full set that was pulled from a parent document
}
