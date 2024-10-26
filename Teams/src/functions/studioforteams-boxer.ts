/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";
import axiosRetry from 'axios-retry';

import { getDefaultEnvironment } from "../../../BraidCommon/src/IEnvironmentFactory";

/**
 * This function handles the HTTP request and returns the repair information.
 *
 * @param {HttpRequest} request - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the repair information.
 */
export async function boxer(request: HttpRequest,context: InvocationContext): Promise<HttpResponseInit> {

   try {

      const question = request.query.get('question') || (await request.text());  

      if (question) {

         context.log(question);
         
         // Up to 5 retries if we hit rate limit
         axiosRetry(axios, {
            retries: 5,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => {
               return error?.response?.status === 429 || axiosRetry.isNetworkOrIdempotentRequestError(error);
            }
         });         

         let environment = getDefaultEnvironment();

         /*
         const postResult = await axios.post(environment.studioForTeamsBoxer(), null,
            {
               params: { question: question }
            }
         );        

         context.log ("Teams, headers:");    
         context.log (postResult.headers);          
         */
         const res: HttpResponseInit = {
            status: 200,
            jsonBody: {
               results: [],
             }
         };   
         
         res.jsonBody.results = [JSON.stringify({ id: "1",
            summary: "Hello !",
           url: ""
         })];

         context.log ("Teams, body:");          
         context.log (res.jsonBody);          
         
         return res;
      }
      else {
         context.error ("Invalid request, no qustion found in paremeters.");
         return {
            status: 400, // Internal error
            body: "Invalid request, no qustion found in paremeters."
         };          
      }
   }
   catch(error: any) {

      context.error ("Error calling Braid Api:", error);
      return {
         status: 500, // Internal error
         body: "Error calling Braid Api, the error has been logged."
      };
   }
}

app.http("studioforteams-boxer", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: boxer,
});
