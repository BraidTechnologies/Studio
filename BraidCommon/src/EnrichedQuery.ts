// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Query API

import { EChunkRepository, IRelevantEnrichedChunk} from "./EnrichedChunk";


/**
 * Defines the structure of a conversation element.
 */
export enum EConversationRole {

   kSystem = "system",
   kAssistant = "assistant",
   kUser = "user"
};


/**
 * Defines the structure of a conversation element.
 */
export interface IConversationElement {
   role: EConversationRole,
   content: string
}

/**
 * Defines the structure of an enriched query object.
 * Contains information about the repository, persona prompt, question prompt,
 * enrichment document prompt, and conversation history.
 */
export interface IEnrichedQuery {

   repositoryId : EChunkRepository;
   personaPrompt: string;
   enrichmentDocumentPrompt: string;
   history: Array<IConversationElement>;
   question: string;
}

/**
 * Defines the structure of an enriched response object.
 * Contains an answer field of type string and a chunks field as an array of Relevant Enriched Chunk objects.
 */
export interface IEnrichedResponse {

   answer: string;
   chunks: Array<IRelevantEnrichedChunk>;
}