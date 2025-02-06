'use strict';
// Copyright Braid Technologies Ltd, 2024

/**
 * @module Chunk
 * @description Azure Function that provides text chunking capabilities. This module splits input text
 * into smaller, manageable chunks with configurable size and overlap settings. It's designed to work
 * with authenticated sessions and returns chunked text as part of the Braid API infrastructure.
 * 
 * Usage:
 * - Deployed via 'func azure functionapp publish Braid-Api'
 * - Local development via 'func start'
 * 
 * The chunking process respects session validation and handles errors appropriately,
 * returning standardized API responses.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { getDefaultTextChunker } from "../../../CommonTs/src/IModelFactory";
import { IChunkRequest, IChunkResponse } from "../../../CommonTs/src/ChunkApi.Types"
import { sessionFailResponse, defaultErrorResponse } from "./Utility.Azure";
import { isSessionValid } from "./Utility.Azure";

const chunker = getDefaultTextChunker();

/**
 * Splits the input text into chunks based on the specified chunk size and overlap words.
 * 
 * @param text The text to be chunked.
 * @param chunkSize The size of each chunk.
 * @param overlapWords The number of overlapping words between consecutive chunks.
 * @returns An array of strings representing the text divided into chunks.
 */
function chunkText(text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string> {

   const chunks = chunker.chunkText(text, chunkSize, overlapWords);

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
         const jsonRequest = await request.json();
         context.log(jsonRequest);

         const spec = (jsonRequest as any).request as IChunkRequest;
         text = spec.text;
         chunkSize = spec.chunkSize;         
         overlapWords = spec.overlapWords;         

         if (text)
            chunks = chunkText(text, chunkSize, overlapWords);

         const body: IChunkResponse = {
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

