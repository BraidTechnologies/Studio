// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IEnvironment } from "./IEnvironment";
import { IChunkQueryRelevantToSummarySpec, IChunkQueryRelevantToUrlSpec } from './EnrichedChunk';


export class FindEnrichedChunkApi {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environemnt_: IEnvironment, sessionKey_: string) {
      this._environment = environemnt_;
      this._sessionKey = sessionKey_;
   }  


   async findForUrl (urlQuery: IChunkQueryRelevantToUrlSpec) : Promise<boolean> {

      let apiUrl = this._environment.findEnrichedChunksRelevantToUrl() + "?session=" + this._sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
            data: urlQuery
         });

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

   async findForSummary (urlQuery: IChunkQueryRelevantToSummarySpec) : Promise<boolean> {

      let apiUrl = this._environment.findEnrichedChunksRelevantToSummary() + "?session=" + this._sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
            data: urlQuery
         });

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
}
