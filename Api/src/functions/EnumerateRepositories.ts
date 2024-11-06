'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { IEnumerateRepositoriesRequest, IEnumerateReposotoriesResponse} from "../../../CommonTs/src/EnumerateModelsApi.Types"
import { sessionFailResponse, defaultErrorResponse } from "./Utility";
import { isSessionValid } from "./Utility"
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";



/**
 * Asynchronous function to send back details of installed repositories - used to keep Python code consistent with Typescript 
 * 
 * @param request - The HTTP request object .
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the respository details or an error message.
 */ 

export async function enumerateRepositories(request: HttpRequest, context: InvocationContext): Promise < HttpResponseInit > {

   if (isSessionValid(request, context)) {

      try {
         let jsonRequest = await request.json();
         context.log(jsonRequest);

         let spec = (jsonRequest as any).request as IEnumerateRepositoriesRequest;        

         let body: IEnumerateReposotoriesResponse = {
            repositoryIds: [EChunkRepository.kBoxer]            
         }

         context.log (body)
         return {
            status: 200, // Ok
            body: JSON.stringify(body)
         };
      }
      catch(error: any) {

         context.error ("Error finding repositories:", error);
         return defaultErrorResponse();
      }
   }
   else {
      context.error ("Session validation failed.");      
      return sessionFailResponse();
   }
};

app.http('EnumerateRepositories', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: enumerateRepositories
});

