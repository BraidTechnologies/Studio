'use strict';
// Copyright Braid Technologies Ltd, 2024

// 3rd party imports
var crypto = require("crypto");

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
 * @param path - path for which we need a token 
 * @param key The master key for authorization.
 * @returns The generated authorization token for the activity.
 */
export function storableToken(verb: string, time: string, path: string, key: string) {

   //throwIfUndefined(key);
   return getAuthorizationTokenUsingMasterKey(verb, "docs", path, time, key);
}

/**
 * Generates an authorization token for deleting an activity using the master key.
 * 
 * @param time The current time in lowercase.
 * @param collectionPath - path to the collection in Cosmos * 
 * @param key The master key used for authorization.
 * @param id The ID of the activity to be deleted.
 * @returns The authorization token for the delete operation.
 */
export function makeStorableDeleteToken(time: string, collectionPath: string, key: string, id: string) {

   return storableToken ("delete", time, collectionPath + "/docs/" + id, key);
}

/**
 * Generates a post activity token using the provided time and key.
 * 
 * @param time The timestamp for the token generation.
 * @param collectionPath - path to the collection in Cosmos
 * @param key The key used for generating the token.
 * @returns The post activity token.
 */
export function makeStorablePostToken(time: string, collectionPath: string, key: string) {

   return storableToken("post", time, collectionPath, key);
}

/**
 * Creates a header object for a POST to a table with the specified key, time, and partition key.
 * @param key The authorization key for the table.
 * @param time The timestamp for the operation.
 * @param partitionKey The default partition key for the table.
 * @returns An object containing the necessary header for the POST.
 */
export function makePostHeader(key: string, time: string, partitionKey: string): object {
   return {
      "Authorization": key,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "x-ms-date": time,
      "x-ms-version": "2018-12-31",
      "Cache-Control": "no-cache",
      "x-ms-documentdb-is-upsert": "True",
      "x-ms-documentdb-partitionkey": "[\"" + partitionKey + "\"]",
      "x-ms-consistency-level": "Eventual"
   };
}

/**
 * Creates header for a delete activity request.
 * 
 * @param key - The authorization key.
 * @param time - The timestamp.
 * @param partitionKey - The default partition key.
 * @returns An object containing the header for the delete activity request.
 */
export function makeDeleteHeader(key: string, time: string, partitionKey: string): object {
   return {
      "Authorization": key,
      "Accept": "application/json",
      "x-ms-date": time,
      "x-ms-version": "2018-12-31",
      "Cache-Control": "no-cache",
      "x-ms-documentdb-partitionkey": "[\"" + partitionKey + "\"]",
      "x-ms-consistency-level": "Eventual"
   };
}

/**
 * Creates a header object for a POST activity query with the specified key, time, and default partition key.
 * @param key The authorization key for the query.
 * @param time The timestamp for the query.
 * @param partitionKey The default partition key for the query.
 * @returns An object containing the necessary headers for the POST activity query.
 */
export function makePostQueryHeader(key: string, time: string, partitionKey: string): object {
   return {
      "Authorization": key,
      "Content-Type": "application/query+json",
      "Accept": "application/json",
      "x-ms-date": time,
      "x-ms-version": "2018-12-31",
      "Cache-Control": "no-cache",
      "x-ms-documentdb-partitionkey": "[\"" + partitionKey + "\"]",
      "x-ms-consistency-level": "Eventual",
      "x-ms-documentdb-isquery": "True"
   };
}