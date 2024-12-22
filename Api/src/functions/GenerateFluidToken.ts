'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

/**
 * @module GenerateFluidToken
 * @description Azure Function module that provides a method for generating a Fluid token.
 * This module handles the generation of a Fluid token, which is used to authenticate requests to the Fluid framework.
 * It includes validation for session authentication and error handling for any issues encountered during the request processing.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
//import { ScopeType } from "@fluidframework/protocol-definitions/lib";
import { generateToken } from "@fluidframework/server-services-client";

import { isSessionValid, sessionFailResponse, defaultErrorResponse } from "./Utility";
import { IFluidTokenRequest } from "../../../CommonTs/src/Fluid";

const key = process.env.ConversationKey;
const tenantId = "b9576484-5c2e-4613-bfdf-039948cdd521";

// WARNING - this is a redefinition of a type from inside the Fluid library. Does not seem to be exported at present, and we need it. 
//
export enum ScopeType {
	/**
	 * Read access is supported on the Container/Document
	 */
	DocRead = "doc:read",

	/**
	 * Write access is supported on the Container/Document
	 */
	DocWrite = "doc:write",

	/**
	 * User can generate new summaries operations
	 */
	SummaryWrite = "summary:write",
}

export async function generateFluidToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      if (!tenantId) {
         context.error ("No Fluid tenant ID found.")         
         return sessionFailResponse();
      }   

      if (!key) {
         context.error ("No Fluid key found.")
         return sessionFailResponse();
      }    

      try {
         const jsonRequest = await request.json();
         const fluidRequest = (jsonRequest as any).data as IFluidTokenRequest;

         // tenantId, documentId, userId and userName are required parameters
         const documentId = fluidRequest.documentId;
         const userId = fluidRequest.userId;
         const userName = fluidRequest.userName;
         const local = fluidRequest.local;

         const user = { name: userName, id: userId };

         context.log ("Generating token for:" + JSON.stringify(fluidRequest) + " tenantId:" + tenantId);

         // Generate the token returned by an ITokenProvider implementation to use with the AzureClient.
         const token = generateToken(      
            local? "local" : tenantId,
            documentId,
            key,
            [ScopeType.DocRead, ScopeType.DocWrite, ScopeType.SummaryWrite],
            user
            );

         return  {
            status: 200,
            body: token
         }; 
      }
      catch(error: any) {

         context.error ("Error generating Fluid token:", error);
         return defaultErrorResponse();
      }

     
   }
   else {
      return sessionFailResponse();
   }
};

app.http('GenerateFluidToken', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: generateFluidToken
});
