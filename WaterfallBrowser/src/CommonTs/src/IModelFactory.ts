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
import { OpenAIEmbeddingModelDriver, OpenAIChatModelDriver, OpenAITextChunker, 
   OpenAi4oChatModelInit, OpenAiO1ChatModelInit, OpenAi4oMiniChatModelInit,
   OpenAiO1TextChunkerInit, OpenAiGpt4oTextChunkerInit, OpenAiGpt4oMiniTextChunkerInit, 
   OpenAiEmbed3EmbeddingModelInit, OpenAiEmbed3SmallEmbeddingModelInit } from './ModelDrivers.OpAi';
import { DeepSeekR1ChatModelDriver, DeepSeekR1ChatModelInit, DeepSeekR1TextChunkerInit } from './ModelDrivers.DpSk';

/**
 * Returns the default model which is an instance of GPT4o.
 * @returns {IModel} The default model.
 */
export function getDefaultTextChunker () : ITextChunker  {

   return new OpenAITextChunker(new OpenAiGpt4oTextChunkerInit());   
}

/**
 * Returns an instance of IModel based on the provided EModel type.
 * 
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
export function getTextChunker(model: EModel, provider: EModelProvider): ITextChunker {

   switch (provider) {
     case EModelProvider.kDeepSeek:
        return new OpenAITextChunker(new DeepSeekR1TextChunkerInit());

      case EModelProvider.kOpenAI:
      default:
         switch (model) {
            case EModel.kReasoning:
               return new OpenAITextChunker(new OpenAiO1TextChunkerInit());
            case EModel.kSmall:
               return new OpenAITextChunker(new OpenAiGpt4oMiniTextChunkerInit());
            case EModel.kLarge:
            default:
               return new OpenAITextChunker(new OpenAiGpt4oTextChunkerInit());
         }
   }
}

/**
 * Returns an instance of IEmbeddingModelDriver for the default embedding model.
 * @returns {IEmbeddingModelDriver} The default embedding model driver.
 */

export function getDefaultEmbeddingModelDriver () : IEmbeddingModelDriver  {

   return new OpenAIEmbeddingModelDriver(new OpenAiEmbed3EmbeddingModelInit());   
}

/**
 * Returns an instance of IEmbeddingModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IEmbeddingModelDriver} An instance of IEmbeddingModelDriver corresponding to the specified EModel type.
 */
export function getEmbeddingModelDriver (model: EModel, provider: EModelProvider) : IEmbeddingModelDriver  {

   switch (model) {
      case EModel.kSmall:
         return new OpenAIEmbeddingModelDriver(new OpenAiEmbed3SmallEmbeddingModelInit());
      case EModel.kLarge:
      case EModel.kReasoning:
      default:
         return new OpenAIEmbeddingModelDriver(new OpenAiEmbed3EmbeddingModelInit());
   }
}

export function getDefaultChatModelDriver () : IChatModelDriver  {

   return new OpenAIChatModelDriver(new OpenAi4oChatModelInit());   
}

/**
 * Returns an instance of IChatModelDriver based on the provided EModel type.
 * @param model - The EModel type to determine the model.
 * @param provider - The EModelProvider type to determine the provider.
 * @returns {IChatModelDriver} An instance of IChatModelDriver corresponding to the specified EModel type.
 */
export function getChatModelDriver(model: EModel, provider: EModelProvider): IChatModelDriver {

   switch (provider) {
      case EModelProvider.kDeepSeek:
         return new DeepSeekR1ChatModelDriver(new DeepSeekR1ChatModelInit());

      case EModelProvider.kOpenAI:
      default:
         switch (model) {
            case EModel.kReasoning:
               return new OpenAIChatModelDriver(new OpenAiO1ChatModelInit());
            case EModel.kSmall:
               return new OpenAIChatModelDriver(new OpenAi4oMiniChatModelInit());
            case EModel.kLarge:
            default:
               return new OpenAIChatModelDriver(new OpenAi4oChatModelInit());
         }
   }
}