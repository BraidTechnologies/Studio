/**
 * @module IModelDrivers.OAI
 * 
 * This module provides OpenAI-specific implementations for embedding model drivers.
 * It includes functionality to calculate text embeddings using Azure OpenAI services.
 * 
 * Key components:
 * - OpenAIEmbeddingModelDriver: Implementation of IEmbeddingModelDriver for OpenAI
 * - calculateEmbedding: Utility function to compute embeddings via Azure OpenAI API
 * 
 */

// Copyright (c) 2024 Braid Technologies Ltd

import axios from 'axios';
import axiosRetry from 'axios-retry';

// Internal imports
import { IEmbeddingModelDriver, IChatModelDriver, IModelConversationElement, IModelConversationPrompt, EModelConversationRole } from './IModelDriver';
import { EPromptPersona } from './IPromptPersona';
import { getChatPersona } from "./IPromptPersonaFactory";

interface OpenAIChatElement {
   role: string;
   content: string;
}

let modelType = "OpenAI";

/**
 * Class representing an OpenAI embedding model driver.
 * Implements the IEmbeddingModelDriver interface.
 * 
 * @method embed
 * @param {string} text - The text to be embedded.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of numbers representing the embedding.
 * @throws {Error} Throws an error if the method is not implemented.
 */
export class OpenAIEmbeddingModelDriver implements IEmbeddingModelDriver {

   getDrivenModelType(): string {
      return modelType;
   }

   embed(text: string): Promise<Array<number>> {
      return calculateEmbedding(text);
   }
}


/**
 * Asynchronously calculates the embedding for the given text using the Azure AI service.
 * 
 * @param text The text for which the embedding needs to be calculated.
 * @returns A Promise that resolves to an array of numbers representing the calculated embedding.
 */
export async function calculateEmbedding(text: string): Promise<Array<number>> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   try {
      const response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioEmbeddingLarge/embeddings?api-version=2024-06-01', {
         input: text,
      },
         {
            headers: {
               'Content-Type': 'application/json',
               'api-key': process.env.AzureAiKey
            }
         }
      );

      const embedding = response.data.data[0].embedding as Array<number>;

      return (embedding);

   }
   catch (error) {
      console.error(error);
      throw error;
   }
}

/**
 * Class representing a driver for OpenAI chat models.
 * Implements the IChatModelDriver interface to provide methods for
 * retrieving the model type and generating responses to conversation prompts.
 */
export class OpenAIChatModelDriver implements IChatModelDriver {


   getDrivenModelType(): string {
      return modelType;
   }

   generateResponse(persona: EPromptPersona, words: number, prompt: IModelConversationPrompt): Promise<IModelConversationElement> {
      return chat(persona, words, prompt);
   }
}

/**
 * Asynchronously generates a chat response using the Azure OpenAI service.
 * 
 * @param persona The type of persona (ArticleSummariser, CodeSummariser, or SurveySummariser) to use for the response
 * @param words The target number of words for the response
 * @param prompt The conversation prompt containing the system and user messages
 * @returns A Promise that resolves to a model conversation element containing the LLM response
 */

async function chat(persona: EPromptPersona, words: number, prompt: IModelConversationPrompt): Promise<IModelConversationElement> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   const summariser = getChatPersona(persona, words, prompt.prompt);

   const systemPrompt = summariser.systemPrompt;
   const userPrompt = summariser.itemPrompt;

   let messages: Array<OpenAIChatElement> = [];

   messages.push({
      role: 'system',
      content: systemPrompt
   });

   for (const message of prompt.history) {
      messages.push({
         role: message.role,
         content: message.content
      });
   }

   messages.push({
      role: 'user',
      content: userPrompt
   });

   try {
      const response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
         messages: messages
      },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      });

      return {role: EModelConversationRole.kAssistant, 
         content: response.data.choices[0].message.content};
   }
   catch (error) {
      console.error(error);
      throw error;
   }

}
