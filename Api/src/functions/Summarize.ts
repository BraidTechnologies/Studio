'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally
/**
 * @module Summarize
 * 
 * This module provides functionality for text summarization using AI models.
 * It handles chunking large texts, processing them through AI models, and
 * generating concise summaries based on different personas (article, code, survey).
 * 
 * Key features:
 * - Splits large texts into processable chunks with configurable overlap
 * - Supports multiple summarization personas for different content types
 * - Handles rate limiting and retries for API calls
 * - Validates input text length and session requirements
 * 
 * Deployment:
 * - 'func azure functionapp publish Braid-Api' to publish to Azure
 * - 'npm start' to run locally
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { getDefaultModel } from "../../../CommonTs/src/IModelFactory";
import { isSessionValid, sessionFailResponse, defaultErrorResponse, invalidRequestResponse } from "./Utility";
import { ISummariseRequest, ISummariseResponse } from "../../../CommonTs/src/SummariseApi.Types";
import { getSummariser } from "./IPromptPersonaFactory";
import { EPromptPersona } from "../../../CommonTs/src/IPromptPersona";

const minimumTextLength = 64;
const model = getDefaultModel();

/**
 * Splits the input text into chunks of maximum size defined by the model
 * 
 * @param text The text to be chunked.
 * @param overlapwords - how may words to put in overlap of chunks
 * @returns An array of strings, each representing a chunk of the input text.
 */
function chunkText(text: string, overlapWords: number): Array<string> {

   const chunks = model.chunkText(text, undefined, overlapWords);

   return chunks;
}

/**
 * Asynchronously summarizes the given text using an AI assistant.
 * 
 * @param persona - The persona to use for the summarisation
 * @param text The text to be summarized.
 * @param words The number of words to use for the summary.
 * @returns A Promise that resolves to the summarized text.
 */
async function singleShotSummarize(persona: EPromptPersona, text: string, words: number): Promise<string> {

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

/**
 * Asynchronously generates a recursive summary of the input text based on the specified level and word limit.
 * 
 * @param persona - The persona to use for the summarisation
 * @param text The text to be summarized.
 * @param level The current level of recursion.
 * @param words The maximum number of words in the summary.
 * @returns A Promise that resolves to the generated summary string.
 */
export async function recursiveSummarize(persona: EPromptPersona, text: string, level: number, words: number): Promise<string> {

   let overallSummary: string | undefined = undefined;
   const chunks = chunkText(text, 0);
   const summaries = new Array<string>();

   const recursizeSummarySize = model.defaultChunkSize / 5 / 10; // 5 tokens per word, and we compress by a factor of 10

   if (chunks.length > 1) {
      // If the text was > threshold, we break it into chunks.
      // Here we look over each chunk to generate a summary for each
      for (let i = 0; i < chunks.length; i++) {

         const summary = await singleShotSummarize(persona, chunks[i], recursizeSummarySize);
         summaries.push(summary);
      }
   }
   else {
      const summary = await singleShotSummarize(persona, chunks[0], words);
      summaries.push(summary);
   }

   // If we made multiple summaries, we join them all up 
   if (chunks.length > 1) {
      const joinedSummaries = summaries.join(" ");
      overallSummary = await recursiveSummarize(persona, joinedSummaries, level + 1, words);
   }
   else {
      overallSummary = summaries[0];
   }

   return overallSummary;
}

/**
 * Asynchronous function to summarize text based on the requested session key and input text.
 * 
 * @param request - The HTTP request object containing the text to be summarized.
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the summarized text or an error message.
 */
export async function summarize(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let words: number = 50;
   let overallSummary: string | undefined = undefined;

   if (isSessionValid(request, context)) {

      try {
         const jsonRequest = await request.json();
         context.log(jsonRequest);

         const summariseSpec = (jsonRequest as any).request as ISummariseRequest;

         text = summariseSpec.text;
         words = summariseSpec.lengthInWords ? Math.floor(Number(summariseSpec.lengthInWords)) : 50;
         const persona = summariseSpec.persona;

         if (text && text.length >= minimumTextLength && words > 0) {
            const definitelyText: string = text;
            overallSummary = await recursiveSummarize(persona, definitelyText, 0, words);

            const summariseResponse: ISummariseResponse = {
               summary: overallSummary
            }

            context.log(summariseResponse);

            return {
               status: 200, // Ok
               body: JSON.stringify(summariseResponse)
            };
         }
         else {
            context.error("Text is below minimum length or invalid length for summary.");
            return invalidRequestResponse("Text is below minimum length or invalid length for summary.")
         }
      }
      catch (e: any) {
         context.error(e);
         return defaultErrorResponse();
      }
   }
   else {
      context.error("Session validation failed.");
      return sessionFailResponse();
   }
};

app.http('Summarize', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: summarize
});

