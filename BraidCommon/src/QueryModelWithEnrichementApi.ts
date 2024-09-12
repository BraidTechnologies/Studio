// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IEnvironment } from "./IEnvironment";
import { IEnrichedQuery, IEnrichedResponse } from './EnrichedQuery';

export class QueryModelWithEnrichmentApi {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environment_: IEnvironment, sessionKey_: string) {
      this._environment = environment_;
      this._sessionKey = sessionKey_;
   }  


   async query (query: IEnrichedQuery) : Promise<IEnrichedResponse | undefined> {

      let apiUrl = this._environment.queryModelWithEnrichment() + "?session=" + this._sessionKey.toString();
      var response: any;
      let empty = undefined;

      try {
         response = await axios.post(apiUrl, {
            data: query
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
