// Copyright (c) 2024 Braid Technologies Ltd

// 3rd party imports
import axios from "axios";

// Internal imports
import { IStoredActivity, IStoredUrlActivity, IStoredLikeUrlActivity, IStoredMessageActivity, urlActivityRecordClassName, urlLikeActivityRecordClassName, messageActivityRecordClassName } from './ActivityRecord';
import { SessionKey } from "./Keys";
import { IActivityRepository } from "./IActivityRepository";

import { getDefaultEnvironment } from "../../BraidCommon/src/IEnvironmentFactory";
import { ActivityRepostoryApi} from '../../BraidCommon/src/ActivityRepositoryApi';


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
