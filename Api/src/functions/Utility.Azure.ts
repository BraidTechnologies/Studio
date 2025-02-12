'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally
/**
 * @module Utility
 * 
 * This module provides common utility functions used across the Azure Functions endpoints.
 * It handles session validation, error responses, and standard HTTP response formatting.
 * 
 * Key features:
 * - Session key validation against environment variables
 * - Standard HTTP response generators for common scenarios
 * - Error handling and response formatting utilities
 * 
 * Deployment:
 * - 'func azure functionapp publish Braid-Api' to publish to Azure
 * - 'func start' to run locally
 */

import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

/**
 * Checks if the session provided in the request is valid based on the session keys stored in the environment variables.
 * @param request - The HTTP request object containing the query parameters.
 * @param context - The invocation context for logging and additional context information.
 * @returns True if the session is valid, false otherwise.
 */
export function isSessionValid(request: HttpRequest, context: InvocationContext): boolean {

   let requestedSession: string | undefined = undefined;

   for (const [key, value] of request.query.entries()) {
      if (key === 'session')
         requestedSession = value;
   }

   if ((requestedSession === process.env.BRAID_SESSION_KEY?.toString()) || (requestedSession === process.env.BRAID_SESSION_KEY_2?.toString())) {
      context.log("Passed session key validation:" + requestedSession);
      return true;
   }
   else {
      context.log("Failed session key validation:" + requestedSession);
      return false;
   }
};

/**
 * Generates an HTTP response object indicating a session failure.
 * 
 * @returns {HttpResponseInit} The HTTP response object with a status code of 401 (Unauthorised) and a message "Authorization check failed."
 */

export function sessionFailResponse(): HttpResponseInit {

   return {
      status: 401, // Unauthorised
      body: "Authorization check failed."
   };
}

/**
 * Generates a default HTTP response with status code 200 (Ok) and a body of "Ok".
 * 
 * @returns {HttpResponseInit} The default HTTP response object with status code and body.
 */
export function defaultOkResponse(): HttpResponseInit {

   return {
      status: 200, // Ok
      body: "Ok"
   };
}

/**
 * Generates a default HTTP response for server errors.
 * Returns a response with status code 500 (Server error) and a message indicating an unexpected problem.
 * @returns {HttpResponseInit} The default error response object
 */
export function defaultErrorResponse(): HttpResponseInit {

   return {
      status: 500, // Server error
      body: "The server encountered an unexpected problem."
   };
}

export function invalidRequestResponse(str: string): HttpResponseInit {

   return {
      status: 400, // Invalid request
      body: "Invalid request:" + str
   };
}

export function notFoundResponse(): HttpResponseInit {

   return {
      status: 404, // Not Found
      body: ""
   };
}