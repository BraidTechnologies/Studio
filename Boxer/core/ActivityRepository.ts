// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module ActivityRepository
 * @description Provides repository implementation for storing and retrieving user activities in Braid.
 * 
 * This module implements the IActivityRepository interface to handle persistence of different
 * types of activity records (URLs visited, likes/unlikes, messages) to Cosmos DB. It provides:
 * - Activity saving through the ActivityRepositoryApi
 * - Loading of recent URL-based activities
 * - Loading of recent message activities
 * 
 * The repository requires a session key for authentication and uses the environment configuration
 * to determine the appropriate API endpoints for storage operations.
 */

// 3rd party imports
import axios from "axios";

// Internal imports
import { IStoredActivity, IStoredUrlActivity, IStoredLikeUrlActivity, IStoredMessageActivity, urlActivityRecordClassName, urlLikeActivityRecordClassName, messageActivityRecordClassName } from './ActivityRecord';
import { SessionKey } from "./Keys";
import { IActivityRepository } from "./IActivityRepository";

import { getDefaultEnvironment } from "../../CommonTs/src/IEnvironmentFactory";
import { ActivityRepostoryApi} from '../../CommonTs/src/ActivityRepositoryApi';


// ActivityRepositoryCosmos 
export class ActivityRepositoryCosmos implements IActivityRepository {

   private _sessionKey: string;

   /**
    * Create an ActivityRepository object 
    * @param sessionKey_ - joining key
    */
   public constructor(sessionKey_: SessionKey) {

      this._sessionKey = sessionKey_.toString();
   }


   async save (record : IStoredActivity) : Promise<boolean> {
      
      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      return api.save (record);      
   }

   async loadRecentUrlActivity (count : number) : Promise<Array<IStoredActivity>> {
      
      let clicks = await this.loadRecent (count, urlActivityRecordClassName);
      let likes = await this.loadRecent (count, urlLikeActivityRecordClassName);    
      
      let all = clicks.concat (likes);

      return all;
   }

   async loadRecentMessages (count : number) : Promise<Array<IStoredActivity>> {
      return this.loadRecent (count, messageActivityRecordClassName);
   }

   async loadRecent (limit : number, className: string) : Promise<Array<IStoredActivity>> {
      
      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      // we downcast IStoredActivity bcs we know it is one
      let storedRecords : Array <IStoredActivity> = await api.recent ({ limit: limit, className: className}) as Array <IStoredActivity>; 
   
      return storedRecords;
   }

   async removeMessageRecord (recordId: string) : Promise<boolean> {

      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      return api.remove (recordId);
   }
}
