// Copyright (c) 2024, 2025 Braid Technologies Ltd

/**
 * @module ChunkRepositoryApi
 * 
 * This module provides an API wrapper for managing text chunking operations.
 * It extends the base Api class and implements IStorableRepostoryApiWrapper interface
 * to provide CRUD operations for text chunking.
 * 
 * The module handles:
 * - Loading individual text chunks
 * - Finding text chunks by search key
 * - Saving new or updated text chunks
 * - Removing text chunks
 * - Retrieving recent text chunks with query specifications
 * 
 * All operations require proper authentication via session key and communicate
 * with the appropriate environment-specific API endpoints.
 */

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IStorable, IStorableMultiQuerySpec} from "./IStorable";
import { StorableRepostoryApi, IStorableRepostoryApiWrapper} from './StorableRepositoryApi';

/**
 * Represents an API for the Chunk repository
 * 
 * @param {EEnvironment} environment_ - The environment to use for saving Chunks.
 * @param {string} sessionKey_ - The session key for authentication.
 * 
 * @method save - Saves a record to the Chunk API.
 * @method remove - removes a record
 * @method load - load an Chunk given the key 
 */
export class ChunkRepostoryApi extends Api implements IStorableRepostoryApiWrapper {
   
   private storableApi: StorableRepostoryApi;

   /**
    * Initializes a new instance of the class with the provided environment and session key.
    * 
    * @param environment_ The environment settings to be used.
    * @param sessionKey_ The session key for authentication.
    */
   public constructor(environment_: IEnvironment, sessionKey_: string) {
      super (environment_, sessionKey_);

      this.storableApi = new StorableRepostoryApi();      
   }  

   /**
    * Asynchronously loads a record from the Chunk repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
    */
    async load (recordId: string) : Promise<IStorable | undefined> {

         let apiUrl = this.environment.getChunkApi() + "?session=" + this.sessionKey.toString();
         return this.storableApi.load (recordId, apiUrl);  
      }

   /**
    * Asynchronously finds a record from the Chunk repository API.
    * 
    * @param functionalSearchKey - The ID of the record to be removed.
    * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
    */
    async find (functionalSearchKey: string) : Promise<IStorable | undefined> {

      let apiUrl = this.environment.findChunkApi() + "?session=" + this.sessionKey.toString();
      return this.storableApi.find (functionalSearchKey, apiUrl);  
   }

   /**
    * Asynchronously saves a record to the chunk repository API.
    * 
    * @param record - The record to be saved, must implement the IStoredChunk interface.
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStorable) : Promise<boolean> {

      let apiUrl = this.environment.saveChunkApi() + "?session=" + this.sessionKey.toString();
      return this.storableApi.save (record, apiUrl);             
   }  

   /**
    * Asynchronously removes a record from the Chunk repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
    */
   async remove (recordId: string) : Promise<boolean> {

      let apiUrl = this.environment.removeChunkApi() + "?session=" + this.sessionKey.toString();
      return this.storableApi.remove (recordId, apiUrl);  
   }

   /**
    * Asynchronously retrieves recent records from the activity repository API based on the provided query specifications.
    * 
    * @param querySpec - The query specifications including the limit and storeClassName to filter the records.
    * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
    */
   async recent (querySpec: IStorableMultiQuerySpec) : Promise<Array<IStorable>> {

      let apiUrl = this.environment.getChunksApi() + "?session=" + this.sessionKey.toString();

      return this.storableApi.recent (querySpec, apiUrl);  
   }   
}
