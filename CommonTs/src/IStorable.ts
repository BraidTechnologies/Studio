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
 * - functionalSearchKey: string | undefined - used if the app needs to searcg by an attribute other than primary key
 * - created: Date - timestamp of creation
 * - amended: Date - timestamp of amendment
 * - className: string - class name; further fields are class-specific
 * - schemaVersion: string - allows versioning on the schema* 
 */
export interface IStorable {
                       
   id : string | undefined;  // id of the object that is stored - primary key. Can be undefined before the object is stored. 
   applicationId: string;    // Name of the application that generated and uses the chunk
   contextId: string | undefined;  // id to identify context - such as a conversation in Boxer. Undefined if application has no multi-tenanting. 
   functionalSearchKey: string | undefined; // Used if the app needs to searcg by an attribute other than primary key
   userId: string | undefined;     // id to identify the user. Undefined if there is no direct user. 
   created: string;      // creation timestamp as ISO date string
   amended: string;      // amend timestamp as ISO date string  
   className: string;  // className - all further fields are specific to the class
   schemaVersion: string;  // Allow versioning on the schema       
}

/**
 * Defines the structure of a query specification for searching for multiple records.
 * Includes the limit of records to return and the class name of the records to be stored / retrieved.
 */
export interface IStorableMultiQuerySpec {

   limit : number;          // limit of records to return
   className: string;       // what sort of records to return
}

/**
 * Defines the structure of a query specification for searching for a single record.
 * Includes the id (primary key) of the record. 
 */
export interface IStorableQuerySpec {

   id : string | undefined;  // id of the object that is stored - primary key.  
   functionalSearchKey: string | undefined; // If the id is unefined, this is used for the search
}

/**
 * Defines the structure of a query specification for searching for a single record.
 * Includes the id (primary key) of the record. 
 */
export interface IStorableOperationResult {

   ok :boolean;  // True if operation succeeeded
}