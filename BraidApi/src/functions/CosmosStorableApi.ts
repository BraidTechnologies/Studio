'use strict';
// Copyright Braid Technologies Ltd, 2024

// 3rd party imports
import { InvocationContext } from "@azure/functions";
import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";
import { IStorable } from "../../../BraidCommon/src/IStorable";
import axios from "axios";

const activityPartitionKey: string = "6ea3299d987b4b33a1c0b079a833206f";
const chunkPartitionKey: string = "c02af798a60b48129c5e223e645a9b72";

const chunkCollectionPath = "dbs/Studio/colls/Chunk";
const activityCollectionPath = "dbs/Studio/colls/Activity";

import { makeStorablePostToken, makePostHeader } from './CosmosRepositoryApi';

export interface ICosmosStorableParams {
   partitionKey: string;
   collectionPath: string;   
}

export interface ILoggingContext {
   log (message: string, details: any) : void;
   info (message: string, details: any) : void;   
   warning (message: string, details: any) : void;    
   error (message: string, details: any) : void;    
}

export let chunkStorableAttributes : ICosmosStorableParams = {
   partitionKey: chunkPartitionKey,
   collectionPath: chunkCollectionPath
}

export let activityStorableAttributes : ICosmosStorableParams = {
   partitionKey: activityPartitionKey,
   collectionPath: activityCollectionPath
}

export class AzureLogger implements ILoggingContext {

   invocationContext: InvocationContext;

   constructor (invocationContext_: InvocationContext) {

      this.invocationContext = invocationContext_;
   }

   log (message: string, details: any) : void {

      return this.invocationContext.log (message, details);
   }
   
   info (message: string, details: any) : void {
      return this.invocationContext.info (message, details);      
   }
   
   warning (message: string, details: any) : void {
      return this.invocationContext.warn (message, details);
   }  
   
   error (message: string, details: any) : void {
      return this.invocationContext.error (message, details);      
   }
}


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

            resolve(true);
         })
         .catch((error: any) => {

            context.log("Error calling database:", error);
            reject(false);
         });
   });

   return done;
}