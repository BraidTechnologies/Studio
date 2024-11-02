'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

// Internal imports
import { isSessionValid, sessionFailResponse } from "./Utility";
import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";
import { IStorable, IStoreQuerySpec } from "../../../BraidCommon/src/IStorable";
import { makeStorablePostToken, makePostQueryHeader } from './CosmosRepositoryApi';
import {AzureLogger, activityStorableAttributes, saveStorable} from './CosmosStorableApi';

/**
 * Asynchronous function to handle retrieving activities based on the provided request and context.
 * 
 * @param request - The HTTP request object containing query parameters.
 * @param context - The invocation context for logging and other operations.
 * @returns A promise that resolves to an HTTP response initialization object.
 */
export async function getActivities(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      let jsonRequest: IStoreQuerySpec = await request.json() as IStoreQuerySpec;
      let loaded: Array<IStorable> | undefined = undefined;

      try {
         loaded = await loadRecent(jsonRequest, context);
         context.log("Loaded:" + loaded.toString());
      }
      catch (e: any) {
         context.log("Failed load:" + e.toString());
         return {
            status: 500,
            body: "Failed load."
         };
      }

      return {
         status: 200, // Ok
         body: JSON.stringify(loaded)
      };
   }
   else {
      return sessionFailResponse();
   }
};

app.http('GetActivities', {
   methods: ['GET', 'POST'],
   authLevel: 'anonymous',
   handler: getActivities
});

/**
 * Asynchronously loads recent activities based on the provided query specifications.
 * 
 * @param querySpec - The query specifications including the limit and className.
 * @param context - The invocation context for logging and tracing.
 * @returns A promise that resolves to an array of storable objects representing the loaded activities.
 */
async function loadRecent(querySpec: IStoreQuerySpec, context: InvocationContext): Promise<Array<IStorable>> {

   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<Array<IStorable>>(function (resolve, reject) {

      let time = new Date().toUTCString();

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key.       
      let key = makeStorablePostToken(time, activityStorableAttributes.collectionPath, dbkey);
      let headers = makePostQueryHeader(key, time, activityStorableAttributes.partitionKey);

      let query = "SELECT * FROM Activity a WHERE a.className = @className ORDER BY a.created DESC OFFSET 0 LIMIT " + querySpec.limit.toString();

      axios.post('https://braidstudio.documents.azure.com:443/dbs/Studio/colls/Activity/docs',
         {
            "query": query,
            "parameters": [
               {
                  "name": "@className",
                  "value": querySpec.className
               }
            ]
         },
         {
            headers: headers
         })
         .then((resp: any) => {

            let responseRecords = resp.data.Documents;
            let storedRecords = new Array<IStorable>();

            for (let i = 0; i < responseRecords.length; i++) {
               storedRecords.push(responseRecords[i].data);
            }
            context.log ("Loaded activities:", storedRecords);
            resolve(storedRecords);
         })
         .catch((error: any) => {

            context.error ("Error calling database:", error);
            reject(new Array<IStorable>());
         });
   });

   return done;
}
