'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * Validates the session key provided in the request query parameters.
 * If the session key matches either of the expected session keys stored in the environment variables,
 * logs a success message and returns a 200 status with the session key in the response body.
 * If the session key does not match, logs a failure message and returns a 401 status with an authorization failure message.
 * 
 * @param request - The HTTP request object containing the query parameters.
 * @param context - The invocation context for logging and other context-specific operations.
 * @returns A promise that resolves to an HTTP response object with the appropriate status and body.
 */
export async function checkSession(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let requestedSession : string | null = null;     

   for (const [key, value] of request.query.entries()) {
       if (key === 'session')
           requestedSession = value;                
   }


   if ((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) {       

      context.log("Passed session key validation:" + requestedSession);     

      return {
         status: 200, // Ok
         body: requestedSession
      };         
   }
   else 
   {
       context.log("Failed session key validation:" + requestedSession);  

       return {
          status: 401, // Unauthorised
          body: "Authorization check failed."
       };             
   }
};

app.http('CheckSession', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: checkSession
});
