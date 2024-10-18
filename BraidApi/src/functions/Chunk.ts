'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { getDefaultModel } from "../../../BraidCommon/src/IModelFactory";
import { IChunkRequest, IChunkResponse } from "../../../BraidCommon/src/ChunkApi.Types"
import { sessionFailResponse, defaultErrorResponse } from "./Utility";
import { isSessionValid } from "./Utility";

let model = getDefaultModel();

/**
 * Splits the input text into chunks based on the specified chunk size and overlap words.
 * 
 * @param text The text to be chunked.
 * @param chunkSize The size of each chunk.
 * @param overlapWords The number of overlapping words between consecutive chunks.
 * @returns An array of strings representing the text divided into chunks.
 */
function chunkText(text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string> {

   let chunks = model.chunkText(text, chunkSize, overlapWords);

   return chunks;
}

/**
 * Asynchronous function to chunk text based on the requested session key and input text.
 * 
 * @param request - The HTTP request object containing the text to be chunked.
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the chunks or an error message.
 */ 

export async function chunk(request: HttpRequest, context: InvocationContext): Promise < HttpResponseInit > {

   let text: string | undefined = undefined;
   let overlapWords : number | undefined = undefined;
   let chunkSize : number | undefined = undefined;   
   let chunks = new Array<string>();

   if (isSessionValid(request, context)) {

      try {
         let jsonRequest = await request.json();
         context.log(jsonRequest);

         let spec = (jsonRequest as any).request as IChunkRequest;
         text = spec.text;
         chunkSize = spec.chunkSize;         
         overlapWords = spec.overlapWords;         

         if (text)
            chunks = chunkText(text, chunkSize, overlapWords);

         let body: IChunkResponse = {
            chunks: chunks
         }

         context.log (body)
         return {
            status: 200, // Ok
            body: JSON.stringify(body)
         };
      }
      catch(error: any) {

         context.error ("Error chunking text:", error);
         return defaultErrorResponse();
      }
   }
   else {
      context.error ("Session validation failed.");      
      return sessionFailResponse();
   }
};

app.http('Chunk', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: chunk
});

