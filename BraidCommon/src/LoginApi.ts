// Copyright (c) 2024 Braid Technologies Ltd
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
