// Copyright (c) 2024 Braid Technologies Ltd

/**
 * Enum representing application names
 * 
 * @enum {string}
 */
export enum EStorableApplicationIds {

   kBoxer = "Boxer", 
   kWaterfall = "Waterfall"  
};

/**
 * Represents an interface for objects that can be stored.
 * 
 * Contains properties:
 * - id: string - the primary key of the stored object
 * - applicationId: string - identifies the application - one of the Enums above. 
 * - contextId: string - identifies the context, e.g., a conversation in Boxer
 * - userId: string | undefined - identifies the user; undefined if no direct user
 * - created: Date - timestamp of creation
 * - amended: Date - timestamp of amendment
 * - className: string - class name; further fields are class-specific
 * - schemaVersion: number - allows versioning on the schema* 
 */
export interface IStorable {
                       
   id : string | undefined;  // id of the object that is stored - primary key. Can be undefined before the object is stored. 
   applicationId: string;    // Name of the application that generated and uses the chunk
   contextId: string | undefined;  // id to identify context - such as a conversation in Boxer. Undefined if application has no multi-tenanting. 
   userId: string | undefined;     // id to identify the user. Undefined if there is no direct user. 
   created: Date;      // creation timestamp
   amended: Date;      // amend timestamp   
   className: string;  // className - all further fields are specific to the class
   schemaVersion: number;  // Allow versioning on the schema       
}

/**
 * Defines the structure of a query specification for storing records.
 * Includes the limit of records to return and the class name of the records to be stored / retrieved.
 */
export interface IStoreQuerySpec {

   limit : number;          // limit of records to return
   className: string;       // what sort of records to return
}