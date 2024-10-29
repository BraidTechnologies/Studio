// Copyright (c) 2024 Braid Technologies Ltd

import { InvalidParameterError } from './Errors';
import { MDynamicStreamable, DynamicStreamableFactory } from "./StreamingFramework";
import { ActivityRecord} from './ActivityRecord';

const messageRecordClassName = "MessageActivityRecord";

// MessageActivityRecord - activity details plus the text of a message. 
export class MessageActivityRecord extends ActivityRecord {
   private _message: string;

   /**
    * Create an empty MessageActivityRecord object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a MessageActivityRecord object
    * @param id_ - id to use to generate uniqueness 
    * @param conversationId_ - ID of the conversation in which the event occurred
    * @param email_ - plain text email.
    * @param happenedAt_ - timestamp for last interaction seen by the framework
    * @param message_ - the URL that was interacted with
    */
   public constructor(id_: string | undefined, conversationId_: string | undefined, email_: string, happenedAt_: Date, message_: string);

   /**
    * Create a MessageActivityRecord object
    * @param messageActivityRecord - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(messageActivityRecord: MessageActivityRecord);

   public constructor(...arr: any[])
   {

      if (arr.length === 0) {
         super();         
         this._message = "";     // null URL is OK
         return;
      }

      var localMessage: string;

      if (arr.length === 1) {         
         super(arr[0]);
         localMessage = arr[0].message;
      }
      else { 
         super(arr[0], arr[1], arr[2], arr[3]);         
         localMessage = arr[4];
      }

      if (!MessageActivityRecord.isValidMessage(localMessage)) {
         throw new InvalidParameterError("Url:" + localMessage + '.');
      }

      this._message = localMessage;
   }

   /**
    * Dynamic creation for Streaming framework
    */
   dynamicClassName(): string {

      return messageRecordClassName;
   }

   static className(): string {

      return messageRecordClassName;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new MessageActivityRecord();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(messageRecordClassName, MessageActivityRecord.createDynamicInstance);
   streamOut(): string {

      return JSON.stringify({ id: this.id, conversationId: this.contextId, email: this.userId, happenedAt: this.created, message: this._message});
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new MessageActivityRecord (obj.id, obj.conversationId, obj.email, new Date(obj.happenedAt), obj.message));
   }

   /**
   * set of 'getters' for private variables
   */
   get message(): string {
      return this._message;
   }

   /**
   * set of 'setters' for private variables
   */

   set message (message: string) {
      if (!MessageActivityRecord.isValidMessage(message)) {
         throw new InvalidParameterError("message:" + message + '.');
      }

      this._message = message;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: MessageActivityRecord): boolean {
      return (super.equals (rhs) && 
         (this._message === rhs._message));
   }


   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: MessageActivityRecord): MessageActivityRecord {
      super.assign (rhs);
      this._message = rhs._message;

      return this;
   }

   /**
    * test for valid message 
    * @param message_ - the string to test
    */
   static isValidMessage(message_: string): boolean {

      if (message_ == undefined)
         return false;

      return true; // Currently allow anything, even empty string. 
   }
}
