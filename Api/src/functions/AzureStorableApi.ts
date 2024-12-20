'use strict';
// Copyright Braid Technologies Ltd, 2024
/**
 * @module AzureStorableApi
 * 
 * Provides Azure Functions HTTP endpoints for CRUD operations on IStorable objects in Azure Cosmos DB.
 * This module acts as a REST API layer between HTTP clients and the underlying Cosmos DB storage,
 * handling session validation, request parsing, and response formatting.
 * 
 * Key features:
 * - Session-validated endpoints for finding, getting, saving, and removing IStorable objects
 * - Support for custom transformers to modify data before storage and after retrieval
 * - Error handling and logging through Azure Functions context
 * - Query support for both ID-based and functional key-based searches
 * - Batch operations for retrieving recent storables
 * 
 * The module uses ICosmosStorableParams for database configuration and supports
 * custom response transformers for flexible API responses.
 */

// 3rd party imports
import { HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

// Internal imports
import { isSessionValid, sessionFailResponse, notFoundResponse } from "./Utility";
import { IStorable, IStorableQuerySpec, IStorableMultiQuerySpec, IStorableOperationResult} from "../../../CommonTs/src/IStorable";
import {AzureLogger, findStorable, loadStorable, saveStorable, removeStorable, 
        loadRecentStorables, ICosmosStorableParams, StorableTransformer} from './CosmosStorableApi';

// A transformer function that can be applied to a storable to transform it in some way to the HTTP response
export type StorableResponseTransformer = (storable: IStorable) => HttpResponseInit;

// A transformer function that can be applied to a storable to transform it in some way to the HTTP response
export type StorableArrayResponseTransformer = (storable: Array<IStorable>) => HttpResponseInit;

// Applies a transformer function to a storable if it is provided.
function applyTransformer (storable: IStorable, transformer: StorableResponseTransformer | undefined) : HttpResponseInit {

   if (transformer)
      return transformer (storable);

   return {
      status: 200,
      body: JSON.stringify(storable)
   };
}

// Applies a transformer function to a storable array if it is provided.
function applyArrayTransformer (storable: Array<IStorable>, transformer: StorableArrayResponseTransformer | undefined) : HttpResponseInit {

   if (transformer)
      return transformer (storable);   

   return {
      status: 200,
      body: JSON.stringify(storable)
   };
}

/**
 * Asynchronous function to load an Storable based on the provided request and context.
 * Validates the session key from the request query parameters and removes the Storable if the session key matches predefined keys.
 * Logs the validation and removal status, returning an HTTP response with the appropriate status and message.
 * 
 * @param request - The HTTP request containing the session key and Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context - The context object for logging and error handling.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @param resultTransformer - An optional transformer function to apply to the result storable.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
export async function findStorableApi(request: HttpRequest, 
   params: ICosmosStorableParams, 
   context: InvocationContext,
   transformer: StorableTransformer | undefined = undefined,
   resultTransformer: StorableResponseTransformer | undefined = undefined): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {      
         const jsonRequest = await request.json();
         const spec = (jsonRequest as any).request as IStorableQuerySpec;

         const logger = new AzureLogger(context);

         const result = await findStorable (spec.functionalSearchKey, params, logger, transformer);
         if (result)
            context.log("Found:" + result.id);
         else
            context.log("Found nothing.");
         
         if (result)
            return applyTransformer (result, resultTransformer);
         else {
            return notFoundResponse ();
         }
      }
      catch (e: any) {
         context.error ("Failed find:" + e?.toString());
         return {
            status: 500,
            body: "Failed find."
         };
      }
   }
   else {
      context.error("Failed session validation");           
      return sessionFailResponse();
   }
};

/**
 * Asynchronous function to load an Storable based on the provided request and context.
 * Validates the session key from the request query parameters and removes the Storable if the session key matches predefined keys.
 * Logs the validation and removal status, returning an HTTP response with the appropriate status and message.
 * 
 * @param request - The HTTP request containing the session key and Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context - The context object for logging and error handling.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @param resultTransformer - An optional transformer function to apply to the result storable.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
export async function getStorableApi(request: HttpRequest, 
   params: ICosmosStorableParams, 
   context: InvocationContext,
   transformer: StorableTransformer | undefined = undefined,
   resultTransformer: StorableResponseTransformer | undefined = undefined): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      try {      
         const jsonRequest = await request.json();
         const spec = (jsonRequest as any).request as IStorableQuerySpec;

         return await getStorableApiCommon (spec, params, context, transformer, resultTransformer);
      }
      catch (e: any) {
         context.error ("Failed load:" + e?.toString());
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
 * Asynchronous function to load an Storable based on the provided request and context.
 * Returns the Storable if the id matches a record in the database.
 * *Note* This function does not validate the session key. we are not proptecting GPU costs & we want browsers to be able to retrueve directly without the session key appearing in the URL parameters. 
 * @param request - The HTTP request containing the session key and Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context - The context object for logging and error handling.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @param resultTransformer - An optional transformer function to apply to the result storable.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
export async function getStorableApiFromQuery(request: HttpRequest,
   params: ICosmosStorableParams,
   context: InvocationContext,
   transformer: StorableTransformer | undefined = undefined,
   resultTransformer: StorableResponseTransformer | undefined = undefined): Promise<HttpResponseInit> {

   let requestedId: string | undefined = undefined;

   for (const [key, value] of request.query.entries()) {
      if (key === 'id')
         requestedId = value;
   }

   const spec: IStorableQuerySpec = {
      id: requestedId,
      functionalSearchKey: undefined
   };

   try {
      return await getStorableApiCommon(spec, params, context, transformer, resultTransformer);
   }
   catch (e: any) {
      context.error("Failed load:" + e?.toString());
      return {
         status: 500,
         body: "Failed load."
      };
   }
};

/**
 * Asynchronous function to load an Storable based on the provided request and context.
 * Returns the Storable if the id matches a record in the database.
 * @param request - The HTTP request containing the session key and Storable data.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context - The context object for logging and error handling.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @param resultTransformer - An optional transformer function to apply to the result storable.
 * @returns A promise of an HTTP response indicating the status of the removal operation.
 */
async function getStorableApiCommon(spec: IStorableQuerySpec,
   params: ICosmosStorableParams,
   context: InvocationContext,
   transformer: StorableTransformer | undefined = undefined,
   resultTransformer: StorableResponseTransformer | undefined = undefined): Promise<HttpResponseInit> {

   try {
      const logger = new AzureLogger(context);

      const result = await loadStorable(spec.id, params, logger, transformer);
      if (result)
         context.log("Loaded:" + result.id);
      else
         context.log("Loaded nothing.");

      if (result) {
         return applyTransformer(result, resultTransformer);
      }
      else {
         return notFoundResponse();
      }
   }
   catch (e: any) {
      context.error("Failed load:" + e?.toString());
      return {
         status: 500,
         body: "Failed load."
      };
   }
}

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

      try {
         const jsonRequest = await request.json();
         const spec = (jsonRequest as any).request as IStorable;   

         const logger = new AzureLogger(context);
         await saveStorable(spec, params, logger);

         const result: IStorableOperationResult = {
            ok: true
         }
         return {
            status: 200,
            body: JSON.stringify(result)
         };         
      }
      catch (e: any) {
         context.error("Failed save:" + e?.toString());
         return {
            status: 500,
            body: "Failed save."
         };
      }
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
         const jsonRequest = await request.json();
         const spec = (jsonRequest as any).request as IStorableQuerySpec;   

         const logger = new AzureLogger(context);

         const ok = await removeStorable (spec.id, params, logger);

         const result: IStorableOperationResult = {
            ok: ok
         }
         return {
            status: 200,
            body: JSON.stringify(result)
         };
      }
      catch (e: any) {
         context.error ("Failed remove:" + e?.toString());
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
 * @param params - The parameters required for saving the record, including partition key and collection path.
 * @param context - The invocation context for logging and other operations.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @param resultTransformer - An optional transformer function to apply to the result storable array.
 * @returns A promise that resolves to an HTTP response initialization object.
 */
export async function getRecentStorablesApi(request: HttpRequest, 
   params: ICosmosStorableParams,    
   context: InvocationContext,
   transformer: StorableTransformer | undefined = undefined,
   resultTransformer: StorableArrayResponseTransformer | undefined = undefined): Promise<HttpResponseInit> {

   if (isSessionValid(request, context)) {

      let loaded: Array<IStorable> | undefined = undefined;

      try {
         const jsonRequest = await request.json();
         const spec = (jsonRequest as any).request as IStorableMultiQuerySpec;         

         const logger = new AzureLogger(context);

         loaded = await loadRecentStorables (spec, params, logger, transformer);
         for (let i = 0; loaded && i < loaded.length; i++) {
            context.log("Loaded:" + loaded[i].id);
         }

         return applyArrayTransformer (loaded, resultTransformer);         
      }
      catch (e: any) {
         context.log("Failed load recent:" + e?.toString());
         return {
            status: 500,
            body: "Failed load recent."
         };
      }
   }
   else {
      return sessionFailResponse();
   }
};




