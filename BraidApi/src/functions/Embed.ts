'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

/**
 * Asynchronously calculates the embedding for the given text using the Azure AI service.
 * 
 * @param text The text for which the embedding needs to be calculated.
 * @returns A Promise that resolves to an array of numbers representing the calculated embedding.
 */
async function CalculateEmbedding (text: string) : Promise <Array<number>> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }      
   });

   let response = await axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlmse/embeddings?api-version=2024-02-01', {
         input: text,
      },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   let embedding = response.data.data[0].embedding as Array<number>;     

   return (embedding);   
}


/**
 * Embed function processes a request to embed text data using CalculateEmbedding function.
 * 
 * @param request - The HTTP request containing the text data to embed.
 * @param context - The context object for logging and validation.
 * @returns A Promise that resolves to an HTTP response with the embedding or an authorization error.
 */
export async function Embed (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    let requestedSession : string | undefined = undefined;     
    let text : string | undefined = undefined; 
    let classifications : Array<string> | undefined = undefined;  

    for (const [key, value] of request.query.entries()) {
        if (key === 'session')
            requestedSession = value;                
    }

    let jsonRequest = await request.json();
    context.log(jsonRequest);      
    text = (jsonRequest as any)?.data?.text;   

    if (((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) 
      && (text && text.length > 0)) {  

       let embedding = await CalculateEmbedding (text);
       context.log("Passed session key validation:" + requestedSession);     

       return {
          status: 200, // Ok
          body: JSON.stringify (embedding) 
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

app.http('Embed', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Embed
});
