'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Internal imports
import { pageStorableAttributes } from './CosmosStorableApi';
import { getStorableApiFromQuery, saveStorableApi } from "./AzureStorableApi";
import { IStorable } from "../../../CommonTs/src/IStorable";
import { IStoredPage } from "../../../CommonTs/src/PageRepositoryApi.Types";
import { decompressString } from "../../../CommonTs/src/Compress";

// A transformer function that can be applied to a storable to transform it to decompress the html field
function decompressHtml (storable: IStorable) : IStorable {

   let storedPage: IStoredPage = storable as IStoredPage;

   if (storedPage.html)
      storedPage.html = decompressString (storedPage.html);

   return storedPage;
}

// A transformer function that can be applied to a storable to transform it to send the html field as the HTTP response
function sendHtml (storable: IStorable) : HttpResponseInit {

   let storedPage: IStoredPage = storable as IStoredPage;

   return {
      status: 200,
      headers: {
         "Content-Type": "text/html"
      },
      body: storedPage.html
   };
}

app.http('GetPage', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: getPage
});

/**
 * Loads a Page record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and loads the Chunk.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the Chunk data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function getPage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   
   return await getStorableApiFromQuery (request, pageStorableAttributes, context, decompressHtml, sendHtml);
};

app.http('SavePage', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: savePage
});

/**
 * Saves a Page record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the chunk.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the chunk data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function savePage(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   return saveStorableApi (request, pageStorableAttributes, context);
};
