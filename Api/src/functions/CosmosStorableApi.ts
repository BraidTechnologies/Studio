'use strict';
// Copyright Braid Technologies Ltd, 2024

// 3rd party imports
import { InvocationContext } from "@azure/functions";
import axios from "axios";

// Internal imports
import { throwIfUndefined } from "../../../CommonTs/src/Asserts";
import { IStorable, IStorableMultiQuerySpec } from "../../../CommonTs/src/IStorable";

const chunkPartitionKey: string = "c02af798a60b48129c5e223e645a9b72";
const chunkCollectionPath = "dbs/Studio/colls/Chunk";
const chunkCollectionName = "Chunk";

const activityPartitionKey: string = "6ea3299d987b4b33a1c0b079a833206f";
const activityCollectionPath = "dbs/Studio/colls/Activity";
const activityCollectionName = "Activity";

const pagePartitionKey: string = "f11a7404e266499a84a58fead932eec4";
const pageCollectionPath = "dbs/Studio/colls/Page";
const pageCollectionName = "Page";

import { makeStorablePostToken, makeStorableDeleteToken, 
   makePostQueryHeader, makePostHeader, makeDeleteHeader } from './CosmosRepositoryApi';

// A transformer function that can be applied to a storable to transform it in some way.
export type StorableTransformer = (storable: IStorable) => IStorable;

// Applies a transformer function to a storable if it is provided.
function applyTransformer (storable: IStorable, transformer: StorableTransformer | undefined) : IStorable {

   if (transformer)
      return transformer (storable);

   return storable;
}

export interface ICosmosStorableParams {
   partitionKey: string;
   collectionPath: string;  
   collectionName: string; 
}

export interface ILoggingContext {
   log (message: string, details: any) : void;
   info (message: string, details: any) : void;   
   warning (message: string, details: any) : void;    
   error (message: string, details: any) : void;    
}

export let chunkStorableAttributes : ICosmosStorableParams = {
   partitionKey: chunkPartitionKey,
   collectionPath: chunkCollectionPath,
   collectionName: chunkCollectionName
}

export let activityStorableAttributes : ICosmosStorableParams = {
   partitionKey: activityPartitionKey,
   collectionPath: activityCollectionPath,
   collectionName: activityCollectionName
}

export let pageStorableAttributes : ICosmosStorableParams = {
   partitionKey: pagePartitionKey,
   collectionPath: pageCollectionPath,
   collectionName: pageCollectionName
}

export class AzureLogger implements ILoggingContext {

   invocationContext: InvocationContext;

   constructor (invocationContext_: InvocationContext) {

      this.invocationContext = invocationContext_;
   }

   log (message: string, details: any) : void {

      return this.invocationContext.log (message, JSON.stringify(details));
   }
   
   info (message: string, details: any) : void {
      return this.invocationContext.info (message, JSON.stringify(details));      
   }
   
   warning (message: string, details: any) : void {
      return this.invocationContext.warn (message, JSON.stringify(details));
   }  
   
   error (message: string, details: any) : void {
      return this.invocationContext.error (message, JSON.stringify(details));      
   }
}

export class ConsoleLogger implements ILoggingContext {


   constructor () {

   }

   log (message: string, details: any) : void {

      console.log (message, JSON.stringify(details));
   }
   
   info (message: string, details: any) : void {
      console.info (message, JSON.stringify(details));      
   }
   
   warning (message: string, details: any) : void {
      console.warn (message, JSON.stringify(details));
   }  
   
   error (message: string, details: any) : void {
      console.error (message, JSON.stringify(details));      
   }
}

/**
 * Asynchronously finds a Storable from the database.
 * 
 * @param id - The unique identifier of the Storable to be found.
 * @param params - the ICosmosStorableParams for the collection
 * @param context - The invocation context for logging purposes.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @returns A Promise that resolves to a boolean indicating the success of the removal operation.
 */
export async function findStorable(id: string | undefined,    
   params: ICosmosStorableParams, 
   context: ILoggingContext,
   transformer: StorableTransformer | undefined = undefined): Promise<IStorable | undefined> {

   if (!id)
      return undefined;
   
   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<IStorable | undefined>(function (resolve, reject) {

      let time = new Date().toUTCString();

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key.       
      let key = makeStorablePostToken(time, params.collectionPath, dbkey);
      let headers = makePostQueryHeader(key, time, params.partitionKey);

      let query = "SELECT * FROM " + params.collectionName + " a WHERE a.functionalSearchKey = @id";

      axios.post('https://braidstudio.documents.azure.com:443/' + params.collectionPath + '/docs/',
         {
            "query": query,
            "parameters": [
               {
                  "name": "@id",
                  "value": id
               }
            ]
         },
         {
            headers: headers
         })
         .then((resp: any) => {

            let responseRecords = resp.data.Documents;
            let storedRecord = responseRecords[0] as IStorable;

            context.log ("Loaded storable:", storedRecord.id);
            resolve(applyTransformer(storedRecord, transformer));
         })
         .catch((error: any) => {

            context.error ("Error calling database:", error);
            reject(undefined);
         });
   });

   return done;
}

/**
 * Asynchronously loads a Storable from the database.
 * 
 * @param id - The unique identifier of the Storable to be removed.
 * @param params - the ICosmosStorableParams for the collection
 * @param context - The invocation context for logging purposes.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @returns A Promise that resolves to a boolean indicating the success of the removal operation.
 */
export async function loadStorable(id: string | undefined, 
   params: ICosmosStorableParams, 
   context: ILoggingContext,
   transformer: StorableTransformer | undefined = undefined): Promise<IStorable | undefined> {

   if (!id)
      return undefined;
   
   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<IStorable | undefined>(function (resolve, reject) {

      let time = new Date().toUTCString();

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key.       
      let key = makeStorablePostToken(time, params.collectionPath, dbkey);
      let headers = makePostQueryHeader(key, time, params.partitionKey);

      let query = "SELECT * FROM " + params.collectionName + " a WHERE a.id = @id";

      axios.post('https://braidstudio.documents.azure.com:443/' + params.collectionPath + '/docs/',
         {
            "query": query,
            "parameters": [
               {
                  "name": "@id",
                  "value": id
               }
            ]
         },
         {
            headers: headers
         })
         .then((resp: any) => {

            let responseRecords = resp.data.Documents;
            let storedRecord = responseRecords[0] as IStorable;

            context.log ("Loaded storable:", storedRecord.id);
            resolve(applyTransformer(storedRecord, transformer));
         })
         .catch((error: any) => {

            context.error ("Error calling database:", error);
            reject(undefined);
         });
   });

   return done;
}

/**
 * Saves a storable record to a Cosmos database.
 * 
 * @param record The storable record to be saved.
 * @param params The parameters required for saving the record, including partition key and collection path.
 * @param context The logging context for capturing log messages during the save operation.
 * @returns A Promise that resolves to a boolean indicating the success of the save operation.
 */
export async function saveStorable(record: IStorable, params: ICosmosStorableParams, context: ILoggingContext): Promise<boolean> {

   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<boolean>(function (resolve, reject) {

      let time = new Date().toUTCString();
      let stream = JSON.stringify(record);
      let document = JSON.parse(stream);

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key. 
      let key = makeStorablePostToken(time, params.collectionPath, dbkey as string);
      let headers = makePostHeader(key, time, params.partitionKey);

      document.partition = params.partitionKey; // Dont need real partitions until 10 GB ... 

      axios.post('https://braidstudio.documents.azure.com:443/' + params.collectionPath + '/docs/',
         document,
         {
            headers: headers
         })
         .then((resp: any) => {

            context.log("Saved storable:", record.id);
            resolve(true);
         })
         .catch((error: any) => {

            context.error("Error calling database:", error);
            reject(false);
         });
   });

   return done;
}

/**
 * Asynchronously removes a Storable from the database.
 * 
 * @param id - The unique identifier of the Storable to be removed.
 * @param params - the ICosmosStorableParams for the collection
 * @param context - The invocation context for logging purposes.
 * @returns A Promise that resolves to a boolean indicating the success of the removal operation.
 */
export async function removeStorable(id: string | undefined, params: ICosmosStorableParams, context: ILoggingContext): Promise<boolean> {

   if (!id)
      return false;
   
   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<boolean>(function (resolve, reject) {

      let time = new Date().toUTCString();
      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key. 
      let key = makeStorableDeleteToken (time, params.collectionPath, dbkey, id);
      let headers = makeDeleteHeader(key, time, params.partitionKey);
        
      let deletePath = 'https://braidstudio.documents.azure.com:443/' + params.collectionPath + '/docs/'+ id;

      axios.delete(deletePath,
         {
            headers: headers
         })
         .then((resp: any) => {

            context.log("Removed storable:", id);
            resolve(true);
         })
         .catch((error: any) => {
            context.error ("Error calling database:", error);
            reject(false);
         });
   });

   return done;
}

/**
 * Asynchronously loads recent activities based on the provided query specifications.
 * 
 * @param querySpec - The query specifications including the limit and className.
 * @param params - the ICosmosStorableParams for the collection
 * @param context - The invocation context for logging and tracing.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @returns A promise that resolves to an array of storable objects representing the loaded activities.
 */
export async function loadRecentStorables(querySpec: IStorableMultiQuerySpec,
   params: ICosmosStorableParams,
   context: ILoggingContext,
   transformer: StorableTransformer | undefined = undefined): Promise<Array<IStorable>> {

   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<Array<IStorable>>(function (resolve, reject) {

      let time = new Date().toUTCString();

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key.       
      let key = makeStorablePostToken(time, params.collectionPath, dbkey);
      let headers = makePostQueryHeader(key, time, params.partitionKey);

      let query = "SELECT * FROM " + params.collectionName + " a WHERE a.className = @className ORDER BY a.created DESC OFFSET 0 LIMIT " + querySpec.limit.toString();

      axios.post('https://braidstudio.documents.azure.com:443/' + params.collectionPath + '/docs/',
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
               storedRecords.push(applyTransformer(responseRecords[i], transformer));
               context.log("Loaded storable:", storedRecords[i].id);
            }
            resolve(storedRecords);
         })
         .catch((error: any) => {

            context.error("Error calling database:", error);
            reject(new Array<IStorable>());
         });
   });

   return done;
}

/**
 * Asynchronously loads recent activities based on the provided query specifications.
 * 
 * @param querySpec - The query specifications including the limit and className.
 * @param params - the ICosmosStorableParams for the collection
 * @param context - The invocation context for logging and tracing.
 * @param transformer - An optional transformer function to apply to the loaded storable.
 * @returns A promise that resolves to an array of storable objects representing the loaded activities.
 */
export async function loadStorables(querySpec: IStorableMultiQuerySpec,
   params: ICosmosStorableParams,
   context: ILoggingContext,
   transformer: StorableTransformer | undefined = undefined): Promise<Array<IStorable>> {

   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<Array<IStorable>>(async function (resolve, reject) {

      let time = new Date().toUTCString();
      let continuation: string | undefined = undefined;
      let more = true;

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key.       
      let key = makeStorablePostToken(time, params.collectionPath, dbkey);
      let accumulatedRecords = new Array<IStorable>();

      while (more) {

         try {
            let headers = makePostQueryHeader(key, time, params.partitionKey, continuation);

            let query = "SELECT * FROM " + params.collectionName + " a WHERE a.className = @className ORDER BY a.created DESC";

            let resp = await axios.post('https://braidstudio.documents.azure.com:443/' + params.collectionPath + '/docs/',
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
               });

            if (resp.headers["x-ms-continuation"]) {
               continuation = resp.headers["x-ms-continuation"];
            }
            else {
               more = false;
            }
            let responseRecords = resp.data.Documents;

            for (let i = 0; i < responseRecords.length; i++) {
               accumulatedRecords.push(applyTransformer(responseRecords[i], transformer));
               context.log("Loaded storable:", accumulatedRecords[i].id);
            }
         }
         catch (error: any) {

            context.error("Error calling database:", error);
            resolve (new Array<IStorable>());
         };
      }

      resolve (accumulatedRecords);      
   });

   return done;
}