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
 * Enum representing standard prompts for an AI assistant helping an application developer understand generative AI.
 * Includes prompts for initial questions, enrichment, follow-up questions, and generating questions.
 * Each prompt provides specific instructions and limitations for the AI assistant's responses.
 */
export enum EStandardPrompts {

   kOpenAiPersonaPrompt = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. If the question is not related to building AI applications, Python, or Large Language Models (LLMs),, say 'That doesn't seem to be about AI'.",
   kEnrichmentPrompt = "You will be provided with a question about building applications that use generative AI technology. Write a 50 word summary of an article that would be a great answer to the question. Enrich the summary with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.\n",
   kFollowUpPrompt = "You will be provided with a summary of an article about building applications that use generative AI technology. Write a question of no more than 10 words that a reader might ask as a follow up to reading the article.",
   kFollowUpPrefix = "Article summary: ",
   kGenerateAQuestionPrompt = "You are an AI assistant helping an application developer understand generative AI. Based on the dialog presented as context, generate a 10 word question that is relevant to the subjects being discussed.\n"   
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
   similarityThreshold: number;
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

/**
 * Interface for generating questions query.
 * Contains persona prompt, question generation prompt, and summary fields.
 */
export interface IGenerateQuestionQuery {

   personaPrompt: string;
   questionGenerationPrompt: string;
   summary: string;
}

/**
 * Defines the structure of a response object for question generation.
 * Contains a property 'question' of type string representing the generated question.
 */
export interface IQuestionGenerationResponse {

   question: string;
}