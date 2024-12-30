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

import { IEmbeddingModelDriver, IChatModelDriver, IModelConversationElement, IModelConversationPrompt } from './IModelDriver';
import { EPromptPersona } from './IPromptPersona';
import { getSummariser } from "./IPromptPersonaFactory";

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

export class OpenAIChatModelDriver implements IChatModelDriver {

   generateResponse(persona: EPromptPersona, words: number, prompt: IModelConversationPrompt): Promise<IModelConversationElement> {
      return chat(persona, prompt.prompt, words);
   }
}

/**
 * Asynchronously summarizes the given text using an AI assistant.
 * 
 * @param persona - The persona to use for the chat
 * @param text The text to be summarized.
 * @param words The number of words to use for the summary.
 * @returns A Promise that resolves to the new conversation element.
 */
async function chat (persona: EPromptPersona, text: string, words: number): Promise<IModelConversationElement> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   const summariser = getSummariser(persona, words, text);

   const systemPrompt = summariser.systemPrompt;
   const userPrompt = summariser.itemPrompt;

   console.log(systemPrompt)

   const response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: [
         {
            role: 'system',
            content: systemPrompt
         },
         {
            role: 'user',
            content: userPrompt
         }
      ],
   },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   return (response.data.choices[0].message.content);
}
