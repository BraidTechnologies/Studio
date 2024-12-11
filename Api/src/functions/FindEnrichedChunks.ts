'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec } from "../../../CommonTs/src/EnrichedChunk";
import { isSessionValid, sessionFailResponse, defaultErrorResponse } from "./Utility";
import { getEnrichedChunkRepository } from "./EnrichedChunkRepositoryFactory";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";
export async function FindRelevantEnrichedChunksFromSummary(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {
         let spec: IChunkQueryRelevantToSummarySpec = (await (request.json() as any)).data as IChunkQueryRelevantToSummarySpec;

         let repository = getEnrichedChunkRepository(EChunkRepository.kWaterfall);

         let chunks = await repository.lookupRelevantFromSummary (spec);

         return {
            status: 200, // Ok
            body: JSON.stringify (chunks)
         };
      }
      catch (e) {
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
         let spec: IChunkQueryRelevantToUrlSpec = (await (request.json() as any)).data as IChunkQueryRelevantToUrlSpec;

         let repository = getEnrichedChunkRepository(EChunkRepository.kWaterfall);

         let chunks = await repository.lookupRelevantFromUrl (spec);

         return {
            status: 200, // Ok
            body: JSON.stringify (chunks)
         };
      }
      catch (e) {
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
         let spec: IChunkQueryRelevantToUrlSpec = (await (request.json() as any)).data as IChunkQueryRelevantToUrlSpec;

         let repository = getEnrichedChunkRepository(EChunkRepository.kWaterfall);

         let chunks = await repository.lookupFromUrl (spec);

         return {
            status: 200, // Ok
            body: JSON.stringify (chunks)
         };
      }
      catch (e) {
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