// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IEnvironment } from "./IEnvironment";
import { IChunkQueryRelevantToSummarySpec, IChunkQueryRelevantToUrlSpec, IEnrichedChunk } from './EnrichedChunk';


export class FindEnrichedChunkApi {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environemnt_: IEnvironment, sessionKey_: string) {
      this._environment = environemnt_;
      this._sessionKey = sessionKey_;
   }  


   async findForUrl (urlQuery: IChunkQueryRelevantToUrlSpec) : Promise<Array<IEnrichedChunk>> {

      let apiUrl = this._environment.findEnrichedChunksRelevantFromUrl() + "?session=" + this._sessionKey.toString();
      var response: any;
      let empty = new Array<IEnrichedChunk> ();

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

   async findForSummary (urlQuery: IChunkQueryRelevantToSummarySpec) : Promise<Array<IEnrichedChunk>> {

      let apiUrl = this._environment.findEnrichedChunksRelevantFromSummary() + "?session=" + this._sessionKey.toString();
      var response: any;
      let empty = new Array<IEnrichedChunk> ();      

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
