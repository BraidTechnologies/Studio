// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { Api } from './Api';
import { IStorable, IStoreQuerySpec } from "./IStorable";
import { IEnvironment } from "./IEnvironment";

/**
 * Represents an API for activities.
 * 
 * @param {EEnvironment} environment_ - The environment to use for saving activities.
 * @param {string} sessionKey_ - The session key for authentication.
 * 
 * @method save - Saves a record to the activity API.
 * @method remove - removes a record
 * @method recent - return a list of recent activities
 */
export class ActivityRepostoryApi extends Api {

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
    * Asynchronously saves a record to the activity repository API.
    * 
    * @param record - The record to be saved, must implement the IStorable interface.
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStorable) : Promise<boolean> {

      let apiUrl = this.environment.saveActivityApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
            id: record.storeId,
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

   /**
    * Asynchronously removes a record from the activity repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
    */
   async remove (recordId: string) : Promise<boolean> {

      let apiUrl = this.environment.removeActivityApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, {
            storeId: recordId
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

   /**
    * Asynchronously retrieves recent records from the activity repository API based on the provided query specifications.
    * 
    * @param querySpec - The query specifications including the limit and storeClassName to filter the records.
    * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
    */
   async recent (querySpec: IStoreQuerySpec) : Promise<Array<IStorable>> {

      let apiUrl = this.environment.getActivitiesApi() + "?session=" + this.sessionKey.toString();
      var response: any;

      try {
         response = await axios.post(apiUrl, querySpec);

         if (response.status === 200) {

            let responseRecords = response.data;
            let storedRecords = new Array<IStorable>()

            for (let i = 0; i < responseRecords.length; i++) {
               storedRecords.push (responseRecords[i]);
            }

            return storedRecords;
         }
         else {
            console.error ("Error, status: " + response.status);               
            return new Array<IStorable>();
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return new Array<IStorable>();       
      }          
   }   
}
