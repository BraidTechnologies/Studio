/**
 * @module CheckSession
 * 
 * Azure Function module that provides session validation functionality.
 * This module exposes an HTTP endpoint that validates session keys against 
 * environment-configured valid sessions. It supports both GET and POST methods
 * and returns appropriate responses based on session validity.
 * 
 * The function is configured for anonymous access but requires a valid session key
 * in the request parameters to succeed. This serves as a basic authentication
 * mechanism for the Braid API.
 */

'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'npm start' to run locally

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { isSessionValid, sessionFailResponse, defaultOkResponse } from "./Utility";

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

   if (isSessionValid(request, context)) {

      return defaultOkResponse();
   }
   else {
      return sessionFailResponse();
   }
};

app.http('CheckSession', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: checkSession
});
