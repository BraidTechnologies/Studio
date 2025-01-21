'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally

/**
 * @module LoginWithLinkedIn
 * @description Azure Function module that provides a method for logging in with LinkedIn.
 * This module handles the login process with LinkedIn, including authentication and session management.
 * It includes validation for session authentication and error handling for any issues encountered during the request processing.
 */

import axios from "axios";
import * as QueryString from "qs";

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getDefaultEnvironment } from "../../../CommonTs/src/IEnvironmentFactory";
import { EEnvironment } from "../../../CommonTs/src/IEnvironment";

export async function LoginWithLinkedIn(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let requestedSession: string | null = null;

   for (const [key, value] of request.query.entries()) {
      if (key === 'session')
         requestedSession = value;
   }

   if ((requestedSession === process.env.BRAID_SESSION_KEY) || (requestedSession === process.env.SessionKey2)) {

      context.log("Passed session key validation:" + requestedSession);

      return redirectToLinkedIn(request, context);
   }
   else {
      context.log("Failed session key validation:" + requestedSession);

      return {
         status: 401, // Unauthorised
         body: "Authorization check failed."
      };
   }
};

app.http('LoginWithLinkedIn', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: LoginWithLinkedIn
});

/**
 * Redirects the user to LinkedIn for authentication using the Authorization Code Flow.
 * 
 * @param request - The HTTP request object containing query parameters.
 * @param context - The invocation context for the Azure Function.
 * @returns A promise that resolves to an HTTP response object with a status of 302 for redirection,
 *          headers containing the redirect location, and a body message of 'Redirecting...'.
 */
async function redirectToLinkedIn(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   // Put all the query parameters into the 'state' parameter, where can retrieve them later
   const queryAsObject = Object.fromEntries(request.query.entries());
   const stringifiedQuery = JSON.stringify(queryAsObject);

   const environment = getDefaultEnvironment();

   // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&tabs=HTTPS1
   const clientID = process.env.LINKEDIN_APP_ID;
   const redirectUrl = environment.authFromLinkedInApi();
   const scope = 'openid profile email';
   const state = stringifiedQuery;
   const redirect = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id="
      + clientID + "&redirect_uri=" + redirectUrl + "&scope=" + scope + "&state=" + state;

   return {
      status: 302,
      headers: {
         'Location': redirect
      },
      body: 'Redirecting...'
   };
}

/**
 * Asynchronously redirects back to the home page with the full path after processing LinkedIn authentication.
 * 
 * @param code The authorization code received in the authentication process.
 * @param session The session identifier.
 * @param conversation The conversation identifier.
 * @param secret The secret key for authentication.
 * @param context The invocation context for logging and tracing.
 * @returns An object containing the redirection status, headers, and body for the response.
 */
async function redirectBackHomeWithFullPath(code: string, session: string, conversation: string, secret: string, context: InvocationContext) {

   const environment = getDefaultEnvironment();

   try {

      const accessConfig = {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
         }
      }

      // https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext&tabs=HTTPS1
      // grant_type	string	The value of this field should always be: authorization_code	Yes
      // code	string	The authorization code you received in Step 2.	Yes
      // client_id	string	The Client ID value generated in Step 1.	Yes
      // client_secret	string	The Secret Key value generated in Step 1. See the Best Practices Guide for ways to keep your client_secret value secure.	Yes
      // redirect_uri	url	The same redirect_uri value that you passed in the previous step.	Yes

      const data = {
         grant_type: 'authorization_code',
         code: code,
         client_id: process.env.LINKEDIN_APP_ID,
         client_secret: process.env.LinkedInSecret,
         redirect_uri: environment.authFromLinkedInApi()
      };

      const accessRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', QueryString.stringify(data), accessConfig);

      const access_token = accessRes.data.access_token;

      const profileConfig = {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${access_token}`
         }
      }

      const profileRes = await axios.get(' https://api.linkedin.com/v2/userinfo', profileConfig);

      const redirect = environment.boxerHome() + "#&session=" + session +
         "&conversation=" + encodeURIComponent(conversation) +
         "&email=" + encodeURIComponent(profileRes.data.email) +
         "&name=" + encodeURIComponent(profileRes.data.name) +
         "&secret=" + encodeURIComponent(secret);

      return {
         status: 302,
         headers: {
            'Location': redirect
         },
         body: 'Redirecting...'
      }

   } catch (err) {

      console.error(err);

      return {
         status: 500
      };
   }
}

/**
* Process the authentication from LinkedIn based on the provided request and context.
* 
* @param request - The HTTP request containing query parameters for session, code, conversation, and secret.
* @param context - The invocation context for the Azure Function.
* @returns A promise that resolves to an HTTP response initialization object.
*/
async function processAuthFromLinkedIn(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let code: string | null = null;
   let state: string | null = null;
   let parsedState: JSON | null = null;
   let session: string | null = null;
   let secret: string | null = null;
   let conversation: string = "";     // COnversation can actually be an emptry string. 

   for (const [key, value] of request.query.entries()) {
      if (key === 'state')
         state = value;
      if (key === 'code')
         code = value;
   }

   // Pull all the state variables out of the 'state' parameter, where we put them on doing the redurect to LinkedIn
   if (state) {
      parsedState = JSON.parse(state);
      if (parsedState) {
         session = (parsedState as any).session;
         conversation = (parsedState as any).conversation;
         secret = (parsedState as any).secret;
      }
   }

   if (((session === process.env.BRAID_SESSION_KEY) || (session === process.env.SessionKey2))
      && code && secret) {

      return await redirectBackHomeWithFullPath(code, session, conversation, secret, context);
   } else {
      return {
         status: 400
      };
   }
}
app.http('ProcessAuthFromLinkedIn', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: processAuthFromLinkedIn
});