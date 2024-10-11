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

import { getDefaultEnvironment } from "../../Braid/BraidCommon/src/IEnvironmentFactory";
import { ActivityRepostoryApi} from '../../Braid/BraidCommon/src/ActivityRepositoryApi';
import { IStorable } from "../../Braid/BraidCommon/src/IStorable";

interface IStoreableActivityRecord extends IStorable {

   _id: string;
   _conversationId : string;
   _email : string;
   _happenedAt : Date;
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

      switch (record.storeClassName) {
         case UrlActivityRecord.className():
            return new UrlActivityRecord(record._id,
               record._conversationId,
               record._email, 
               record._happenedAt, 
               record._url);

         case MessageActivityRecord.className():
            return new MessageActivityRecord(record._id,
               record._conversationId,
               record._email, 
               record._happenedAt, 
               record._url);   
               
         default:
            throw new InvalidParameterError(record.storeClassName);
      }
   }

   async loadRecent (limit : number, className: string) : Promise<Array<ActivityRecord>> {
      
      let environment = getDefaultEnvironment ()  
      
      let api = new ActivityRepostoryApi (environment, this._sessionKey);

      // we downcast from IStorable to IStoreableActivityRecord bcs we know it is one
      let storedRecords : Array <IStoreableActivityRecord> = await api.recent ({ limit: limit, storeClassName: className}) as Array <IStoreableActivityRecord>; 

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
