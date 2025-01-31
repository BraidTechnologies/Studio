// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module KeyRetriever
 * @description Provides a class for retrieving keys from the Braid backend.
 * 
 * This module includes the KeyRetriever class which handles:
 * - Making API calls to retrieve keys
 * - Tracking active call state
 * - Logging errors
 */

import axios from "axios";

// Local
import { logApiError } from "./Logging";
import { EConfigStrings } from './ConfigStrings';
import { ConnectionError } from "./Errors";
import { SessionKey } from "./Keys";

export class KeyRetriever {

   private activeCallCount: number;

   /**
    * Create an empty KeyRetriever object 
    */
   constructor() {
      this.activeCallCount = 0;
   }   

   // Makes an Axios call to request the key
   // If running locally, looks for an environment variable
   async requestKey  (apiUrl_: string, paramName_: string, sessionKey_: SessionKey) : Promise<string> {
     
      /*  Now we use a localhost server bcs it can access environment variables
      // If we are running locally directly in the browser (not via a web server on localhost:)
      // use the stub values - no Production secrets are really stored locally 
      let environment = Environment.environment();
      if (environment === EEnvironment.kLocal) {
         type KStubEnvironmentVariableKey = keyof typeof KStubEnvironmentVariables;
         let memberKeyAsStr: KStubEnvironmentVariableKey = paramName_ as any;
         let checked = KStubEnvironmentVariables[memberKeyAsStr];
         throwIfUndefined(checked);
         return checked;
      }
      */

      this.activeCallCount++;

      var response;

      try {
         response = await axios.get(apiUrl_, {
            params: {
               [paramName_]: sessionKey_.toString()
            },
            withCredentials: false
         });
         this.activeCallCount--; 

      } catch (e: any) {
         
         this.activeCallCount--;
   
         logApiError (EConfigStrings.kErrorConnectingToKeyAPI + ":" + apiUrl_, e?.response?.data);           
      }

      if (!response || !response.data)
         throw new ConnectionError(EConfigStrings.kErrorConnectingToKeyAPI + ":" + apiUrl_);      
      
      return response.data as string;
   }    

   isBusy () {
      return this.activeCallCount !== 0;
   }
}