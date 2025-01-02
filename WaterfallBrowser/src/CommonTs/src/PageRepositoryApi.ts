// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module PageRepositoryApi
 * @description Provides an API for managing page storage and retrieval.
 * 
 * This module contains the PageRepositoryApi class which handles storage operations
 * for pages in the application. It provides methods for:
 * - Saving pages to persistent storage
 * - Compressing page content for efficient storage
 * 
 * The module extends the base Api class and implements IStorablePageRepositoryApiWrapper
 * to provide consistent storage patterns while handling page-specific requirements
 * like content compression.
 */

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IStorable} from "./IStorable";
import { StorableRepostoryApi, IStorablePageRepostoryApiWrapper} from './StorableRepositoryApi';
import { compressString, decompressString } from './Compress';
/**
 * Represents an API for the Page repository
 * 
 * @param {EEnvironment} environment_ - The environment to use for saving Pages.
 * @param {string} sessionKey_ - The session key for authentication.
 * 
 * @method save - Saves a record to the Page API.
 * Does not provide a 'load' as Pages are loaded directly into the browser
 */
export class PageRepostoryApi extends Api implements IStorablePageRepostoryApiWrapper {
   
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
    * Asynchronously saves a record to the page repository API.
    * 
    * @param record - The record to be saved, must implement the IStoredPage interface.
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStorable) : Promise<boolean> {

      let apiUrl = this.environment.savePageApi() + "?session=" + this.sessionKey.toString();
      return this.storableApi.save (record, apiUrl);             
   }  

   /**
    * Compresses a string using deflate algorithm
    * @param input The string to compress
    * @returns Base64 encoded compressed string
    */
   public compressString(input: string): string {
      return compressString(input);
   }

   /**
    * Decompresses a string that was compressed using compressString
    * @param input Base64 encoded compressed string
    * @returns Original decompressed string
    */
   public decompressString(input: string): string {
      return decompressString(input);
   }

}
