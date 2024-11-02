'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

// Internal imports
import { isSessionValid, sessionFailResponse, defaultOkResponse } from "./Utility";
import { IStorableQuerySpec } from "../../../BraidCommon/src/IStorable";
import {AzureLogger, activityStorableAttributes, removeStorable} from './CosmosStorableApi';

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

         await removeStorable (jsonRequest.id, activityStorableAttributes, logger);
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



