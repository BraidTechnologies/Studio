// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module LoginApi
 * @description Provides an API for handling login operations.
 * 
 * This module contains the LoginApi class, which handles the login process
 * using LinkedIn API. It provides methods for:
 * - Logging in using LinkedIn API
 * - Handling errors and retries for login operations
 */

import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";

/**
 * Represents a class for handling login operations.
 * @constructor
 * @param environment_ - The environment settings for the login operations.
 * @param sessionKey_ - The session key for the current login session.
 * @returns A Promise that resolves to a string indicating the login status.
 */
export class LoginApi extends Api {

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
    * Asynchronously logs in using LinkedIn API.
    * 
    * @returns A Promise that resolves to a string indicating the status after attempting to log in.
    */
   async login () : Promise<string> {

      let apiUrl = this.environment.loginWithLinkedInApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
         });

         if (response.status === 200) {
            return "Redirecting...";
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
