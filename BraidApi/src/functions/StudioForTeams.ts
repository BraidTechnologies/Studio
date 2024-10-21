'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { getDefaultModel } from "../../../BraidCommon/src/IModelFactory";
import { IStudioBoxerRequest, IStudioBoxerResponseEnrichment} from "../../../BraidCommon/src/StudioApi.Types";
import { IEnrichedQuery, EStandardPrompts } from "../../../BraidCommon/src/EnrichedQuery";
import { defaultErrorResponse } from "./Utility";
import { askModel } from "./QueryModelWithEnrichment";
import { EChunkRepository } from "../../../BraidCommon/src/EnrichedChunk";
import { kDefaultMinimumCosineSimilarity } from "./IEnrichedChunkRepository";


/**
 * Handles a boxer query request by processing the provided question and generating a response with enrichments.
 * 
 * @param request - The HTTP request containing the query information.
 * @param context - The context for the function invocation.
 * @returns A promise that resolves to an HTTP response with the processed query response and enrichments.
 */
export async function boxerQuery(request: HttpRequest, context: InvocationContext): Promise < HttpResponseInit > {

   try {

      const question = request.query.get('question') || (await request.text()) || 'What is an LLM?';  
      context.log(question);

      // Translate from the simple MSTeams API to the one we use in Boxer app allowing more enrichments
      let passOnSpec: IEnrichedQuery = {

         repositoryId : EChunkRepository.kBoxer,
         similarityThreshold: kDefaultMinimumCosineSimilarity,
         personaPrompt: EStandardPrompts.kOpenAiPersonaPrompt,
         enrichmentDocumentPrompt: EStandardPrompts.kEnrichmentPrompt,
         question: question,
         history: []

      }

      // Call common function - common the Boxer back end and to Teams API
      let passedResponse = await askModel (passOnSpec);
      context.log (passedResponse);
      
      // Translate back from the enriched Boxer app format to simpler MSTeams API 
      let enrichments: Array<IStudioBoxerResponseEnrichment> = new Array<IStudioBoxerResponseEnrichment> ();

      let answer: IStudioBoxerResponseEnrichment = { 
         id: "0",
         url: undefined,
         summary: passedResponse.answer
      };
      enrichments.push(answer);      

      for (let i = 0; i < passedResponse.chunks.length; i++) {
         let enrichment: IStudioBoxerResponseEnrichment = { 
            id: i.toString(),
            url:  passedResponse.chunks[i].chunk.url,
            summary: passedResponse.chunks[i].chunk.summary
         };
         enrichments.push(enrichment);
      }

      let body: Array<IStudioBoxerResponseEnrichment> = enrichments;

      context.log (body)
      return {
         status: 200, // Ok
         body: JSON.stringify(body)
      };
   }
   catch(error: any) {

      context.error ("Error calling Boxer:", error);
      return defaultErrorResponse();
   }
};

app.http('StudioForTeams-Boxer', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: boxerQuery
});

