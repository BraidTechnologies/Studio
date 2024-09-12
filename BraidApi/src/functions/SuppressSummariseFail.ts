'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { isSessionValid, sessionFailResponse } from "./Utility";

let minimumTextLength = 64;

/**
 * Asynchronous function to find a common theme from a number of paragraphs of text.
 * Makes a POST request to an Azure endpoint to get the most common theme in the provided text.
 * Utilizes axios for HTTP requests and axiosRetry for up to 5 retries in case of rate limit errors.
 * @param text The text containing paragraphs to analyze for a common theme.
 * @param length The length for the theme text to return.
 * @returns A Promise that resolves to the most common theme found in the text.
 */
async function suppressSummariseFailCall(text: string, length: number): Promise<string> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   let response = await axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
      messages: [
         {
            role: 'system',
            content: "You are an AI asistant that reviews the work of a summariser. The summariser occasionally cannot find the main body of the text to summarise. The summariser may apologise for this, or may say there is not enough relevant information to summarise, or may state the text contains only web page navigation, all of which are failed summaries."
               + " Please review the following summary and reply 'No' if the summariser has not been able to create a good summary of a body of text, otherwise reply 'Yes'."
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
 * Finds a theme from the provided text based on certain criteria.
 * Validates the session key and returns an HTTP response with the theme summary or an authorization error message.
 * @param request - The HTTP request containing the text and session key.
 * @param context - The invocation context for logging and validation.
 * @returns A promise of an HTTP response with the theme summary or an authorization error message.
 */
export async function suppressSummariseFail(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;
   let length: number | undefined = undefined;
   let overallSummary: string | undefined = undefined;
   const defaultLength = 15;

   let jsonRequest = await request.json();

   if (isSessionValid(request, context)) {

      text = (jsonRequest as any)?.data?.text;
      length = (jsonRequest as any)?.data?.length;

      if (!text || text.length < minimumTextLength) {
         overallSummary = "No"
      }
      else {

         let definitelyText: string = text;
         let definitelyLength: number = length ? length : defaultLength;
         overallSummary = await suppressSummariseFailCall(definitelyText, definitelyLength);
      }

      return {
         status: 200, // Ok
         body: overallSummary
      };
   }
   else {
      return sessionFailResponse();
   }
};

app.http('SuppressSummariseFail', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: suppressSummariseFail
});
