// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IEnvironment } from "./IEnvironment";
import { IChunkQueryRelevantToSummarySpec, IChunkQueryRelevantToUrlSpec, IEnrichedChunkSummary, IRelevantEnrichedChunk } from './EnrichedChunk';


export class FindEnrichedChunkApi {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environment_: IEnvironment, sessionKey_: string) {
      this._environment = environment_;
      this._sessionKey = sessionKey_;
   }  


   
   async findChunkFromUrl (urlQuery: IChunkQueryRelevantToUrlSpec) : Promise<Array<IEnrichedChunkSummary>> {

      let apiUrl = this._environment.findEnrichedChunkFromUrl() + "?session=" + this._sessionKey.toString();
      var response: any;
      let empty = new Array<IEnrichedChunkSummary> ();

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

   async findRelevantChunksFromUrl (urlQuery: IChunkQueryRelevantToUrlSpec) : Promise<Array<IRelevantEnrichedChunk>> {

      let apiUrl = this._environment.findRelevantEnrichedChunksFromUrl() + "?session=" + this._sessionKey.toString();
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

   async findRelevantChunksFromSummary (urlQuery: IChunkQueryRelevantToSummarySpec) : Promise<Array<IRelevantEnrichedChunk>> {

      let apiUrl = this._environment.findRelevantEnrichedChunksFromSummary() + "?session=" + this._sessionKey.toString();
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
