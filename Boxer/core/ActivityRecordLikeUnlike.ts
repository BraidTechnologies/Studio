// Copyright (c) 2024 Braid Technologies Ltd

import { InvalidParameterError } from './Errors';
import { MDynamicStreamable, DynamicStreamableFactory } from "./StreamingFramework";
import { UrlActivityRecord } from './ActivityRecordUrl';

const likeUnlikeActivityRecordClassName = "LikeUnlikeActivityRecord";

// ActivityRecord - activity details plus the URL they clicked on 
export class LikeUnlikeActivityRecord extends UrlActivityRecord {
   private _like: boolean;

   /**
    * Create an empty LikeUnlikeActivityRecord object - required for particiation in serialisation framework
    */
   public constructor();

   /**
    * Create a LikeDislikeActivityRecord object
    * @param id_ - id to use to generate uniqueness 
    * @param conversationId_ - ID of the conversation in which the event occurred
    * @param email_ - plain text email.
    * @param happenedAt_ - timestamp for last interaction seen by the framework
    * @param url_ - the URL that was interacted with
    * @param like_ - true if it was a like, false for a dislike. defaults to true. 
    */
   public constructor(id_: string | undefined, conversationId_: string | undefined, email_: string, happenedAt_: Date, url_: string, like_: boolean);

   /**
    * Create a LikeDislikeActivityRecord object
    * @param activityRecord - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(activityRecord: LikeUnlikeActivityRecord);

   public constructor(...arr: any[])
   {

      if (arr.length === 0) {
         super();         
         this._like = true;     // default to true
         return;
      }

      var localLike: boolean;

      if (arr.length === 1) {         
         super(arr[0]);
         localLike = arr[0].like;
      }
      else { 
         super(arr[0], arr[1], arr[2], arr[3], arr[4]);         
         localLike = arr[5];
      }

      this._like = localLike;
   }

   /**
    * Dynamic creation for Streaming framework
    */
   className(): string {

      return likeUnlikeActivityRecordClassName;
   }

   static className(): string {

      return likeUnlikeActivityRecordClassName;
   }

   static createDynamicInstance(): MDynamicStreamable {
      return new LikeUnlikeActivityRecord();
   }

   static _dynamicStreamableFactory: DynamicStreamableFactory = new DynamicStreamableFactory(likeUnlikeActivityRecordClassName, LikeUnlikeActivityRecord.createDynamicInstance);
   streamOut(): string {

      return JSON.stringify({ id: this.id, conversationId: this.conversationId, email: this.email, happenedAt: this.happenedAt, url: this.url, like: this._like});
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new LikeUnlikeActivityRecord (obj.id, obj.conversationId, obj.email, new Date(obj.happenedAt), obj.url, obj.like));
   }

   /**
   * set of 'getters' for private variables
   */
   get like(): boolean {
      return this._like;
   }

   /**
   * set of 'setters' for private variables
   */

   set like (like_: boolean) {

      this._like = like_;
   }

   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: LikeUnlikeActivityRecord): boolean {
      return (super.equals (rhs) && 
         (this._like === rhs._like));
   }


   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: LikeUnlikeActivityRecord): LikeUnlikeActivityRecord {
      super.assign (rhs);
      this._like = rhs._like;

      return this;
   }
}
