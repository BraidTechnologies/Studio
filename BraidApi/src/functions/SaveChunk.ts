'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Internal imports
import { defaultOkResponse, isSessionValid, sessionFailResponse } from "./Utility";
import { IStoredChunk } from '../../../BraidCommon/src/ChunkRepositoryApiTypes';
import {AzureLogger, chunkStorableAttributes, saveStorable} from './CosmosStorableApi';


/**
 * Saves a chunk record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the chunk.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the chunk data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function saveChunk(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {


   if (isSessionValid(request, context)) {

      let jsonRequest: IStoredChunk = await request.json() as IStoredChunk;

      try {
         let azureLogger = new AzureLogger (context);

         await saveStorable(jsonRequest, chunkStorableAttributes, azureLogger);
         context.log("Saved:" + jsonRequest.toString());
         return defaultOkResponse();         
      }
      catch (e: any) {
         context.error("Failed save:" + e.toString());
         return {
            status: 500,
            body: "Failed save."
         };
      }
   }
   else {
      return sessionFailResponse();
   }
};

app.http('SaveStoredChunk', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: saveChunk
});


