// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

// For now there is only one sort of chunk repository. In future there may be new ones so we have an ID to distinguish them. 
export enum EChunkRepository {

   kBoxer = "Boxer"
};

// Default is we only consider >= 85% relevant to present to the user
export const kDefaultSimilarityThreshold = 0.85;

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