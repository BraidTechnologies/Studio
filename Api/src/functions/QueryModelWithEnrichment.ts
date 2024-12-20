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
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { EConversationRole, IConversationElement, IEnrichedQuery, IEnrichedResponse } from "../../../CommonTs/src/EnrichedQuery";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";
import { getDefaultModel } from "../../../CommonTs/src/IModelFactory";

import { getEnrichedChunkRepository } from "./EnrichedChunkRepositoryFactory";
import { isSessionValid, sessionFailResponse, defaultErrorResponse} from "./Utility";

const model = getDefaultModel();
const minimumEnrichmentTokens = 50; // we use 50 word summaries. if we get half this, the key is too short for a meaningful search. 

/**
 * Asynchronously sends an enriched query to a model for processing and returns an enriched response.
 * 
 * @param query - The enriched query object containing details for the model to process.
 * @returns A promise that resolves to an enriched response object with the model's answer and relevant enriched chunks.
 */
export async function askModel(query: IEnrichedQuery): Promise<IEnrichedResponse> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   const systemPromptElement: IConversationElement = { role: EConversationRole.kSystem, content: query.personaPrompt };
   const questionElement: IConversationElement = { role: EConversationRole.kUser, content: query.question };
   const enrichedElement: IConversationElement = { role: EConversationRole.kUser, content: query.enrichmentDocumentPrompt + " " + query.question };

   let fullPrompt: Array<IConversationElement> = new Array<IConversationElement>();
   fullPrompt.push(systemPromptElement);
   fullPrompt = fullPrompt.concat(query.history);
   fullPrompt.push(questionElement);

   const directPromise = axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: fullPrompt,
   },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   let enrichmentPrompt: Array<IConversationElement> = new Array<IConversationElement>();
   enrichmentPrompt.push(systemPromptElement);
   enrichmentPrompt = enrichmentPrompt.concat(query.history);
   enrichmentPrompt.push(enrichedElement);

   const enrichmentPromise = axios.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
      messages: enrichmentPrompt,
   },
      {
         headers: {
            'Content-Type': 'application/json',
            'api-key': process.env.AzureAiKey
         }
      }
   );

   const [directResponse, enrichedResponse] = await Promise.all ([directPromise, enrichmentPromise]);

   const answer = (directResponse.data.choices[0].message.content);
   const imagined = (enrichedResponse.data.choices[0].message.content);

   const tokens = model.estimateTokens (imagined);
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

