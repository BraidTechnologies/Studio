// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IStorable } from "./IStorable";
import { getEnvironment } from "./IEnvironmentFactory";
import { EEnvironment, IEnvironment } from "./IEnvironment";

/**
 * Represents an API for activities.
 * 
 * @param {EEnvironment} environemnt_ - The environment to use for saving activities.
 * @param {string} sessionKey_ - The session key for authentication.
 * 
 * @method save - Saves a record to the activity API.
 */
export class ActivityRepostoryApi {
   private _environment: IEnvironment;
   private _sessionKey: string;

   public constructor(environemnt_: EEnvironment, sessionKey_: string) {
      this._environment = getEnvironment(environemnt_);
      this._sessionKey = sessionKey_;
   }  

   /**
    * Asynchronously saves a record to the activity repository API.
    * 
    * @param record - The record to be saved, must implement the IStorable interface.
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStorable) : Promise<boolean> {

      let apiUrl = this._environment.saveActivityApi() + "?session=" + this._sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
            id: record.id,
            data: record
         });

         if (response.status === 200) {
            return true;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return false;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return false;       
      }          
   }

   async remove (record: IStorable) : Promise<boolean> {

      let apiUrl = this._environment.removeActivityApi() + "?session=" + this._sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
            id: record.id
         });

         if (response.status === 200) {
            return true;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return false;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return false;       
      }          
   }
}
