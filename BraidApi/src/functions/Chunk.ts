'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { getDefaultModel } from "../../../BraidCommon/src/IModelFactory";
import { sessionFailResponse, defaultErrorResponse } from "./Utility";
import { isSessionValid } from "./Utility";

let model = getDefaultModel();

/**
 * Splits the input text into chunks of maximum size defined by the model
 * 
 * @param text The text to be chunked.
 * @returns An array of strings, each representing a chunk of the input text.
 */
function chunkText(text: string): Array<string> {

   let chunks = model.chunkText(text);

   return chunks;
}

/**
 * Asynchronous function to summarize text based on the requested session key and input text.
 * 
 * @param request - The HTTP request object containing the text to be summarized.
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the summarized text or an error message.
 */ 

export async function chunk(request: HttpRequest, context: InvocationContext): Promise < HttpResponseInit > {

   let text: string | undefined = undefined;
   let chunks = new Array<string>();

   if (isSessionValid(request, context)) {

      try {
         let jsonRequest = await request.json();

         text = (jsonRequest as any)?.data?.text;

         if (text)
            chunks = chunkText(text);

         return {
            status: 200, // Ok
            body: JSON.stringify(chunks)
         };
      }
      catch(error: any) {

         context.error ("Error chunking text:", error);
         return defaultErrorResponse();
      }
   }
   else {
      return sessionFailResponse();
   }
};

app.http('Chunk', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: chunk
});

