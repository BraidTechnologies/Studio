// Copyright (c) 2024, 2025 Braid Technologies Ltd
import axios from 'axios';
/**
 * @module SessionApi
 * @description Provides an API for managing user sessions and authentication.
 * 
 * This module contains the SessionApi class which handles session validation
 * and authentication operations. It provides methods for:
 * - Checking session key validity
 * - Managing session authentication state
 * 
 * The module extends the base Api class to provide consistent authentication
 * patterns while handling session-specific requirements.
 */

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";


export class SessionApi extends Api {

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
    * Asynchronously checks the validity of a session key by sending a POST request to the session API endpoint.
    * 
    * @returns A Promise that resolves to a boolean value indicating the validity of the session key.
    */
   async checkSessionKey () : Promise<string> {

      let apiUrl = this.environment.checkSessionApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
         });

         if (response.status === 200) {
            return response.data;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return "";
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return "";       
      }          
   }
   
}
