// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IEnvironment } from "./IEnvironment";


export class LoginApi {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environment_: IEnvironment, sessionKey_: string) {
      this._environment = environment_;
      this._sessionKey = sessionKey_;
   }  

   async login () : Promise<string> {

      let apiUrl = this._environment.loginWithLinkedInApi() + "?session=" + this._sessionKey.toString();
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
