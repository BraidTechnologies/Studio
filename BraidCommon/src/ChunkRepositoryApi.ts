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
 * - chunkFunctionalKey: Application level key
 * - parentChunkId: Primary key to parent document
 * - originalText: Original text; 0 if undefined, it has been thrown away (as maybe it can be reconstructed)
 * - storedEmbedding: Embedding of the original text
 * - storedSummary: Summary of the original text - generated with application-specific prompt 
 * - storedTitle: A generated of the original text - generated with application-specific prompt
 * 
 */
export interface IStoredChunk extends IStorable {

   chunkFunctionalKey: string;              // Application level key
   parentChunkId: string | undefined;       // primary key to parent document
   originalText: string | undefined;        // original text - if undefined, it has been thrown way (as maybe it can be reconstructed)
   storedEmbedding: IStoredEmbedding | undefined;   // Embedding of the original text
   storedSummary: IStoredTextRendering | undefined; // Summary of the original text - generated with application specific prompt
   storedTitle: IStoredTextRendering | undefined;   // Title for the original text - generated with application specific prompt   
}

