// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { Api } from './Api';
import { IEnvironment } from "./IEnvironment";
import { IFluidTokenRequest } from './Fluid';


export class FluidApi extends Api {

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
    * Asynchronously generates a token using the provided query parameters.
    * 
    * @param query - The request object containing documentId, userId, and userName.
    * @returns A Promise that resolves to a string if successful, otherwise undefined.
    */
   async generateToken (query: IFluidTokenRequest ) : Promise<string | undefined> {

      let apiUrl = this.environment.generateFluidToken() + "?session=" + this.sessionKey.toString();
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
