'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

// Internal imports
import { isSessionValid, sessionFailResponse, defaultOkResponse } from "./Utility";
import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";
import { IStorableQuerySpec } from "../../../BraidCommon/src/IStorable";
import { makeActivityDeleteToken, makeDeleteHeader} from './CosmosRepositoryApi';
import {AzureLogger, activityStorableAttributes, saveStorable, ILoggingContext, ICosmosStorableParams} from './CosmosStorableApi';

/**
 * Asynchronous function to handle the removal of an activity based on the provided request and context.
 * Validates the session key from the request query parameters and removes the activity if the session key matches predefined keys.
 * Logs the validation and removal status, returning an HTTP response with the appropriate status and message.
 * 
 * @param request - The HTTP request containing the session key and activity data.
 * @param context - The context object for logging and error handling.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
export async function removeActivity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {


   if (isSessionValid(request, context)) {

      let jsonRequest: IStorableQuerySpec = await request.json() as IStorableQuerySpec;

      try {
         let logger = new AzureLogger(context);

         await removeActivityDb(jsonRequest.id, activityStorableAttributes, logger);
         context.log("Removed:" + jsonRequest.toString());
      }
      catch (e: any) {
         context.error ("Failed remove:" + e.toString());
         return {
            status: 500,
            body: "Failed remove."
         };
      }

      return defaultOkResponse();
   }
   else {
      return sessionFailResponse();
   }
};

app.http('RemoveActivity', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: removeActivity
});

/**
 * Asynchronously removes an activity from the database.
 * 
 * @param messageId - The unique identifier of the activity to be removed.
 * @param context - The invocation context for logging purposes.
 * @returns A Promise that resolves to a boolean indicating the success of the removal operation.
 */
async function removeActivityDb(messageId: string | undefined, params: ICosmosStorableParams, context: ILoggingContext): Promise<boolean> {

   if (!messageId)
      return false;
   
   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<boolean>(function (resolve, reject) {

      let time = new Date().toUTCString();
      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key. 
      let key = makeActivityDeleteToken(time, params.collectionPath, dbkey, messageId);
      let headers = makeDeleteHeader(key, time, activityStorableAttributes.partitionKey);
      
      let deletePath = 'https://braidstudio.documents.azure.com:443/dbs/Studio/colls/Activity/docs/' + messageId;

      axios.delete(deletePath,
         {
            headers: headers
         })
         .then((resp: any) => {

            context.log("removed activity:", messageId);
            resolve(true);
         })
         .catch((error: any) => {
            context.error ("Error calling database:", error);
            reject(false);
         });
   });

   return done;
}

