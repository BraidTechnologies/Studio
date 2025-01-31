// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module Like
 * @description Provides a class for managing likes in the Boxer application.
 * 
 * This module includes the Like class which handles:
 * - Creating and managing like objects with names and timestamps
 * - Supporting multiple constructor patterns for initialization
 * - Copying like objects from JSON or constructed sources
 */

/**
 * Embeddeding object
 * @param url - link to source on the web.
 * @param summary - text summary (50 words)
 * @param ada_v2: embedding value array. Note this is copied by value to avoid duplicating large arrays.
 * @param timeStamp - when the item is dated from - can be undefined if not known
 * @param relevance - cosine relevance score to a query - can be undefined if the source reference has not been compared yet
 */
export class Like  {
   private _name: string;
   private _when: Date;

   /**
    * Create an empty Like object
    */
   public constructor();

   /**
    * Create a Like object
    * @param name_ - link to source on the web.
    * @param when_ - text summary (50 words)
    */
   public constructor(name_: string, when_: Date);

   /**
    * Create a Like object
    * @param source - object to copy from - should work for JSON format and for real constructed objects
    */
   public constructor(source: Like);

   public constructor(...arr: any[])
   {

      if (arr.length === 0) {
         this._name = ""; 
         this._when = new Date();        
         return;
      }

      var localName: string;
      var localwhen: Date;

      if (arr.length === 1) {
         localName = arr[0]._name;
         localwhen = arr[0]._when;        
      }
      else { 
         localName = arr[0];
         localwhen = arr[1];           
      }

      this._name = localName;
      this._when = localwhen;
   }

   streamOut(): string {

      return JSON.stringify({ name: this._name, when: this._when});
   }

   streamIn(stream: string): void {

      const obj = JSON.parse(stream);

      this.assign(new Like (obj.name, obj.when));   
   }

   /**
   * set of 'getters' for private variables
   */
   get name(): string {
      return this._name;
   }
   get when(): Date {
      return this._when;
   }

   /**
   * set of 'setters' for private variables
   */
   set name(name_: string) {

      this._name = name_;
   }

   set when(when_: Date) {

      this._when = when_;
   }


   /**
    * test for equality - checks all fields are the same. 
    * Uses field values, not identity bcs if objects are streamed to/from JSON, field identities will be different. 
    * @param rhs - the object to compare this one to.  
    */
   equals(rhs: Like): boolean {

      return ((this._name === rhs._name) &&   
         (this._when.getTime() === rhs._when.getTime()));
   }

   /**
    * assignment operator 
    * @param rhs - the object to assign this one from.  
    */
   assign(rhs: Like): Like {

      this._name = rhs._name;
      this._when = new Date (rhs._when);

      return this;
   }
}

