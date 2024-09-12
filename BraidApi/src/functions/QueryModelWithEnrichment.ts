'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from 'axios';
import axiosRetry from 'axios-retry';

import { EConversationRole, IConversationElement, IEnrichedQuery, IEnrichedResponse } from "../../../BraidCommon/src/EnrichedQuery";
import { IRelevantEnrichedChunk } from "../../../BraidCommon/src/EnrichedChunk";
import { getDefaultModel } from "../../../BraidCommon/src/IModelFactory";

import { getEnrichedChunkRepository } from "./EnrichedChunkRepositoryFactory";
import { isSessionValid, sessionFailResponse, defaultErrorResponse} from "./Utility";

let model = getDefaultModel();
let minimumEnrichmentTokens = 50; // we use 50 word summaries. ifwe get half this, the key is too short for a meaningful search. 

/**
 * Asynchronously sends an enriched query to a model for processing and returns an enriched response.
 * 
 * @param query - The enriched query object containing details for the model to process.
 * @returns A promise that resolves to an enriched response object with the model's answer and relevant enriched chunks.
 */
async function askModel(query: IEnrichedQuery): Promise<IEnrichedResponse> {

   // Up to 5 retries if we hit rate limit
   axiosRetry(axios, {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
         return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
      }
   });

   let systemPromptElement: IConversationElement = { role: EConversationRole.kSystem, content: query.personaPrompt };
   let questionElement: IConversationElement = { role: EConversationRole.kUser, content: query.question };
   let enrichedElement: IConversationElement = { role: EConversationRole.kUser, content: query.enrichmentDocumentPrompt + " " + query.question };

   let fullPrompt: Array<IConversationElement> = new Array<IConversationElement>();
   fullPrompt.push(systemPromptElement);
   fullPrompt = fullPrompt.concat(query.history);
   fullPrompt.push(questionElement);

   let directPromise = axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
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

   let enrichmentPromise = axios.post('https://braidlms.openai.azure.com/openai/deployments/braidlms/chat/completions?api-version=2024-02-01', {
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

   let answer = (directResponse.data.choices[0].message.content);
   let imagined = (enrichedResponse.data.choices[0].message.content);

   let tokens = model.estimateTokens (imagined);
   let chunks = new Array<IRelevantEnrichedChunk>();

   if (tokens >= minimumEnrichmentTokens) {
      let repository = getEnrichedChunkRepository();

      let spec = {
         repositoryId: query.repositoryId,
         summary: imagined,
         maxCount: 2,
         similarityThreshold: 0.85
      }

      chunks = await repository.lookupRelevantFromSummary (spec);
   }

   let queryResponse: IEnrichedResponse = {
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

   let jsonRequest = await request.json();

   if (isSessionValid(request, context)) {

      try {
         let query = (jsonRequest as any)?.data as IEnrichedQuery;

         context.log (query);
         let response = await askModel(query);
         let responseText = JSON.stringify(response);
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

