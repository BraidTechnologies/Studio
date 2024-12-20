'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

import { getDefaultModel } from "../../../CommonTs/src/IModelFactory";
import { IEnumerateModelsRequest, IEnumerateModelsResponse} from "../../../CommonTs/src/EnumerateModelsApi.Types"
import { sessionFailResponse, defaultErrorResponse } from "./Utility";
import { isSessionValid } from "./Utility";

const model = getDefaultModel();



/**
 * Asynchronous function to send back details of installed models - used to keep Python code consistent with Typescript 
 * 
 * @param request - The HTTP request object .
 * @param context - The context object for the function invocation.
 * @returns A promise that resolves to an HTTP response with the model details or an error message.
 */ 

export async function enumerateModels(request: HttpRequest, context: InvocationContext): Promise < HttpResponseInit > {

   if (isSessionValid(request, context)) {

      try {
         const jsonRequest = await request.json();
         context.log(jsonRequest);

         const model = getDefaultModel();

         const spec = (jsonRequest as any).request as IEnumerateModelsRequest;        

         const body: IEnumerateModelsResponse = {
            defaultId: model.deploymentName,
            defaultEmbeddingId: model.embeddingDeploymentName,
            largeId: model.deploymentName,
            largeEmbeddingId: model.embeddingDeploymentName,            
            smallId: model.deploymentName,
            smallEmbeddingId: model.embeddingDeploymentName,            
         }

         context.log (body)
         return {
            status: 200, // Ok
            body: JSON.stringify(body)
         };
      }
      catch(error: any) {

         context.error ("Error finding models:", error);
         return defaultErrorResponse();
      }
   }
   else {
      context.error ("Session validation failed.");      
      return sessionFailResponse();
   }
};

app.http('EnumerateModels', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: enumerateModels
});

