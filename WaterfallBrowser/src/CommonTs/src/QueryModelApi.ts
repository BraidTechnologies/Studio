// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IEnrichedQuery, IEnrichedResponse, IGenerateQuestionQuery, IQuestionGenerationResponse } from './EnrichedQuery';

/**
 * Represents a QueryModelApi class that interacts with the specified environment to query models with enrichment and generate questions.
 * @constructor
 * @param environment_ - The environment to interact with.
 * @param sessionKey_ - The session key for authentication.
 */
export class QueryModelApi extends Api {

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
    * Asynchronously queries the model with enrichment data.
    * 
    * @param query - The enriched query data to be sent.
    * @returns A promise that resolves to the enriched response data, or undefined if an error occurs.
    */
   async queryModelWithEnrichment (query: IEnrichedQuery) : Promise<IEnrichedResponse | undefined> {

      let apiUrl = this.environment.queryModelWithEnrichment() + "?session=" + this.sessionKey.toString();
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

   /**
    * Asynchronously generates a question based on the provided query data.
    * 
    * @param query - The data containing persona prompt, question generation prompt, and summary.
    * @returns A promise that resolves to the generated question response, or undefined if an error occurs.
    */
   async generateQuestion (query: IGenerateQuestionQuery) : Promise<IQuestionGenerationResponse | undefined> {

      let apiUrl = this.environment.generateQuestion() + "?session=" + this.sessionKey.toString();
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
