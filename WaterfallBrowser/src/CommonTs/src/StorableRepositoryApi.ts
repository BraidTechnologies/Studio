// Copyright (c) 2024 Braid Technologies Ltd
import axios from 'axios';

import { IStorable, IStorableMultiQuerySpec as IStorablesQuerySpec, IStorableQuerySpec} from "./IStorable";

/**
 * Represents a wrapper for interacting with a repository of storable objects.
 * Provides methods to save storable records.
 */
export interface IStorablePageRepostoryApiWrapper {
   
   save (record: IStorable) : Promise<boolean>;  
};

/**
 * Represents a wrapper for interacting with a repository of storable objects.
 * Provides methods to save, remove, and load storable records.
 */
export interface IStorableRepostoryApiWrapper extends IStorablePageRepostoryApiWrapper{
   
   remove (recordId: string) : Promise<boolean>;
   load (recordId: string) : Promise<IStorable | undefined>;
   find (functionalSearchKey: string) : Promise<IStorable | undefined>;  
   recent (querySpec: IStorablesQuerySpec, url: string) : Promise<Array<IStorable>>;
};

/**
 * Represents an API for Storables.
 * 
 * @param {EEnvironment} environment_ - The environment to use for saving Storables.
 * @param {string} sessionKey_ - The session key for authentication.
 * 
 * @method save - Saves a record to the Storables API.
 * @method remove - removes a record
 * @method recent - return a list of recent Storables
 */
export class StorableRepostoryApi {

   /**
    * Initializes a new instance of the class 
    */
   public constructor() {
   }  

   /**
    * Asynchronously saves a record to the Storables repository API.
    * 
    * @param record - The record to be saved, must implement the IStorable interface.
    * @param url - fully factored URL to the API to call
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStorable, url: string) : Promise<boolean> {

      var response: any;

      try {
         response = await axios.post(url, {request: record});

         if (response && response.status === 200) {
            return true;
         }
         else {
            console.error ("Error, status: " + response?.status);               
            return false;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return false;       
      }          
   }

   /**
    * Asynchronously removes a record from the Storables repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @param url - fully factored URL to the API to call
    * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
    */
   async remove (recordId: string, url: string) : Promise<boolean> {

      let query: IStorableQuerySpec = {
         id: recordId,
         functionalSearchKey: undefined         
      }
      
      var response: any;

      try {
         response = await axios.post(url, {request: query});

         if (response && response.status === 200) {
            return true;
         }
         else {
            console.error ("Error, status: " + response?.status);               
            return false;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return false;       
      }          
   }

   /**
    * Asynchronously loads a record from the Storable repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @param url - fully factored URL to the API to call
    * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
    */
   async load (recordId: string, url: string) : Promise<IStorable | undefined> {

      let query: IStorableQuerySpec = {
         id: recordId,
         functionalSearchKey: undefined
      }
      var response: any;

      try {
         response = await axios.post(url, {request: query});

         if (response && response.status === 200) {       
            return (response.data as IStorable);
         }
         else {
            console.error ("Error, status: " + response?.status);               
            return undefined;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return undefined;       
      } 
   }

   /**
    * Asynchronously finds a record from the Storable repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @param url - fully factored URL to the API to call
    * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
    */
   async find (functionalSearchKey: string, url: string) : Promise<IStorable | undefined> {

      let query: IStorableQuerySpec = {
         id: undefined,
         functionalSearchKey: functionalSearchKey
      }
      var response: any;

      try {
         response = await axios.post(url, {request: query});

         if (response.status === 200) {          
            return (response.data as IStorable);
         }
         else {
            console.error ("Error, status: " + response.status);               
            return undefined;
         }
      } catch (e: any) {       

         console.error ("Error: " + e?.response?.data);   
         return undefined;       
      } 
   }

   /**
    * Asynchronously retrieves recent records from the Storables repository API based on the provided query specifications.
    * 
    * @param querySpec - The query specifications including the limit and storeClassName to filter the records.
    * @param url - fully factored URL to the API to call
    * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
    */
   async recent (querySpec: IStorablesQuerySpec, url: string) : Promise<Array<IStorable>> {

      var response: any;

      try {
         response = await axios.post(url, {request: querySpec});

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
