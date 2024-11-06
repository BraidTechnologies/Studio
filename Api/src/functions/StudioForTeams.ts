'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { IStudioBoxerRequest, IStudioBoxerResponseEnrichment} from "../../../CommonTs/src/StudioApi.Types";
import { IEnrichedQuery, EStandardPrompts } from "../../../CommonTs/src/EnrichedQuery";
import { defaultErrorResponse, invalidRequestResponse } from "./Utility";
import { askModel } from "./QueryModelWithEnrichment";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";
import { kDefaultMinimumCosineSimilarity } from "./IEnrichedChunkRepository";

function makeIconPath (url: string) : string {
   // https://dev.to/derlin/get-favicons-from-any-website-using-a-hidden-google-api-3p1e
   var urlParts = new URL(url);
   return 'https://www.google.com/s2/favicons?domain=' + urlParts.hostname + '&sz=32';
}

/**
 * Handles a boxer query request by processing the provided question and generating a response with enrichments.
 * 
 * @param request - The HTTP request containing the query information.
 * @param context - The context for the function invocation.
 * @returns A promise that resolves to an HTTP response with the processed query response and enrichments.
 */
export async function boxerQuery(request: HttpRequest, context: InvocationContext): Promise < HttpResponseInit > {

   try {

      const question = request.query.get('question') || (await request.text());  

      if (question) {
         context.log(question);

         // Translate from the simple MSTeams API to the one we use in Boxer app allowing more enrichments
         let passOnSpec: IEnrichedQuery = {

            repositoryId : EChunkRepository.kBoxer,
            similarityThreshold: kDefaultMinimumCosineSimilarity,
            maxCount: 4,
            personaPrompt: EStandardPrompts.kOpenAiPersonaPrompt,
            enrichmentDocumentPrompt: EStandardPrompts.kEnrichmentPrompt,
            question: question,
            history: []
         }

         // Call common function - common the Boxer back end and to Teams API
         let passedResponse = await askModel (passOnSpec);
      
         // Translate back from the enriched Boxer app format to simpler MSTeams API 
         let enrichments: Array<IStudioBoxerResponseEnrichment> = new Array<IStudioBoxerResponseEnrichment> ();

         let answer: IStudioBoxerResponseEnrichment = { 
            id: "1",
            url: "",
            summary: passedResponse.answer,
            title: question,            
            iconUrl: makeIconPath ("https://braidapps.io")
         };
         enrichments.push(answer);      

         for (let i = 0; i < passedResponse.chunks.length; i++) {
            let enrichment: IStudioBoxerResponseEnrichment = { 
               id: (i+2).toString(),
               url:  passedResponse.chunks[i].chunk.url,
               summary: passedResponse.chunks[i].chunk.summary,
               title: question +  " - Link#" + (i+1).toString(),
               iconUrl: makeIconPath (passedResponse.chunks[i].chunk.url)
            };
            enrichments.push(enrichment);
         }

         const res: HttpResponseInit = {
            status: 200,
            jsonBody: enrichments
         };

         context.log (res.jsonBody);

         return res;
      }
      else {
         context.error ("No 'question' parameter found.");   
         return invalidRequestResponse ("No 'question' parameter found.");           
      }
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

