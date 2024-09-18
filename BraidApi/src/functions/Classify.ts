'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { isSessionValid, sessionFailResponse } from "./Utility";

/**
 * Decodes the initial classification string to a human-readable format.
 * 
 * @param initial - The initial classification string to decode.
 * @returns The decoded classification in a human-readable format, or "Unknown" if not found.
 */
function decodeClassification(initial: string, classifications: Array<string>): string {

   for (let i = 0; i < classifications.length; i++) {
      if (initial.includes(classifications[i])) {
         if (classifications[i] === "CurrentAffairs")
            return "Current Affairs";
         return classifications[i];
      }
   }

   return "Unknown";
}

/**
 * Asynchronously classifies the given text into one of the predefined subject areas using an AI assistant.
 * 
 * @param text The text to be classified.
 * @returns A Promise that resolves to a string representing the classification result.
 */
async function singleShotClassify(text: string, classifications: Array<string>): Promise<string> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   let response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: [
         {
            role: 'system',
            content: "You are an asistant that can classify text into one of the following subjects: "
               + classifications.join(",") + "."
               + "Try to classify the subject of the following text. The classification is a single word from the list "
               + classifications.join(",")
               + ". If you cannot classify it well, answer 'Unknown'."
         },
         {
            role: 'user',
            content: text
         }
      ]
   },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   let decoded = decodeClassification(response.data.choices[0].message.content, classifications);

   return (decoded);
}


/**
 * Handles the classification of text based on the provided session key and text content.
 * 
 * @param request - The HTTP request object containing the query parameters and JSON data.
 * @param context - The invocation context for logging and other context-specific operations.
 * @returns A Promise that resolves to an HTTP response with the classification result or an error message.
 */
export async function classify(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let classifications: Array<string> | undefined = undefined;

   let jsonRequest = await request.json();
   text = (jsonRequest as any)?.data?.text;
   classifications = (jsonRequest as any)?.data?.classifications;

   if ((isSessionValid(request, context))
      && (text && text.length > 0)
      && (classifications && classifications.length > 0)) {

      let summaryClassification = await singleShotClassify(text, classifications);

      return {
         status: 200, // Ok
         body: summaryClassification
      };
   }
   else {
      return sessionFailResponse();
   }
};

app.http('Classify', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: classify
});
