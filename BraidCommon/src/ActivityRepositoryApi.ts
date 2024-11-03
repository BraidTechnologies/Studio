// Copyright (c) 2024 Braid Technologies Ltd

import { Api } from './Api';
import { IStorable, IStorableMultiQuerySpec as IStorablesQuerySpec, IStorableQuerySpec} from "./IStorable";
import { IEnvironment } from "./IEnvironment";
import { StorableRepostoryApi } from './StorableRepositoryApi';

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

   private storableApi: StorableRepostoryApi;
   /**
    * Initializes a new instance of the class with the provided environment and session key.
    * 
    * @param environment_ The environment settings to be used.
    * @param sessionKey_ The session key for authentication.
    */
   public constructor(environment_: IEnvironment, sessionKey_: string) {
      super (environment_, sessionKey_);

      this.storableApi = new StorableRepostoryApi();
   }  

   /**
    * Asynchronously loads a record from the activity repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
    */
   async load (recordId: string) : Promise<IStorable | undefined> {

      let apiUrl = this.environment.getActivityApi() + "?session=" + this.sessionKey.toString();
      return this.storableApi.load (recordId, apiUrl);  
   }

   /**
    * Asynchronously saves a record to the activity repository API.
    * 
    * @param record - The record to be saved, must implement the IStorable interface.
    * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
    */
   async save (record: IStorable) : Promise<boolean> {

      let apiUrl = this.environment.saveActivityApi() + "?session=" + this.sessionKey.toString();
      
      return this.storableApi.save (record, apiUrl);
   }

   /**
    * Asynchronously removes a record from the activity repository API.
    * 
    * @param recordId - The ID of the record to be removed.
    * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
    */
   async remove (recordId: string) : Promise<boolean> {

      let apiUrl = this.environment.removeActivityApi() + "?session=" + this.sessionKey.toString();
      return this.storableApi.remove (recordId, apiUrl);  
   }

   /**
    * Asynchronously retrieves recent records from the activity repository API based on the provided query specifications.
    * 
    * @param querySpec - The query specifications including the limit and storeClassName to filter the records.
    * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
    */
   async recent (querySpec: IStorablesQuerySpec) : Promise<Array<IStorable>> {

      let apiUrl = this.environment.getActivitiesApi() + "?session=" + this.sessionKey.toString();

      return this.storableApi.recent (querySpec, apiUrl);  
   }
}
