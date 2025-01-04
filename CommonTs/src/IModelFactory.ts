// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module IModelFactory
 * @description Factory module for creating AI model instances.
 * 
 * This module provides factory functions to create appropriate model instances
 * based on the requested model type. It supports:
 * - Default model creation through getDefaultModel()
 * - Specific model creation through getModel() based on EModel type
 * 
 * The factory ensures consistent model instantiation across the application
 * while abstracting the concrete model implementation details.
 */

// Internal imports
import { EModel, EModelProvider, IEmbeddingModelDriver, IChatModelDriver, ITextChunker } from './IModelDriver';
import { OpenAIEmbeddingModelDriver, OpenAIChatModelDriver, OpenAITextChunker } from './ModelDrivers.OAI';

/**
 * Returns the default model which is an instance of GPT4o.
 * @returns {IModel} The default model.
 */
export function getDefaultTextChunker () : ITextChunker  {

   return new OpenAITextChunker();   
}

/**
 * Returns an instance of IModel based on the provided EModel type.
 * 
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
export function getTextChunker (model: EModel, provider: EModelProvider) : ITextChunker  {

   switch (model) {
      default:
         return new OpenAITextChunker();
   }
}


/**
 * Returns an instance of IEmbeddingModelDriver for the default embedding model.
 * @returns {IEmbeddingModelDriver} The default embedding model driver.
 */

export function getDefaultEmbeddingModelDriver () : IEmbeddingModelDriver  {

   return new OpenAIEmbeddingModelDriver();   
}

/**
 * Returns an instance of IEmbeddingModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IEmbeddingModelDriver} An instance of IEmbeddingModelDriver corresponding to the specified EModel type.
 */
export function getEmbeddingModelDriver (model: EModel, provider: EModelProvider) : IEmbeddingModelDriver  {

   switch (model) {
      default:
         return new OpenAIEmbeddingModelDriver();
   }
}

export function getDefaultChatModelDriver () : IChatModelDriver  {

   return new OpenAIChatModelDriver();   
}

/**
 * Returns an instance of IChatModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IChatModelDriver} An instance of IChatModelDriver corresponding to the specified EModel type.
 */
export function getChatModelDriver (model: EModel, provider: EModelProvider) : IChatModelDriver  {

   switch (model) {
      default:
         return new OpenAIChatModelDriver();
   }
}