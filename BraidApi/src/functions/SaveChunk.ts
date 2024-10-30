'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";

// Internal imports
import { defaultOkResponse, isSessionValid, sessionFailResponse } from "./Utility";
import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";
import { IStoredChunk } from '../../../BraidCommon/src/ChunkRepositoryApiTypes'
import { chunkPartitionKey, makePostChunkToken, makePostHeader } from './CosmosRepositoryApi';


/**
 * Saves a chunk record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the chunk.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the chunk data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function saveChunk(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {


   if (isSessionValid(request, context)) {

      let jsonRequest: IStoredChunk = await request.json() as IStoredChunk;

      try {
         await saveChunkDb(jsonRequest, context);
         context.log("Saved:" + jsonRequest.toString());
         return defaultOkResponse();         
      }
      catch (e: any) {
         context.error("Failed save:" + e.toString());
         return {
            status: 500,
            body: "Failed save."
         };
      }
   }
   else {
      return sessionFailResponse();
   }
};

app.http('SaveStoredChunk', {
   methods: ['POST'],
   authLevel: 'anonymous',
   handler: saveChunk
});

async function saveChunkDb(record: IStoredChunk, context: InvocationContext): Promise<boolean> {

   let dbkey = process.env.CosmosApiKey;

   let done = new Promise<boolean>(function (resolve, reject) {

      let time = new Date().toUTCString();
      let stream = JSON.stringify(record);
      let document = JSON.parse(stream);

      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key. 
      let key = makePostChunkToken(time, dbkey as string);
      let headers = makePostHeader(key, time, chunkPartitionKey);

      document.partition = chunkPartitionKey; // Dont need real partitions until 10 GB ... 

      axios.post('https://braidstudio.documents.azure.com:443/dbs/Studio/colls/Chunk/docs/',
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

