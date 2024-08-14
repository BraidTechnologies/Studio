// Copyright (c) 2024 Braid Technologies Ltd

import { InvalidParameterError } from './Errors';
import { MDynamicStreamable, DynamicStreamableFactory } from "./StreamingFramework";
import { ActivityRecord} from './ActivityRecord';

const urlActivityRecordClassName = "UrlActivityRecord";

// ActivityRecord - activity details plus the URL they clicked on 
export class UrlActivityRecord extends ActivityRecord {
   private _url: string;

   /**
    * Create an empty UrlActivityRecord object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a UrlActivityRecord object
    * @param id_ - id to use to generate uniqueness 
    * @param conversationId_ - ID of the conversation in which the event occurred
    * @param email_ - plain text email.
    * @param happenedAt_ - timestamp for last interaction seen by the framework
    * @param url_ - the URL that was interacted with
    */
   public constructor(id_: string | undefined, conversationId_: string | undefined, email_: string, happenedAt_: Date, url_: string);

   /**
    * Create a UrlActivityRecord object
    * @param urlActivityRecord - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(urlActivityRecord: UrlActivityRecord);

   public constructor(...arr: any[])
   {

      if (arr.length === 0) {
         super();         
         this._url = "";     // null URL is OK
         return;
      }

      var localUrl: string;

      if (arr.length === 1) {         
         super(arr[0]);
         localUrl = arr[0].url;
      }
      else { 
         super(arr[0], arr[1], arr[2], arr[3]);         
         localUrl = arr[4];
      }

      if (!UrlActivityRecord.isValidUrl(localUrl)) {
         throw new InvalidParameterError("Url:" + localUrl + '.');
      }

      this._url = localUrl;
   }

   /**
    * Dynamic creation for Streaming framework
    */
   className(): string {

      return urlActivityRecordClassName;
   }

   static className(): string {

      return urlActivityRecordClassName;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new UrlActivityRecord();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(urlActivityRecordClassName, UrlActivityRecord.createDynamicInstance);
   streamOut(): string {

      return JSON.stringify({ id: this.id, conversationId: this.conversationId, email: this.email, happenedAt: this.happenedAt, url: this._url});
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new UrlActivityRecord (obj.id, obj.conversationId, obj.email, new Date(obj.happenedAt), obj.url));
   }

   /**
   * set of 'getters' for private variables
   */
   get url(): string {
      return this._url;
   }

   /**
   * set of 'setters' for private variables
   */

   set url (url_: string) {
      if (!UrlActivityRecord.isValidUrl(url_)) {
         throw new InvalidParameterError("Url:" + url_ + '.');
      }

      this._url = url_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: UrlActivityRecord): boolean {
      return (super.equals (rhs) && 
         (this._url === rhs._url));
   }


   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: UrlActivityRecord): UrlActivityRecord {
      super.assign (rhs);
      this._url = rhs._url;

      return this;
   }

   /**
    * test for valid url 
    * @param url_ - the string to test
    */
   static isValidUrl(url_: string): boolean {

      if (url_ == undefined)
         return false;

      return true; // Currently allow anything, even empty string. 
   }
}
