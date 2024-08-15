'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

let minimumTextLength = 64;

/**
 * Asynchronous function to find a common theme from a number of paragraphs of text.
 * Makes a POST request to an Azure endpoint to get the most common theme in the provided text.
 * Utilizes axios for HTTP requests and axiosRetry for up to 5 retries in case of rate limit errors.
 * @param text The text containing paragraphs to analyze for a common theme.
 * @returns A Promise that resolves to the most common theme found in the text.
 */
async function findTheme (text: string) : Promise <string> {

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
            content: "You are an AI asistant that finds a common theme from a number of pararaphs of text in 15 words or less. Please find the most common theme in the following text in 15 words. Translate to English if necessary. "
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
export async function FindTheme(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let requestedSession : string | undefined = undefined;     
    let text : string | undefined = undefined;   
    let overallSummary : string | undefined = undefined; 

    for (const [key, value] of request.query.entries()) {
        if (key === 'session')
            requestedSession = value;                
    }

    let jsonRequest = await request.json();     

    if ((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) {  

      text = (jsonRequest as any)?.data?.text;

      if (!text || text.length < minimumTextLength) {
         overallSummary = "Sorry, not enough text to find a theme."
      }
      else {

         let definitelyText: string = text;
         overallSummary = await findTheme (definitelyText);         
       }
       context.log("Passed session key validation:" + requestedSession);     

       return {
          status: 200, // Ok
          body: overallSummary
       };         
    }
    else 
    {
        context.log("Failed session key validation:" + requestedSession);  

        return {
           status: 401, // Unauthorised
           body: "Authorization check failed."
        };             
    }
};

app.http('FindTheme', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: FindTheme
});

