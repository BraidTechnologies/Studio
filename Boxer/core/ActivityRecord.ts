// Copyright (c) 2024 Braid Technologies Ltd

import { IStorable } from '../../BraidCommon/src/IStorable';
import { InvalidParameterError } from './Errors';
import { MDynamicStreamable, DynamicStreamableFactory } from "./StreamingFramework";
import { getDefaultKeyGenerator } from './IKeyGeneratorFactory'; 
import { EStorableApplicationIds } from '../../BraidCommon/src/IStorable';

const activityRecordClassName = "ActivityRecord";
const keyGenerator = getDefaultKeyGenerator();

// ActivityRecord - conversation ID, email of a person and a datestamp. Will have many derived classes according to different activity types. 
export class ActivityRecord extends MDynamicStreamable implements IStorable {

   // TODO - this is a bit hacky.
   // The resurrection code in the repository has to know the inner working of the CosmoDB format to create a new object. 
   // This is a consequence of overriding some vairables from IStorable by IStoreableActivityRecord, which it does to add validation. 
   private _id: string;
   private _contextId: string | undefined;
   private _userId: string  | undefined;
   private _created: Date;

   // Variables we need to implement IStoreable

   className: string = "";
   applicationId: string = EStorableApplicationIds.kBoxer;
   amended = this.created;
   schemaVersion = 1;


   /**
    * Create an empty ActivityRecord object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a ActivityRecord object
    * @param id_ - id to use to generate uniqueness . Can be undefined if it has not yet been saved. 
    * @param email_ - plain text email.
    * @param conversationId_ - ID of the conversation in which the event occurred
    * @param happenedAt_ - timestamp for last interaction seen by the framework
    */
   public constructor(id_: string | undefined, conversationId_: string, email_: string, happenedAt_: Date);

   /**
    * Create a ActivityRecord object
    * @param activityRecord - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(activityRecord: ActivityRecord);

   public constructor(...arr: any[])
   {

      super();

      if (arr.length === 0) {
         this._id = keyGenerator.generateKey(); // A new ActivityRecord has a key
         this._contextId = undefined;
         this._userId = "";     // But not a name 
         this._created = ActivityRecord.makeDateUTC (new Date());

         this.copyStorableAttributes();       
         return;
      }

      var localId: string;
      var localConversationId; 
      var localEmail: string;
      var localHappenedAt: Date;

      if (arr.length === 1) {
         localId = arr[0]._id;
         localConversationId = arr[0]._contextId;
         localEmail = arr[0]._userId;
         localHappenedAt = new Date(arr[0]._created);
      }
      else { 
         localId = arr[0];
         localConversationId = arr[1];         
         localEmail = arr[2];
         localHappenedAt = new Date (arr[3]);
      }

      if (!ActivityRecord.isValidId(localId)) {
         throw new InvalidParameterError("iD:" + localId + '.');
      }    
      if (!ActivityRecord.isValidConversationId(localConversationId)) {
         throw new InvalidParameterError("conversationId:" + localConversationId + '.');
      }        
      if (!ActivityRecord.isValidEmail(localEmail)) {
         throw new InvalidParameterError("email:" + localEmail + '.');
      }

      this._id = localId;
      this._contextId = localConversationId;
      this._userId = localEmail;
      this._created = ActivityRecord.makeDateUTC (localHappenedAt);    

      this.copyStorableAttributes();      
   }

   copyStorableAttributes (): void {

      this.className = this.dynamicClassName();
   }

   /**
    * Dynamic creation for Streaming framework
    */
   dynamicClassName(): string {

      return activityRecordClassName;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new ActivityRecord();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(activityRecordClassName, ActivityRecord.createDynamicInstance);
   streamOut(): string {

      return JSON.stringify({ id: this._id, conversationId: this._contextId, email: this._userId, 
         happenedAt: this._created.toUTCString() });   // US UTC as Cosmos DB does not really understand dates. 
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new ActivityRecord (obj.id, obj.conversationId, obj.email, new Date(obj.happenedAt)));
   }

   /**
   * set of 'getters' for private variables
   */
   get id(): string | undefined {
      return this._id;
   }
   get contextId(): string {
      return this._contextId as string; // Cannot be undefined as we have guards on creation
   }   
   get userId(): string {
      return this._userId as string;
   }
   get created(): Date {
      return this._created as Date;
   }

   /**
   * set of 'setters' for private variables
   */
   set id(id_: string) {

      if (!ActivityRecord.isValidId(id_)) {
         throw new InvalidParameterError("Id:" + id_ + '.');
      }         
      this._id = id_;
   }

   set contextId(conversationId_: string | undefined) {
         
      if (!ActivityRecord.isValidConversationId(conversationId_)) {
         throw new InvalidParameterError("conversationId:" + conversationId_ + '.');
      }        
      this._contextId = conversationId_;
   }

   set userId (email_: string) {
      if (!ActivityRecord.isValidEmail(email_)) {
         throw new InvalidParameterError("Email:" + email_ + '.');
      }

      this._userId = email_;
   }

   set created(happenedAt_: Date) {

      this._created = ActivityRecord.makeDateUTC (happenedAt_);
      this.amended = this._created;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: ActivityRecord): boolean {
      return ((((typeof this._id === "undefined") && (typeof rhs._id === "undefined")) || (this._id === rhs._id)) &&
         (((typeof this._contextId === "undefined") && (typeof rhs._contextId === "undefined")) || (this._contextId === rhs._contextId)) &&      
         (this._userId === rhs._userId) &&
         (this.areSameDate (this._created, rhs._created)));
   }

   areSameDate (lhs: Date, rhs : Date) : boolean {

      let l = lhs.getTime();
      let r = rhs.getTime();

      if (l === r) {
         return true;
      }
      return false;
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: ActivityRecord): ActivityRecord {
      
      this._id = rhs._id;
      this._contextId = rhs._contextId;
      this._userId = rhs._userId;
      this._created = new Date (rhs._created);

      this.copyStorableAttributes ();

      return this;
   }

   /**
    * test for valid id 
    * @param id - the string to test
    */
   static isValidId(id_: string): boolean {
      if (!id_) // undefined keys are allowed if user object has not been originated from or saved anywhere persistent
         return true;

      if (id_ && id_.length > 0) // if the id exists, must be > zero length
         return true;

      return (false);
   }

   /**
    * test for valid id 
    * @param id - the string to test
    */
   static isValidConversationId(conversationId_: string | undefined): boolean {
      if (!conversationId_) // undefined keys are allowed if user object has not been originated from or saved anywhere persistent
         return true;

      if (conversationId_ && conversationId_.length > 0) // if the id exists, must be > zero length
         return true;

      return (false);
   }

   /**
    * test for valid email 
    * @param email - the string to test
    */
   static isValidEmail(email: string | undefined): boolean {

      if (email == undefined)
         return false;

      return true; // Currently allow anything, even empty string. 
   }

   static makeDateUTC(rhs: Date) : Date {
      let d = new Date (rhs);
      d.setMilliseconds(0); // MSecs are not used in UTC, and Cosmos DB recommends UTC
      return d;
   }
}
