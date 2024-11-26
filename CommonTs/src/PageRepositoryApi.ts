// Copyright (c) 2024 Braid Technologies Ltd

import * as pako from 'pako';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IStorable} from "./IStorable";
import { StorableRepostoryApi, IStorablePageRepostoryApiWrapper} from './StorableRepositoryApi';

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
      // Convert string to Uint8Array
      const data = new TextEncoder().encode(input);
      // Compress the data
      const compressed = pako.deflate(data);
      
      // Universal base64 encoding
      if (typeof window === 'undefined') {
         // Node.js environment
         return Buffer.from(compressed).toString('base64');
      } else {
         // Browser environment
         return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
      }
   }

   /**
    * Decompresses a string that was compressed using compressString
    * @param input Base64 encoded compressed string
    * @returns Original decompressed string
    */
   public decompressString(input: string): string {
      try {
         // Universal base64 decoding
         let compressedData: Uint8Array;
         if (typeof window === 'undefined') {
            // Node.js environment
            compressedData = Buffer.from(input, 'base64');
         } else {
            // Browser environment
            compressedData = new Uint8Array(
               atob(input).split('').map(char => char.charCodeAt(0))
            );
         }
         
         // Decompress the data
         const decompressed = pako.inflate(compressedData);
         // Convert back to string
         return new TextDecoder().decode(decompressed);
      } catch (error) {
         throw new Error('Failed to decompress string: Invalid input');
      }
   }

}
