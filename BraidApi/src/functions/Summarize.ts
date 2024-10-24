'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { getDefaultModel } from "../../../BraidCommon/src/IModelFactory";
import { isSessionValid, sessionFailResponse, defaultErrorResponse, invalidRequestResponse } from "./Utility";
import { ISummariseRequest, ISummariseResponse } from "../../../BraidCommon/src/SummariseApi.Types";

let minimumTextLength = 64;
let model = getDefaultModel();

/**
 * Splits the input text into chunks of maximum size defined by the model
 * 
 * @param text The text to be chunked.
 * @param overlapwords - how may words to put in overlap of chunks
 * @returns An array of strings, each representing a chunk of the input text.
 */
function chunkText(text: string, overlapWords: number): Array<string> {

   let chunks = model.chunkText(text, undefined, overlapWords);

   return chunks;
}

/**
 * Asynchronously summarizes the given text using an AI assistant.
 * 
 * @param text The text to be summarized.
 * @param words The number of words to use for the summary.
 * @returns A Promise that resolves to the summarized text.
 */
async function singleShotSummarize(text: string, words: number): Promise<string> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   let wordString = Math.floor (words).toString();
   let content = "You are an AI asistant that summarises text in "
      + wordString +
      " words or less. You ignore text that look like to be web page navigation, javascript, or other items that are not the main body of the text. Please summarise the following text in "
      + wordString + " words.  Translate to English if necessary. "
   console.log(content)

   let response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: [
         {
            role: 'system',
            content: content
         },
         {
            role: 'user',
            content: text
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
 * @param text The text to be summarized.
 * @param level The current level of recursion.
 * @param words The maximum number of words in the summary.
 * @returns A Promise that resolves to the generated summary string.
 */
export async function recursiveSummarize(text: string, level: number, words: number): Promise<string> {

   let overallSummary: string | undefined = undefined;
   let chunks = chunkText(text, 0);
   let summaries = new Array<string>();

   let recursizeSummarySize = model.contextWindowSize / 5 / 10; // 5 tokens per word, and we compress by a factor of 10

   if (chunks.length > 1) {
      // If the text was > threshold, we break it into chunks.
      // Here we look over each chunk to generate a summary for each
      for (var i = 0; i < chunks.length; i++) {

         let summary = await singleShotSummarize(chunks[i], recursizeSummarySize);
         summaries.push(summary);
      }
   }
   else {
      let summary = await singleShotSummarize(chunks[0], words);
      summaries.push(summary);
   }

   // If we made multiple summaries, we join them all up 
   if (chunks.length > 1) {
      let joinedSummaries = summaries.join(" ");
      overallSummary = await recursiveSummarize(joinedSummaries, level + 1, words);
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
         let jsonRequest = await request.json();
         context.log(jsonRequest);

         let summariseSpec = (jsonRequest as any).request as ISummariseRequest;

         text = summariseSpec.text;
         words = summariseSpec.lengthInWords ? Math.floor(Number(summariseSpec.lengthInWords)) : 50;

         if (text && text.length >= minimumTextLength && words > 0) {
            let definitelyText: string = text;
            overallSummary = await recursiveSummarize(definitelyText, 0, words);

            let summariseResponse: ISummariseResponse = {
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

