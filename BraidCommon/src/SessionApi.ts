// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";


export class SessionApi extends Api {


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
