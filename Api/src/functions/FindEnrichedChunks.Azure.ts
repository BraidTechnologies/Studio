'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally

/**
 * @module FindEnrichedChunks
 * @description Azure Function module that provides methods for finding enriched chunks based on URL and summary.
 * This module handles the retrieval of enriched chunks based on specified criteria, including URL and summary,
 * and returns them in a structured format. It includes validation for session authentication
 * and error handling for any issues encountered during the request processing.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec } from "../../../CommonTs/src/EnrichedQuery.Api.Types";
import { isSessionValid, sessionFailResponse, defaultErrorResponse } from "./Utility.Azure";
import { getEnrichedChunkRepository } from "./EnrichedChunkRepositoryFactory";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";

export async function FindRelevantEnrichedChunksFromSummary(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {
         const spec: IChunkQueryRelevantToSummarySpec = (await (request.json() as any)).request as IChunkQueryRelevantToSummarySpec;

         const repository = getEnrichedChunkRepository(EChunkRepository.kWaterfall);

         const chunks = await repository.lookupRelevantFromSummary (spec);

         return {
            status: 200, // Ok
            body: JSON.stringify (chunks)
         };
      }
      catch (e) {
         context.error (e);         
         return defaultErrorResponse();
      }      
   }
   else {
      return sessionFailResponse();
   }
};

export async function FindRelevantEnrichedChunksFromUrl (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {
         const spec: IChunkQueryRelevantToUrlSpec = (await (request.json() as any)).request as IChunkQueryRelevantToUrlSpec;

         const repository = getEnrichedChunkRepository(EChunkRepository.kWaterfall);

         const chunks = await repository.lookupRelevantFromUrl (spec);

         return {
            status: 200, // Ok
            body: JSON.stringify (chunks)
         };
      }
      catch (e) {
         context.error (e);         
         return defaultErrorResponse();
      }
   }
   else {
      return sessionFailResponse();
   }
};

export async function FindEnrichedChunkFromUrl (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {
         const spec: IChunkQueryRelevantToUrlSpec = (await (request.json() as any)).request as IChunkQueryRelevantToUrlSpec;

         const repository = getEnrichedChunkRepository(EChunkRepository.kWaterfall);

         const chunk = await repository.lookupFromUrl (spec);

         return {
            status: 200, // Ok
            body: JSON.stringify (chunk)
         };
      }
      catch (e) {
         context.error (e);
         return defaultErrorResponse();
      }
   }
   else {
      return sessionFailResponse();
   }
};

app.http('FindRelevantEnrichedChunksFromSummary', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: FindRelevantEnrichedChunksFromSummary
});

app.http('FindRelevantEnrichedChunksFromUrl', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: FindRelevantEnrichedChunksFromUrl
});

app.http('FindEnrichedChunkFromUrl', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: FindEnrichedChunkFromUrl
});