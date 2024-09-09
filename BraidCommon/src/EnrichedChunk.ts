// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

// For now there is only one sort of chunk repository. In future there may be new ones so we have an ID to distinguish them. 
export enum EChunkRepository {

   kBoxer = "Boxer"
};

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

export interface IChunkQuerySpec {

   repositoryId: EChunkRepository;
   maxCount: number;
   similarityThreshold: number;
}

export interface IChunkQueryRelevantToUrlSpec extends IChunkQuerySpec {

   url: string;
}

export interface IChunkQueryRelevantToSummarySpec extends IChunkQuerySpec {

   summary: string;
}