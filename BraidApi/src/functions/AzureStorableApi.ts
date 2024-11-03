'use strict';
// Copyright Braid Technologies Ltd, 2024

// 3rd party imports
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Internal imports
import { isSessionValid, sessionFailResponse, defaultOkResponse } from "./Utility";
import { IStorable, IStorableQuerySpec, IStorableMultiQuerySpec, IStorableOperationResult} from "../../../BraidCommon/src/IStorable";
import {AzureLogger, loadStorable, saveStorable, removeStorable, loadRecentStorables, ICosmosStorableParams} from './CosmosStorableApi';

/**
 * Asynchronous function to load an Storable based on the provided request and context.
 * Validates the session key from the request query parameters and removes the Storable if the session key matches predefined keys.
 * Logs the validation and removal status, returning an HTTP response with the appropriate status and message.
 * 
 * @param request - The HTTP request containing the session key and Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context - The context object for logging and error handling.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
export async function getStorableApi(request: HttpRequest, 
   params: ICosmosStorableParams, 
   context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {      
         let jsonRequest: IStorableQuerySpec = await request.json() as IStorableQuerySpec;

         let logger = new AzureLogger(context);

         let result = await loadStorable (jsonRequest.id, params, logger);
         if (result)
            context.log("Loaded:" + result.toString());
         else
            context.log("Loaded nothing.");
         
         return {
            status: 200,
            body: JSON.stringify(result)
         };
      }
      catch (e: any) {
         context.error ("Failed load:" + e.toString());
         return {
            status: 500,
            body: "Failed load."
         };
      }
   }
   else {
      context.error("Failed session validation");           
      return sessionFailResponse();
   }
};

/**
 * Saves a Storable record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the activity.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path. 
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function saveStorableApi (request: HttpRequest,  
   params: ICosmosStorableParams,
   context: InvocationContext): Promise<HttpResponseInit> {


   if (isSessionValid(request, context)) {

      let jsonRequest: IStorable = await request.json() as IStorable;

      try {
         let logger = new AzureLogger(context);
         await saveStorable(jsonRequest, params, logger);
      }
      catch (e: any) {
         context.error("Failed save:" + e.toString());
         return {
            status: 500,
            body: "Failed save."
         };
      }
      return defaultOkResponse();
   }
   else {
      context.error("Failed session validation");      
      return sessionFailResponse();
   }
};

/**
 * Asynchronous function to handle the removal of an Storable based on the provided request and context.
 * Validates the session key from the request query parameters and removes the Storable if the session key matches predefined keys.
 * Logs the validation and removal status, returning an HTTP response with the appropriate status and message.
 * 
 * @param request - The HTTP request containing the session key and Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context - The context object for logging and error handling.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
export async function removeStorableApi(request: HttpRequest, 
   params: ICosmosStorableParams, 
   context: InvocationContext): Promise<HttpResponseInit> {


   if (isSessionValid(request, context)) {

      try {      
         let jsonRequest: IStorableQuerySpec = await request.json() as IStorableQuerySpec;

         let logger = new AzureLogger(context);

         let ok = await removeStorable (jsonRequest.id, params, logger);

         let result: IStorableOperationResult = {
            ok: ok
         }
         return {
            status: 200,
            body: JSON.stringify(result)
         };
      }
      catch (e: any) {
         context.error ("Failed remove:" + e.toString());
         return {
            status: 500,
            body: "Failed remove."
         };
      }
   }
   else {
      context.error("Failed session validation");           
      return sessionFailResponse();
   }
};


/**
 * Asynchronous function to handle retrieving activities based on the provided request and context.
 * 
 * @param request - The HTTP request object containing query parameters.
 * @param context - The invocation context for logging and other operations.
 * @returns A promise that resolves to an HTTP response initialization object.
 */
export async function getRecentStorablesApi(request: HttpRequest, 
   params: ICosmosStorableParams,    
   context: InvocationContext): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      let loaded: Array<IStorable> | undefined = undefined;

      try {
         let jsonRequest: IStorableMultiQuerySpec = await request.json() as IStorableMultiQuerySpec;

         let logger = new AzureLogger(context);

         loaded = await loadRecentStorables (jsonRequest, params, logger);
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




