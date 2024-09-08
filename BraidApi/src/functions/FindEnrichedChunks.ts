'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec } from "../../../BraidCommon/src/EnrichedChunk";
import { isSessionValid, sessionFailResponse, defaultOkResponse } from "./Utility";
import { getEnrichedChunkRepository } from "./EnrichedChunkRepositoryFactory";


export async function FindEnrichedChunksFromSummary(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      let jsonRequest: IChunkQueryRelevantToSummarySpec = await request.json() as IChunkQueryRelevantToSummarySpec;

      return defaultOkResponse();
   }
   else {
      return sessionFailResponse();
   }
};

export async function FindEnrichedChunksFromUrl (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      let jsonRequest: IChunkQueryRelevantToUrlSpec = await request.json() as IChunkQueryRelevantToUrlSpec;

      let repository = getEnrichedChunkRepository();

      let chunks = repository.lookupRelevantfromUrl (jsonRequest);

      return {
         status: 200, // Ok
         body: JSON.stringify (chunks)
      };
   }
   else {
      return sessionFailResponse();
   }
};

app.http('FindEnrichedChunksFromSummary', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: FindEnrichedChunksFromSummary
});

app.http('FindEnrichedChunksFromUrl', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: FindEnrichedChunksFromUrl
});
