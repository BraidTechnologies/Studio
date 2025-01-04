/**
 * @module IModelDriver
 * 
 * This module defines the core interfaces and enums for model-driven conversations.
 * It provides the fundamental types used to structure conversations between users
 * and AI models, including role definitions and conversation formats.
 * 
 * The module includes:
 * - EModelConversationRole: Enum for different conversation participant roles
 * - IModelConversationElement: Interface for individual conversation messages
 * - IModelConversationPrompt: Interface for complete conversation contexts
 */

// Copyright (c) 2024 Braid Technologies Ltd

/**
 * Enum representing different sizes of a model.
 * 
 * @enum {string}
 */
export enum EModel {

   kSmall = "Small", 
   kLarge = "Large"  
};

/**
 * Enum representing different providers of a model.
 * 
 * @enum {string}
 */
export enum EModelProvider {

   kOpenAI = "OpenAI"
}

import { EPromptPersona } from './IPromptPersona';
/**
 * Enum representing the roles in a conversation with a model.
 * 
 * @enum {string} EModelConversationRole
 * @property {string} kSystem - System message role
 * @property {string} kAssistant - Assistant message role
 * @property {string} kUser - User message role
 */
export enum EModelConversationRole {

   kSystem = "system",
   kAssistant = "assistant",
   kUser = "user"
};


/**
 * Defines the structure of a conversation element.
 */
export interface IModelConversationElement {
   role: EModelConversationRole,
   content: string
}

/**
 * Defines the structure of a conversation prompt used for model interactions.
 * This interface encapsulates both the conversation history and the current prompt.
 * 
 * @interface IModelConversationPrompt
 * @property {Array<IModelConversationElement>} history - Array of previous conversation elements 
 *           including system messages, user inputs, and assistant responses
 * @property {string} prompt - The current prompt or query to be processed by the model
 */
export interface IModelConversationPrompt {
   history: Array<IModelConversationElement>;
   prompt: string;
}

/**
 * Interface for drivers that provide text embedding capabilities.
 * Text embeddings are vector representations of text that capture semantic meaning,
 * allowing for operations like semantic search and similarity comparisons.
 * 
 * @interface IEmbeddingModelDriver
 */
export interface IEmbeddingModelDriver {

   deploymentName : string;
   drivenModelType: EModel;
   drivenModelProvider: EModelProvider;
   
   
    /**
     * Converts text into a vector embedding representation.
     * 
     * @param {string} text - The input text to be embedded
     * @returns {Promise<Array<number>>} A promise that resolves to an array of numbers 
     *         representing the text embedding vector
     */
    embed(text: string): Promise<Array<number>>;
}

export interface IChatModelDriverParams {
   wordTarget?: number | undefined;
   promptParam1?: string | undefined;
}

/**
 * Interface for drivers that provide chat model capabilities.
 * 
 * @interface IChatModelDriver
 */
export interface IChatModelDriver {

   deploymentName : string;
   drivenModelType: EModel;
   drivenModelProvider: EModelProvider;

   /**
    * Generates a response to a given conversation prompt.
    * 
    * @param {EPromptPersona} persona - The persona to use for the response
    * @param {IModelConversationPrompt} prompt - The conversation prompt to be processed
    * @param {IChatModelDriverParams} params - The parameters for the prompt (optional)
    * @returns {Promise<IModelConversationElement>} A promise that resolves to the generated response
    */
   generateResponse(persona: EPromptPersona, 
      prompt: IModelConversationPrompt, 
      params?: IChatModelDriverParams): Promise<IModelConversationElement>;
}

/**
 * Represents an interface for text chunking apsects of a model provider
 * @interface
 */
export interface ITextChunker {

   drivenModelProvider: EModelProvider;

   defaultChunkSize : number;
   maximumChunkSize : number;
   embeddingChunkSize : number;
   fitsInDefaultChunk(text: string): boolean;
   fitsInMaximumChunk(text: string): boolean;
   fitsInEmbeddingChunk(text: string): boolean;
   chunkText (text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string>;
   estimateTokens (text: string): number;
}