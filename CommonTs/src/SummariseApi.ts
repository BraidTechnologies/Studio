// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module SummariseApi
 * @description Provides functionality for text summarization through the Summarise API.
 * 
 * This module contains the SummariseApi class which handles:
 * - Text summarization with configurable personas
 * - Context-aware summarization
 * - Integration with the base API functionality
 * 
 * The class supports different summarization approaches based on the provided
 * prompt persona and handles communication with the backend summarization service.
 */

import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { ISummariseContextRequest, ISummariseRequest, ISummariseResponse } from './SummariseApi.Types';
import { EPromptPersona } from './IPromptPersona';

/**
 * Class representing an API for summarising text.
 */

export class SummariseApi extends Api {

   /**
    * Initializes a new instance of the class with the provided environment and session key.
    * 
    * @param environment_ The environment settings to be used.
    * @param sessionKey_ The session key for authentication.
    */   
   public constructor(environment_: IEnvironment, sessionKey_: string) {
      super (environment_, sessionKey_);
   }  


   async summarise (persona: EPromptPersona, text: string) : Promise<ISummariseResponse | undefined> {

      let apiUrl = this.environment.summariseApi() + "?session=" + this.sessionKey.toString();
      var response: any;
      let empty = undefined;

      try {
         let summariseRequest : ISummariseRequest= {
            persona: persona,
            text: text
         }
         response = await axios.post(apiUrl, {
            rquest: summariseRequest
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

   async summariseContext (context: string, chunk: string) : Promise<ISummariseResponse | undefined> {

      let apiUrl = this.environment.summariseContextApi() + "?session=" + this.sessionKey.toString();
      var response: any;
      let empty = undefined;

      try {
         let summariseRequest : ISummariseContextRequest = {
            persona: EPromptPersona.kArticleContextSummariser,
            context: context,
            chunk: chunk
         }

         response = await axios.post(apiUrl, {
            rquest: summariseRequest
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
