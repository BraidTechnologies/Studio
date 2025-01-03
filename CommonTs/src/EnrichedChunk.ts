/**
 * @fileoverview Defines the core data structures and interfaces for the Chunk API.
 * This module contains type definitions and interfaces for enriched chunks, which are
 * fundamental units of content that can be stored, queried, and retrieved based on
 * semantic similarity. It includes specifications for both client-side summaries and
 * server-side storage formats, as well as query parameters for retrieving relevant chunks.
 * 
 * Key components:
 * - EChunkRepository: Enumeration of available chunk storage repositories
 * - IEnrichedChunk: Complete chunk representation with embeddings
 * - IEnrichedChunkSummary: simple chunk representation
 * - IChunkQuerySpec: Base query parameters for chunk retrieval
 * 
 * @module EnrichedChunk
 */

// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

// We have an ID to distinguish different Chunk repostories. 
export enum EChunkRepository {

   kBoxer = "Boxer",
   kWaterfall = "Waterfall"
};

// Default is we only consider >= 50% relevant to present to the user (GPT4 seems to generate low scores ...)
export const kDefaultSimilarityThreshold = 0.5;

/**
 * Represents a Chunk enriched with specific properties.
 * This is a summary class that can be passed between client & server. 
 * @property {string} url - The URL associated with the chunk.
 * @property {string} text - The textual content of the chunk.
 * @property {string} summary - The summary content of the chunk.
 */
export interface IEnrichedChunkSummary {

   url: string;
   text: string;
   summary: string;
}

/**
 * Represents a Chunk enriched with specific properties.
  * This is a server side class only - its for storage. 
 * @property {string} id - The unique identifier of the chunk.
 * @property {Array<number>} embedding - An array of numbers representing the embedding of the chunk.
 */
export interface IEnrichedChunk extends IEnrichedChunkSummary {

   id: string;
   embedding: number[];
}

/**
 * Represents a relevant chunk with its associated relevance score.
 */
export interface IRelevantEnrichedChunk {

   chunk: IEnrichedChunkSummary;
   relevance: number;
}

/**
 * Defines the structure of a chunk query specification object.
 * 
 * @property {EChunkRepository} repositoryId - The ID of the repository to query.
 * @property {number} maxCount - The maximum number of results to retrieve.
 * @property {number} similarityThreshold - The threshold for similarity comparison.
 */
export interface IChunkQuerySpec {

   repositoryId: EChunkRepository;
   maxCount: number;
   similarityThreshold: number;
}

/**
 * Extends the IChunkQuerySpec interface to include a 'url' property of type string.
 */
export interface IChunkQueryRelevantToUrlSpec extends IChunkQuerySpec {

   url: string;
}

/**
 * Extends the IChunkQuerySpec interface to include a 'summary' property of type string.
 */
export interface IChunkQueryRelevantToSummarySpec extends IChunkQuerySpec {

   summary: string;
}