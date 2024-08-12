// Copyright (c) 2024 Braid Technologies Ltd


export interface IStorable {

                            // member variables prefixed 'store' to reduce chances of clashes with derived classes that implement this.                             
   storeId : string;        // id of the object that is stored
   storeContextId: string;  // id to identify context - such as a conversation in Boxed
   storeUserId: string;     // id to idemtify the user
   storeTimestamp: Date;    // timestamp
   storeClassName: string;  // className - all further firlds are specific to the class
}


export interface IStoreQuerySpec {

   limit : number;          // limit of records to return
   storeClassName: string;       // what sort of records to return
}