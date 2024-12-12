/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";
import axiosRetry from 'axios-retry';

/**
 * This function handles the HTTP request and returns the boxer information.
 *
 * @param {HttpRequest} req - The HTTP request.
 * @param {InvocationContext} context - The Azure Functions context object.
 * @returns {Promise<Response>} - A promise that resolves with the HTTP response containing the boxer information.
 */
export async function boxer(
   req: HttpRequest,
   context: InvocationContext
): Promise<HttpResponseInit> {

   try {
      // Get the question query parameter.
      const question = req.query.get("question") || (await req.text());;

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

         // Initialize response.
         const res: HttpResponseInit = {
            status: 200,
            jsonBody: {
               results: [],
            },
         };         

         let braidApi = "https://braid-api.azurewebsites.net/api/StudioForTeams-Boxer";
         const postResult = await axios.post(braidApi, null,
            {
               params: { question: question }
            });

         console.log(postResult.data);

         let items = new Array();
         for (let i = 0; i < postResult.data.length; i++) {
            let item = {
               id: postResult.data[i].id,
               description: postResult.data[i].summary,
               url: postResult.data[i].url,
               title: postResult.data[i].title,
               image: postResult.data[i].iconUrl
            }
            items.push(item);
         }
         console.log(items);

         // Return filtered boxer records, or an empty array if no records were found.
         res.jsonBody.results = items;
         return res;
      }
      else {
         context.error("Invalid request, no qustion found in paremeters.");
         return {
            status: 400, // Internal error
            body: "Invalid request, no qusetion found in paremeters."
         };
      }
   }
   catch (e: any) {
         context.error("Internal error:", e);
         return {
            status: 500, // Internal error
            body: "Internal server error."
         };
      }
   }

app.http("boxer", {
      methods: ["GET"],
      authLevel: "anonymous",
      handler: boxer,
   });
