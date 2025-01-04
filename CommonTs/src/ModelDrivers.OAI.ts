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
import { EModel, EModelProvider, IEmbeddingModelDriver, IChatModelDriver, IModelConversationElement, IModelConversationPrompt, EModelConversationRole, IChatModelDriverParams, ITextChunker} from './IModelDriver';
import { EPromptPersona } from './IPromptPersona';
import { getChatPersona } from "./IPromptPersonaFactory";
import { InvalidParameterError } from './Errors';

import GPT4Tokenizer from 'gpt4-tokenizer';

interface OpenAIChatElement {
   role: string;
   content: string;
}

const tokenizer = new GPT4Tokenizer({ type: 'gpt3' });

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

   deploymentName : string = "Embed-3";  
   drivenModelType: EModel = EModel.kLarge;
   drivenModelProvider: EModelProvider = EModelProvider.kOpenAI;

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


   deploymentName : string = "GTP4o";
   drivenModelType: EModel = EModel.kLarge;
   drivenModelProvider: EModelProvider = EModelProvider.kOpenAI;

   generateResponse(persona: EPromptPersona, prompt: IModelConversationPrompt, 
      params: IChatModelDriverParams): Promise<IModelConversationElement> {

      return chat(persona, prompt, params);
   }
}

/**
 * Asynchronously generates a chat response using the Azure OpenAI service.
 * 
 * @param persona The type of persona (ArticleSummariser, CodeSummariser, or SurveySummariser) to use for the response
 * @param prompt The conversation prompt containing the system and user messages
 * @param params The parameters for the prompt
 * @returns A Promise that resolves to a model conversation element containing the LLM response
 */

async function chat(persona: EPromptPersona, prompt: IModelConversationPrompt, 
   params: IChatModelDriverParams): Promise<IModelConversationElement> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   const summariser = getChatPersona(persona, prompt.prompt, params);

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

/**
 * GPT4 class implementing ITextChunker interface.
 * Represents a model with specific deployment settings and context window sizes.
 */
export class OpenAITextChunker implements ITextChunker {

   drivenModelProvider: EModelProvider = EModelProvider.kOpenAI;

   defaultChunkSize: number;
   maximumChunkSize: number;
   embeddingChunkSize: number;
   defaultChunkSizeWithBuffer: number;
   maximumChunkSizeWithBuffer: number;
   embeddingChunkSizeWithBuffer: number;

   implementsModel: EModel = EModel.kLarge;

   public constructor() {

      this.defaultChunkSize = 8192;
      this.maximumChunkSize = 65536;
      this.embeddingChunkSize = 8191;
      this.defaultChunkSizeWithBuffer = (8192 - 256)
      this.embeddingChunkSizeWithBuffer = (8191 - 256)
      this.maximumChunkSizeWithBuffer = (65536 - 256)      
   }

   /**
    * Checks if the given text fits within the context window size with buffer.
    * 
    * @param text The text to check if it fits within the context window size with buffer.
    * @returns True if the text fits within the context window size with buffer, false otherwise.
    */
   fitsInDefaultChunk(text: string): boolean {

      let estimatedTokens = tokenizer.estimateTokenCount(text);

      if (estimatedTokens < this.defaultChunkSizeWithBuffer)
         return true;
      return false;
   }

   /**
    * Checks if the given text fits within the maximum context window size with buffer.
    * 
    * @param text The text to check if it fits within the context window size with buffer.
    * @returns True if the text fits within the context window size with buffer, false otherwise.
    */
   fitsInMaximumChunk(text: string): boolean {

         let estimatedTokens = tokenizer.estimateTokenCount(text);
   
         if (estimatedTokens < this.maximumChunkSizeWithBuffer)
            return true;
         return false;
      }

   /**
    * Checks if the given text fits within the embedding context window size with buffer.
    * 
    * @param text The text to check if it fits within the context window size with buffer.
    * @returns True if the text fits within the context window size with buffer, false otherwise.
    */
   fitsInEmbeddingChunk(text: string): boolean {

      let estimatedTokens = tokenizer.estimateTokenCount(text);

      if (estimatedTokens < this.embeddingChunkSizeWithBuffer)
         return true;
      return false;
   }      
   
   /**
    * Splits the input text into chunks based on the specified overlap of words.
    * 
    * @param text The text to be chunked.
    * @param overlapWords The number of overlapping words between consecutive chunks. If undefined, we chunk with no obverlap. 
    * @returns An array of strings representing the chunked text.
    */
   chunkText(text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string> {

      let effectiveChunkSize = chunkSize
         ? Math.min(this.defaultChunkSizeWithBuffer, chunkSize)
         : this.defaultChunkSizeWithBuffer;

      if (overlapWords) {

         if (overlapWords > effectiveChunkSize)
            throw new InvalidParameterError ("Overlap window size cannot be bigger than chunk size")

         // If the users requests overlapping chunks, we divide the text into pieces the size of the overlap, then glue them back
         // together until we fill a buffer. 
         let chunked = tokenizer.chunkText(text, Math.floor(overlapWords * 2));
         let chunks = new Array<string>();

         let workingBufferText = "";
         let workingBufferTokens = 0;
         let lastChunkText = "";
         let lastChunkTokens = 0;

         for (let i = 0; i < chunked.length; i++) {

            let thisChunkText = chunked[i].text;
            let thisChunkTokens = tokenizer.estimateTokenCount(thisChunkText);

            if (workingBufferTokens + thisChunkTokens < effectiveChunkSize) {
               // If we are within buffer size, we just accumulate
               workingBufferText = workingBufferText + thisChunkText;
               workingBufferTokens = workingBufferTokens + thisChunkTokens;
            }
            else {
               // If we are outside buffer, we save the current chunk and build the start of the next one
               chunks.push(workingBufferText);

               workingBufferText = lastChunkText + thisChunkText
               workingBufferTokens = lastChunkTokens + thisChunkTokens;
            }

            // If we have reached the last chunk, we have to save it. 
            if (i === chunked.length - 1) {
               chunks.push(workingBufferText);
            }

            lastChunkTokens = thisChunkTokens;
            lastChunkText = thisChunkText;
         }
         return chunks;
      }
      else {
         let chunked = tokenizer.chunkText(text, effectiveChunkSize);

         let chunks = new Array<string>();

         for (let i = 0; i < chunked.length; i++) {
            chunks.push(chunked[i].text);
         }
         return chunks;
      }
   }

   /**
    * Estimates the number of tokens in the provided text using the tokenizer.
    * 
    * @param text The text for which to estimate the number of tokens.
    * @returns The estimated number of tokens in the text.
    */
   estimateTokens(text: string): number {

      return tokenizer.estimateTokenCount(text);
   }
}