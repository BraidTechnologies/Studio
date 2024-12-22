/**
 * @module   FindEnrichedChunkApi
 * @description Provides an API for finding and retrieving enriched chunks.
 * 
 * This module contains the FindEnrichedChunkApi class which handles various API calls
 * related to finding enriched chunks based on URLs and summaries. It provides methods
 * for retrieving both individual chunk summaries and arrays of relevant chunks.
 * 
 * The API supports:
 * - Finding single enriched chunk summaries by URL
 * - Finding relevant enriched chunks by URL
 * - Finding relevant enriched chunks by summary
 */

// Copyright (c) 2024 Braid Technologies Ltd


import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IChunkQueryRelevantToSummarySpec, IChunkQueryRelevantToUrlSpec, IEnrichedChunkSummary, IRelevantEnrichedChunk } from './EnrichedChunk';


/**
 * Class representing an API for finding enriched chunks.
 */
export class FindEnrichedChunkApi extends Api {

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
    * Asynchronously finds an enriched chunk summary based on the provided URL query.
    * 
    * @param urlQuery - The URL query specifying the URL to search for the enriched chunk.
    * @returns An IEnrichedChunkSummary objects representing the found enriched chunk summary, or undefined.
    */
   async findChunkFromUrl (urlQuery: IChunkQueryRelevantToUrlSpec) : Promise<IEnrichedChunkSummary | undefined> {

      let apiUrl = this.environment.findEnrichedChunkFromUrl() + "?session=" + this.sessionKey.toString();
      var response: any;
      let empty = undefined;

      try {
         response = await axios.post(apiUrl, {
            data: urlQuery
         });

         if (response.status === 200) {
            return response.data;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return empty;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return empty;      
      }          
   }

   /**
    * Asynchronously finds relevant enriched chunks based on the provided URL query.
    * 
    * @param urlQuery - The URL query specifying the URL to search for relevant enriched chunks.
    * @returns A Promise that resolves to an array of IRelevantEnrichedChunk objects representing the found relevant enriched chunks.
    */
   async findRelevantChunksFromUrl (urlQuery: IChunkQueryRelevantToUrlSpec) : Promise<Array<IRelevantEnrichedChunk>> {

      let apiUrl = this.environment.findRelevantEnrichedChunksFromUrl() + "?session=" + this.sessionKey.toString();
      var response: any;
      let empty = new Array<IRelevantEnrichedChunk> ();

      try {
         response = await axios.post(apiUrl, {
            data: urlQuery
         });

         if (response.status === 200) {
            return response.data;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return empty;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return empty;      
      }          
   }

   /**
    * Asynchronously finds relevant enriched chunks based on the provided summary query.
    * 
    * @param urlQuery - The summary query specifying the summary to search for relevant enriched chunks.
    * @returns A Promise that resolves to an array of IRelevantEnrichedChunk objects representing the found relevant enriched chunks.
    */
   async findRelevantChunksFromSummary (urlQuery: IChunkQueryRelevantToSummarySpec) : Promise<Array<IRelevantEnrichedChunk>> {

      let apiUrl = this.environment.findRelevantEnrichedChunksFromSummary() + "?session=" + this.sessionKey.toString();
      var response: any;
      let empty = new Array<IRelevantEnrichedChunk> ();      

      try {
         response = await axios.post(apiUrl, {
            data: urlQuery
         });

         if (response.status === 200) {
            return response.data;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return empty;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return empty;    
      }          
   }
}
