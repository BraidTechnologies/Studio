// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IStoredChunkQuerySpec, IStoredChunk } from './ChunkRepositoryApiTypes';

/**
 * Represents an API for the Chunk repository
 * 
 * @param {EEnvironment} environment_ - The environment to use for saving Chunks.
 * @param {string} sessionKey_ - The session key for authentication.
 * 
 * @method save - Saves a record to the activity API.
 * @method remove - removes a record
 * @method recent - return a list of recent activities
 */
export class ChunkRepostoryApi extends Api {

   /**
    * Initializes a new instance of the class with the provided environment and session key.
    * 
    * @param environment_ The environment settings to be used.
    * @param sessionKey_ The session key for authentication.
    */
   public constructor(environment_: IEnvironment, sessionKey_: string) {
      super (environment_, sessionKey_);
   }  

   /**
    * Asynchronously saves a record to the chunk repository API.
    * 
    * @param record - The record to be saved, must implement the IStoredChunk interface.
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStoredChunk) : Promise<boolean> {

      let apiUrl = this.environment.saveChunkApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, record);

         if (response.status === 200) {
            return true;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return false;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return false;       
      }          
   }

   /**
    * Asynchronously removes a record from the chunk repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
    */
   async remove (querySpec: IStoredChunkQuerySpec) : Promise<boolean> {

      let apiUrl = this.environment.removeChunkApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, querySpec);

         if (response.status === 200) {
            return true;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return false;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return false;       
      }          
   }

   /**
    * Asynchronously retrieves a record from the chunk repository API based on the provided query specifications.
    * 
    * @param querySpec - The query specification 
    * @returns A Promise that resolves to an IStorable object representing the records, or undefined 
    */
   async load (querySpec: IStoredChunkQuerySpec) : Promise<IStoredChunk | undefined> {

      let apiUrl = this.environment.getChunkApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, querySpec);

         if (response.status === 200) {

            let responseRecord = response.data;

            return responseRecord;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return undefined; 
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return undefined;       
      }          
   }   
}
