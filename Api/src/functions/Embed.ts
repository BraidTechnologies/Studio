'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { isSessionValid, sessionFailResponse, defaultErrorResponse, invalidRequestResponse } from "./Utility";
import { getDefaultModel } from "../../../CommonTs/src/IModelFactory";
import { recursiveSummarize } from "./Summarize";
import { IEmbedRequest, IEmbedResponse } from "../../../CommonTs/src/EmbedApi.Types";

let model = getDefaultModel();

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


   let response = await axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioEmbeddingLarge/embeddings?api-version=2024-06-01', {
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
export async function embed(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let text: string | undefined = undefined;

   if (isSessionValid(request, context)) {

      try {
         let jsonRequest = await request.json();
         context.log(jsonRequest);
         let spec = (jsonRequest as any).request as IEmbedRequest;
         text = spec.text;

         if ((text && text.length > 0)) {

            // If the text is bigger than available context, we have to summarise it
            if (!model.fitsInContext(text)) {
               text = await recursiveSummarize(spec.persona, text, 0, model.contextWindowSize)

               context.log("Summarised");
            }

            let embeddingResponse : IEmbedResponse = {
               embedding: await calculateEmbedding(text)
            };

            return {
               status: 200, // Ok
               body: JSON.stringify(embeddingResponse)
            };
         }
         else {
            context.error("Error embedding text:");
            return invalidRequestResponse("Text not provided.");
         }         
      }
      catch (e: any) {
         context.error("Error embedding text:", e);
         return defaultErrorResponse();
      }   
   }
   else {
      context.error ("Sessionvalidation failed.");         
      return sessionFailResponse();
   }
};

app.http('Embed', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: embed
});
