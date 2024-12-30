'use strict';
// Copyright Braid Technologies Ltd, 2024

/**
 * @module Embed
 * @description Azure Function module that provides text embedding capabilities using Azure AI services.
 * This module handles the conversion of text into numerical vector representations (embeddings),
 * with support for automatic text summarization when input exceeds the model's context window.
 * It includes retry logic for rate limiting and network errors, and validates session authentication
 * for all requests.
 */

// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { isSessionValid, sessionFailResponse, defaultErrorResponse, invalidRequestResponse } from "./Utility";
import { getDefaultModel, } from "../../../CommonTs/src/IModelFactory";
import { recursiveSummarize } from "./Summarize";
import { IEmbedRequest, IEmbedResponse } from "../../../CommonTs/src/EmbedApi.Types";
import { getEmbeddingModelDriver } from "../../../CommonTs/src/IModelFactory";

const model = getDefaultModel();
const driver = getEmbeddingModelDriver(model.implementsModel);

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
         const jsonRequest = await request.json();
         context.log(jsonRequest);
         const spec = (jsonRequest as any).request as IEmbedRequest;
         text = spec.text;

         if ((text && text.length > 0)) {

            // If the text is bigger than available context, we have to summarise it
            if (!model.fitsInEmbeddingChunk(text)) {
               text = await recursiveSummarize(spec.persona, text, 0, model.embeddingChunkSize)

               context.log("Summarised to fit in maximum chunk.");
            }

            const embeddingResponse : IEmbedResponse = {
               embedding: await driver.embed(text)
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
