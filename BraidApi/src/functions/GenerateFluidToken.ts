'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

/*
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { ScopeType } from "@fluidframework/protocol-definitions/lib";
import { generateToken } from "@fluidframework/server-services-client";

import { isSessionValid, sessionFailResponse, defaultErrorResponse } from "./Utility";
import { IFluidTokenRequest } from "../../../BraidCommon/src/Fluid";


// NOTE: retrieve the key from a secure location.
const key = process.env.ConversationKey;
const tenantId = process.env.TenantId;

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
         let jsonRequest = await request.json() as IFluidTokenRequest;

         // tenantId, documentId, userId and userName are required parameters
         const documentId = jsonRequest.documentId;
         const userId = jsonRequest.userId;
         const userName = jsonRequest.userName;

         let user = { name: userName, id: userId };

         // Will generate the token returned by an ITokenProvider implementation to use with the AzureClient.
         const token = generateToken(      
            tenantId,
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
*/