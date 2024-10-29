// Copyright (c) 2024 Braid Technologies Ltd

// 3rd party imports
import axios from "axios";

// Internal imports
import { InvalidParameterError } from "./Errors";
import { ActivityRecord } from './ActivityRecord';
import { UrlActivityRecord } from "./ActivityRecordUrl";
import { MessageActivityRecord } from "./ActivityRecordMessage";
import { SessionKey } from "./Keys";
import { IActivityRepository } from "./IActivityRepository";

import { getDefaultEnvironment } from "../../BraidCommon/src/IEnvironmentFactory";
import { ActivityRepostoryApi} from '../../BraidCommon/src/ActivityRepositoryApi';
import { IStorable } from "../../BraidCommon/src/IStorable";

interface IStoreableActivityRecord extends IStorable {

   _url : string
}


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


   async save (record : ActivityRecord) : Promise<boolean> {
      
      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      return api.save (record);      
   }

   async loadRecentUrlActivity (count : number) : Promise<Array<ActivityRecord>> {
      return this.loadRecent (count, UrlActivityRecord.className());
   }

   async loadRecentMessages (count : number) : Promise<Array<ActivityRecord>> {
      return this.loadRecent (count, MessageActivityRecord.className());
   }

   createFromDb (record: IStoreableActivityRecord) : ActivityRecord {

      let innerFromDb: any = record;

      switch (record.className) {
         case UrlActivityRecord.className():
            return new UrlActivityRecord(innerFromDb.id,
               innerFromDb._contextId,
               innerFromDb._userId, 
               innerFromDb._happenedAt, 
               record._url);

         case MessageActivityRecord.className():
            return new MessageActivityRecord(innerFromDb._id,
               innerFromDb._contextId,
               innerFromDb._userId as string, 
               innerFromDb._created, 
               record._url);   
               
         default:
            throw new InvalidParameterError(record.className);
      }
   }

   async loadRecent (limit : number, className: string) : Promise<Array<ActivityRecord>> {
      
      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      // we downcast from IStorable to IStoreableActivityRecord bcs we know it is one
      let storedRecords : Array <IStoreableActivityRecord> = await api.recent ({ limit: limit, className: className}) as Array <IStoreableActivityRecord>; 

      let records = new Array<ActivityRecord> ();
      for (let i = 0; i < storedRecords.length; i++) {

         let obj = this.createFromDb (storedRecords[i]);
         records.push (obj);
      }
   
      return records;
   }

   async removeMessageRecord (recordId: string) : Promise<boolean> {

      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      return api.remove (recordId);
   }
}
