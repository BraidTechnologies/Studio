'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi to publish to Azure' to run locally
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";
var crypto = require("crypto");   

// Internal imports
//import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";

const defaultPartitionKey = "6ea3299d987b4b33a1c0b079a833206f";

/**
 * Saves an activity record based on the provided request and context.
 * Validates the session key from the request query parameters against predefined session keys.
 * If the session key is valid, logs the validation status, processes the JSON request, and saves the activity.
 * Returns an HTTP response with a status code and the session key or an error message.
 *
 * @param request - The HTTP request containing the activity data.
 * @param context - The context for the current invocation.
 * @returns A promise that resolves to an HTTP response with the status and response body.
 */
export async function SaveActivity(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let requestedSession : string | null = null;     

   for (const [key, value] of request.query.entries()) {
       if (key === 'session')
           requestedSession = value;                
   }

   if ((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) {       

      context.log("Passed session key validation:" + requestedSession);  
      
      let jsonRequest: any = await request.json();    

      try {
         await saveActivity (jsonRequest, context);
         context.log("Saved:" + jsonRequest.toString());           
      }
      catch (e: any) {
         context.log("Failed save:" + e);           
      }

      return {
         status: 200, // Ok
         body: requestedSession
      };         
   }
   else 
   {
       context.log("Failed session key validation:" + requestedSession);  

       return {
          status: 401, // Unauthorised
          body: "Authorization check failed."
       };             
   }
};

app.http('SaveActivity', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: SaveActivity
});

function getAuthorizationTokenUsingMasterKey(verb: string, resourceType: string, resourceId: string, date: string, masterKey: string) {  

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

function activityToken(verb: string, time: string, key: string) { 

   //throwIfUndefined(key);
   return getAuthorizationTokenUsingMasterKey( verb, "docs", "dbs/BraidLms/colls/Activity", time, 
                                               key);
}

function makePostActivityToken(time: string, key: string) { 

   return activityToken( "post", time, key);
}

function makePostActivityHeader (key : string, time : string, defaultPartitionKey : string) : object {
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

async function saveActivity (record : any, context: InvocationContext) : Promise<boolean> {
      
      let dbkey = process.env.CosmosApiKey;   

      let done = new Promise<boolean>(function(resolve, reject) {

      let time = new Date().toUTCString();
      let stream = JSON.stringify (record); 
      let document = JSON.parse(stream);
      document.data = record;

      //throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key. 
      let key = makePostActivityToken(time, dbkey as string); 
      let headers = makePostActivityHeader (key, time, defaultPartitionKey); 

      document.partition = defaultPartitionKey; // Dont need real partitions until 10 GB ... 
      document.id = document.data.id; // Need to copy ID up from activity object, since MDynamicallyStreamable streams only the class name. 

      axios.post('https://braidlms.documents.azure.com/dbs/BraidLms/colls/Activity/docs', 
         document,
         {
            headers: headers             
         })
         .then((resp : any) => {

            resolve(true);
         })
         .catch((error: any) => {   

            context.log ("Error calling database:", error);   
            reject(false);     
         });  
      });
   
   return done;
}

