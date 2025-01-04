'use strict';
// Copyright Braid Technologies Ltd, 2024

/**
 * QueryModelWithEnrichment Module
 * 
 * This module provides functionality for querying an AI model with document enrichment.
 * It handles both direct model queries and enriched queries that incorporate relevant
 * document context from a repository. The module supports Azure Functions integration
 * and includes retry logic for handling rate limits.
 * 
 * Key features:
 * - Parallel processing of direct and enriched model queries
 * - Document enrichment based on similarity matching
 * - Session validation and error handling
 * - Configurable retry logic for API rate limits
 * 
 * @module QueryModelWithEnrichment
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { IModelConversationElement, EModelConversationRole, IModelConversationPrompt } from "../../../CommonTs/src/IModelDriver";
import { IEnrichedQuery, IEnrichedResponse } from "../../../CommonTs/src/EnrichedQuery";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";
import { getDefaultChatModelDriver, getDefaultTextChunker } from "../../../CommonTs/src/IModelFactory";

import { getEnrichedChunkRepository } from "./EnrichedChunkRepositoryFactory";
import { isSessionValid, sessionFailResponse, defaultErrorResponse} from "./Utility.Azure";
import { EPromptPersona } from "../../../CommonTs/src/IPromptPersona";

const chunker = getDefaultTextChunker();
const minimumEnrichmentTokens = 50; // we use 50 word summaries. if we get half this, the key is too short for a meaningful search. 

/**
 * Asynchronously sends an enriched query to a model for processing and returns an enriched response.
 * 
 * @param query - The enriched query object containing details for the model to process.
 * @returns A promise that resolves to an enriched response object with the model's answer and relevant enriched chunks.
 */
export async function askModel(query: IEnrichedQuery): Promise<IEnrichedResponse> {

   let modelDriver = getDefaultChatModelDriver();

   let directPrompt : IModelConversationPrompt = {
      history: query.history,
      prompt: query.question
   }

   let directPromise = await modelDriver.generateResponse (EPromptPersona.kDeveloperAssistant, directPrompt, {wordTarget: query.wordTarget});

   let enrichedPrompt : IModelConversationPrompt = {
      history: query.history,
      prompt: query.question
   }

   let enrichmentPromise = await modelDriver.generateResponse (EPromptPersona.kDeveloperImaginedAnswerGenerator, enrichedPrompt, {wordTarget: query.wordTarget});

   const [directResponse, enrichedResponse] = await Promise.all ([directPromise, enrichmentPromise]);

   const answer = (directResponse.content);
   const imagined = (enrichedResponse.content);

   const tokens = chunker.estimateTokens (imagined);
   let chunks = new Array<IRelevantEnrichedChunk>();

   if (tokens >= minimumEnrichmentTokens) {
      const repository = getEnrichedChunkRepository(query.repositoryId);

      const spec = {
         repositoryId: query.repositoryId,
         summary: imagined,
         maxCount: query.maxCount,
         similarityThreshold: query.similarityThreshold
      }

      chunks = await repository.lookupRelevantFromSummary (spec);
   }

   const queryResponse: IEnrichedResponse = {
      answer: answer,
      chunks: chunks
   }

   return queryResponse;
}

/**
 * Handles a query with enrichment by validating the session and processing the request.
 * @param request - The HTTP request containing the query data.
 * @param context - The context for the function invocation.
 * @returns A promise that resolves to an HTTP response with the query result.
 */
export async function queryModelWithEnrichment(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   const jsonRequest = await request.json();

   if (isSessionValid(request, context)) {

      try {
         const query = (jsonRequest as any)?.data as IEnrichedQuery;

         context.log (query);
         const response = await askModel(query);
         const responseText = JSON.stringify(response);
         context.log (responseText);

         return {
            status: 200, // Ok
            body: responseText
         };
      }
      catch (e: any) {
         context.error (e);
         return defaultErrorResponse();
      }
   }
   else {
      return sessionFailResponse();
   }
};

app.http('QueryModelWithEnrichment', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: queryModelWithEnrichment
});

