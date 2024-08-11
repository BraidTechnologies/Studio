'use strict';
// Copyright Braid Technologies Ltd, 2024

// 3rd party imports
var crypto = require("crypto");   

export const defaultPartitionKey = "6ea3299d987b4b33a1c0b079a833206f";


/**
 * Generates an authorization token using the provided master key for the given verb, resource type, resource ID, and date.
 * 
 * @param verb The HTTP verb for the request.
 * @param resourceType The type of the resource being accessed.
 * @param resourceId The ID of the resource being accessed.
 * @param date The date of the request.
 * @param masterKey The master key used for generating the token.
 * @returns The encoded authorization token.
 */
export function getAuthorizationTokenUsingMasterKey(verb: string, resourceType: string, resourceId: string, date: string, masterKey: string) {  

    var key = Buffer.from(masterKey, "base64");  
  
    var text = (verb || "").toLowerCase() + "\n" +   
               (resourceType || "").toLowerCase() + "\n" +   
               (resourceId || "") + "\n" +   
               date.toLowerCase() + "\n" +   
               "" + "\n";  
  
    var body = Buffer.from(text, "utf8");  
    var signature = crypto.createHmac("sha256", key).update(body).digest("base64");  
  
    var MasterToken = "master";  
  
    var TokenVersion = "1.0";  
  
    var encoded = encodeURIComponent("type=" + MasterToken + "&ver=" + TokenVersion + "&sig=" + signature);  

    return encoded;
}


/**
 * Generates an activity token for authorization using the provided verb, time, and key.
 * 
 * @param verb The HTTP verb for the request.
 * @param time The timestamp for the request.
 * @param key The master key for authorization.
 * @returns The generated authorization token for the activity.
 */
export function activityToken(verb: string, time: string, key: string) { 

   //throwIfUndefined(key);
   return getAuthorizationTokenUsingMasterKey( verb, "docs", "dbs/BraidLms/colls/Activity", time, 
                                               key);
}

/**
 * Generates a post activity token using the provided time and key.
 * 
 * @param time The timestamp for the token generation.
 * @param key The key used for generating the token.
 * @returns The post activity token.
 */
export function makePostActivityToken(time: string, key: string) { 

   return activityToken( "post", time, key);
}

/**
 * Generates an authorization token for deleting an activity using the master key.
 * 
 * @param time The current time in lowercase.
 * @param key The master key used for authorization.
 * @param id The ID of the activity to be deleted.
 * @returns The authorization token for the delete operation.
 */
export function makeDeleteActivityToken(time: string, key: string, id: string) { 

   return getAuthorizationTokenUsingMasterKey( "delete", "docs", "dbs/BraidLms/colls/Activity/docs/" + id, 
                                                time, 
                                                key);
}

/**
 * Creates a header object for a POST activity with the specified key, time, and default partition key.
 * @param key The authorization key for the activity.
 * @param time The timestamp for the activity.
 * @param defaultPartitionKey The default partition key for the activity.
 * @returns An object containing the necessary header for the POST activity.
 */
export function makePostActivityHeader (key : string, time : string, defaultPartitionKey : string) : object {
   return {                  
      "Authorization": key,
      "Content-Type": "application/json",    
      "Accept": "application/json",               
      "x-ms-date": time,
      "x-ms-version" : "2018-12-31",
      "Cache-Control": "no-cache",
      "x-ms-documentdb-is-upsert" : "True",
      "x-ms-documentdb-partitionkey" : "[\"" + defaultPartitionKey + "\"]", 
      "x-ms-consistency-level" : "Eventual"
   };
}

/**
 * Creates header for a delete activity request.
 * 
 * @param key - The authorization key.
 * @param time - The timestamp.
 * @param defaultPartitionKey - The default partition key.
 * @returns An object containing the header for the delete activity request.
 */
export function makeDeleteActivityHeader (key : string, time : string, defaultPartitionKey : string) : object {
   return {                  
      "Authorization": key,
      "Accept": "application/json",               
      "x-ms-date": time,
      "x-ms-version" : "2018-12-31",
      "Cache-Control": "no-cache",
      "x-ms-documentdb-partitionkey" : "[\"" + defaultPartitionKey + "\"]", 
      "x-ms-consistency-level" : "Eventual"
   };
}

/**
 * Creates a header object for a POST activity query with the specified key, time, and default partition key.
 * @param key The authorization key for the query.
 * @param time The timestamp for the query.
 * @param defaultPartitionKey The default partition key for the query.
 * @returns An object containing the necessary headers for the POST activity query.
 */
export function makePostActivityQueryHeader (key : string, time : string, defaultPartitionKey : string) : object {
   return {                  
      "Authorization": key,
      "Content-Type": "application/query+json",    
      "Accept": "application/json",               
      "x-ms-date": time,
      "x-ms-version" : "2018-12-31",
      "Cache-Control": "no-cache",
      "x-ms-documentdb-partitionkey" : "[\"" + defaultPartitionKey + "\"]", 
      "x-ms-consistency-level" : "Eventual",
      "x-ms-documentdb-isquery" : "True"
   };
}