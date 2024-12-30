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


export interface IEmbeddingModelDriver {

   embed(text: string): Promise<Array<number>>;
}