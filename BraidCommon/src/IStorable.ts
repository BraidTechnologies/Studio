// Copyright (c) 2024 Braid Technologies Ltd


export interface IStorable {

   id : string;             // id of the object that is stored
   contextId: string;       // id to identify context - such as a conversation in Boxed
   userId: string;          // id to idemtify the user
   timestamp: Date;         // timestamp
   className: string;       // className - all further firlds are specific to the class
}


export interface IStoreQuerySpec {

   limit : number;          // limit of records to return
   className: string;       // what sort of records to return
}