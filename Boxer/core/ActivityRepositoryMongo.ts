// Copyright (c) 2024 Braid Technologies Ltd

// 3rd party imports
import axios from "axios";


// Internal imports
import { InvalidParameterError } from "./Errors";
import { Environment, EEnvironment } from "./Environment";
import { EConfigStrings } from "./ConfigStrings";
import { KeyRetriever } from "./KeyRetriever";
import { logDbError, logApiError } from "./Logging";
import { ActivityRecord } from './ActivityRecord';
import { UrlActivityRecord } from "./ActivityRecordUrl";
import { MessageActivityRecord } from "./ActivityRecordMessage";
import { SessionKey } from "./Keys";
import { IActivityRepository } from "./IActivityRepository";
import { LikeUnlikeActivityRecord } from "./ActivityRecordLikeUnlike";


// ActivityRecord - email of a person and a datestamp. Will have many derived classes according to different activity types. 
export class ActivityRepositoryMongo implements IActivityRepository {

   private _dbkey: string | undefined;
   private _sessionKey: SessionKey;
   private _timer: NodeJS.Timeout | undefined;

   /**
    * Create an ActivityRepository object 
    * @param sessionKey_ - joining key
    */
   public constructor(sessionKey_: SessionKey) {

      this._dbkey = undefined;
      this._sessionKey = sessionKey_;
      this._timer = undefined;
   }

   disConnect () : void {
      if (this._timer) {
         clearInterval(this._timer);
         this._timer = undefined;
      }
   }

   async connect (sessionKey_ : SessionKey) : Promise<string | undefined> {
      let retriever = new KeyRetriever();
      var url: string;

      if (Environment.environment() === EEnvironment.kLocal)
         url = EConfigStrings.kRequestLocalMongoDbKeyUrl;
      else
         url = EConfigStrings.kRequestMongoDbKeyUrl;
      
      let self = this;

      // Set a timer to invalidate the key every 15 mins.
      // This well below the Mongo limit of 30 mins, foces us to keep refreshing
      if (!self._timer) {
         self._timer = setInterval(() => { 
            self._dbkey = undefined;
         }, 15*60*60*1000);         
      }

      let done = new Promise<string | undefined>(function(resolve, reject) {
         
         retriever.requestKey (url, 
            EConfigStrings.kSessionParamName, 
            sessionKey_)
         .then ((key) => {
            self._dbkey = key;
            resolve (key);
         })
         .catch ((error: any) => {
            logApiError ("Error getting database key:", error);   
            reject(undefined);   
         });
      });

      return done;
   }

   async save (record : ActivityRecord) : Promise<boolean> {
      
      let self = this;

      if (!self._dbkey) {
         await self.connect(self._sessionKey);
      }

      let done = new Promise<boolean>(function(resolve, reject) {

         let stream = record.streamOut ();
         let document = JSON.parse(stream);
         delete document.id; // Let Mongo put a new ID on for insert
         document.className = record.className(); // Save the class name as we store multiple types of derived class
         let key = self._dbkey;

         axios.post('https://eu-west-1.aws.data.mongodb-api.com/app/braidlmsclient-fsivu/endpoint/data/v1/action/insertOne', 
         {   
            "dataSource": "mongodb-atlas",
            "database": "BraidLms",
            "collection": "Activity",
            "document": document
          },
          {
             headers: {                  
               'Authorization': `Bearer ${key}`,
               "Content-Type": "application/ejson",                  
               "Accept": "application/json",
            }              
         })
         .then((resp : any) => {

            resolve(true);
         })
         .catch((error: any) => {   

            logDbError ("Error calling database:", error);   
            reject(false);     
         });  
      });
   
      return done;
   }

   async loadRecentUrlActivity (count : number) : Promise<Array<ActivityRecord>> {
      return this.loadRecent (count, UrlActivityRecord.className());
   }

   async loadRecentMessages (count : number) : Promise<Array<ActivityRecord>> {
      return this.loadRecent (count, MessageActivityRecord.className());
   }

   createFromDb (record: any) : ActivityRecord {

      switch (record.className) {
         case UrlActivityRecord.className():
            return new UrlActivityRecord(
               record._id.toString(),
               record._conversationId,
               record.email, 
               record.happenedAt, 
               record.url);

         case LikeUnlikeActivityRecord.className():
            return new LikeUnlikeActivityRecord(
               record._id.toString(),
               record._conversationId,
               record.email, 
               record.happenedAt, 
               record.url,
               record.like);               

         case MessageActivityRecord.className():
            return new MessageActivityRecord(
               record._id.toString(),
               record._conversationId,
               record.email, 
               record.happenedAt, 
               record.message); 
               
         default:
            throw new InvalidParameterError(record);
      }
   }   

   async loadRecent (count : number, className: string) : Promise<Array<ActivityRecord>> {
      
      let self = this;

      if (!self._dbkey) {
         await self.connect(self._sessionKey);
      }

      let done = new Promise<Array<ActivityRecord>>(function(resolve, reject) {

         let key = self._dbkey;

         axios.post('https://eu-west-1.aws.data.mongodb-api.com/app/braidlmsclient-fsivu/endpoint/data/v1/action/find', 
         {   
            "dataSource": "mongodb-atlas",
            "database": "BraidLms",
            "collection": "Activity",
            "sort": { "happenedAt": -1 },
            "limit": count     
          },
          {
             headers: {                  
               "Content-Type": "application/ejson",                  
               "Accept": "application/json",
               'Authorization': `Bearer ${key}`               
            }              
         })
         .then((resp : any) => {

            let responseRecords = resp.data.documents;
            let records = new Array<ActivityRecord>();

            for (let i = 0; i < responseRecords.length; i++) {
               let obj = self.createFromDb (responseRecords[i]);
               records.push (obj);
            }

            resolve(records);
         })
         .catch((error: any) => {   

            logDbError ("Error calling database:", error);   
            reject(new Array<ActivityRecord> ());     
         });  
      });
   
      return done;
   }

   removeMessageRecord (messageId: string) : Promise<boolean> {

      // TODO - not implemented yet, this just makes the code compile. 
      let done = new Promise<boolean >(function(resolve, reject) {
         resolve (false);
      });
      return done;
   }

}
