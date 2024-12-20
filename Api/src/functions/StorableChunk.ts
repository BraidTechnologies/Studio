'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure 
// 'npm start' to run locally

/**
 * @module StorableChunk
 * @description Azure Function module that provides methods for managing storable chunks.
 * This module handles the retrieval, saving, and removal of chunk records, as well as fetching recent chunks.
 * It includes validation for session authentication and error handling for any issues encountered during the request processing.
 */

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Internal imports
import { chunkStorableAttributes } from './CosmosStorableApi';
import { findStorableApi, removeStorableApi, saveStorableApi, getStorableApi, getRecentStorablesApi } from "./AzureStorableApi";

app.http('GetChunk', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: getChunk
});

/**
 * Loads a Chunk record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and loads the Chunk.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the Chunk data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function getChunk(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   
   return getStorableApi (request, chunkStorableAttributes, context);
};

app.http('FindChunk', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: findChunk
});

/**
 * Loads a Chunk record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and loads the Chunk.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the Chunk data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function findChunk(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
   
   return findStorableApi (request, chunkStorableAttributes, context);
};

app.http('SaveChunk', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: saveChunk
});

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

   return saveStorableApi (request, chunkStorableAttributes, context);
};

app.http('RemoveChunk', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: removeChunk
});

/**
 * Asynchronously removes a chunk using the provided HTTP request and invocation context.
 * 
 * @param request - The HTTP request containing information about the chunk to be removed.
 * @param context - The invocation context for logging and error handling.
 * @returns A promise that resolves to an HttpResponseInit object representing the result of the removal operation.
 */
export async function removeChunk(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   return removeStorableApi (request, chunkStorableAttributes, context);
}

app.http('GetChunks', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: getRecentChunks
});

/**
 * Asynchronously retrieves recent chunks based on the provided HTTP request and invocation context.
 * @param request - The HTTP request object containing the necessary data.
 * @param context - The invocation context for the function execution.
 * @returns A promise that resolves to an HttpResponseInit object representing the response.
 */
export async function getRecentChunks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   return getRecentStorablesApi (request, chunkStorableAttributes, context);
}
