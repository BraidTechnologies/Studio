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

// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Query API

import { EChunkRepository, IRelevantEnrichedChunk} from "./EnrichedChunk";
import { IModelConversationElement } from "./IModelDriver";


/**
 * Defines the structure of an enriched query object.
 * Contains information about the repository, persona prompt, question prompt,
 * enrichment document prompt, and conversation history.
 */
export interface IEnrichedQuery {

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
export interface IGenerateQuestionQuery {

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