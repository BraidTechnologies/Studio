/**
 * @module EnrichedQuery
 * 
 * This module defines the core interfaces and enums for the Query API, which handles
 * enriched conversations with AI assistants. It includes:
 * 
 * - Conversation roles and elements
 * - Standard system prompts for different AI interactions
 * - Query and response interfaces for enriched conversations
 * - Structures for question generation and responses
 * 
 * The interfaces defined here are used throughout the application to maintain
 * type safety when working with AI-enriched conversations and queries.
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd
// Definitions for the data elements of the Query API

import { EChunkRepository} from "./EnrichedChunk";
import { IModelConversationElement } from "./IModelDriver";

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

/**
 * Defines the structure of an enriched query object.
 * Contains information about the repository, persona prompt, question prompt,
 * enrichment document prompt, and conversation history.
 */
export interface IEnrichedQueryRequest {

   repositoryId : EChunkRepository;
   similarityThreshold: number;
   maxCount: number;
   history: Array<IModelConversationElement>;
   question: string;
   wordTarget: number;
}

/**
 * Defines the structure of an enriched response object.
 * Contains an answer field of type string and a chunks field as an array of Relevant Enriched Chunk objects.
 */
export interface IEnrichedResponse {

   answer: string;
   chunks: Array<IRelevantEnrichedChunk>;
}

/**
 * Interface for generating questions query.
 * Contains a summary which after reading a developer might have a question
 * and a word target for the question
 */
export interface IGenerateQuestionRequest {

   summary: string;
   wordTarget: number;
}

/**
 * Defines the structure of a response object for question generation.
 * Contains a property 'question' of type string representing the generated question.
 */
export interface IQuestionGenerationResponse {

   question: string;
}
