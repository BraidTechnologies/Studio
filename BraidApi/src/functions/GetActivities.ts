'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish BraidApi' to publish to Azure 
// 'npm start' to run locally

// 3rd party imports
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import axios from "axios";   

// Internal imports
import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";
import { IStorable, IStoreQuerySpec } from "../../../BraidCommon/src/IStorable";
import {defaultPartitionKey, makePostActivityToken, makePostActivityQueryHeader} from './CosmosRepositoryApi';


export async function getActivities(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

   let requestedSession : string | null = null;     

   for (const [key, value] of request.query.entries()) {
       if (key === 'session')
           requestedSession = value;                
   }

   if ((requestedSession === process.env.SessionKey) || (requestedSession === process.env.SessionKey2)) {       

      context.log("Passed session key validation:" + requestedSession);  
      
      let jsonRequest: IStoreQuerySpec = await request.json() as IStoreQuerySpec; 
      let loaded: Array<IStorable> | undefined = undefined;   

      try {
         loaded = await loadRecent (jsonRequest, context);
         context.log("Loaded:" + loaded.toString());           
      }
      catch (e: any) {
         context.log("Failed load:" + e.toString());
         return {
            status: 500 , 
            body: "Failed load."
         };                   
      }

      return {
         status: 200, // Ok
         body: JSON.stringify (loaded)
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

app.http('GetActivities', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getActivities
});

async function loadRecent (querySpec: IStoreQuerySpec, context: InvocationContext) : Promise<Array<IStorable>> {
      
   let dbkey = process.env.CosmosApiKey; 

   let done = new Promise<Array<IStorable>>(function(resolve, reject) {

      let time = new Date().toUTCString();
      throwIfUndefined(dbkey); // Keep compiler happy, should not be able to get here with actual undefined key. 
      let key = makePostActivityToken(time, dbkey);     
      let headers = makePostActivityQueryHeader (key, time, defaultPartitionKey);              
      let query = "SELECT * FROM Activity a WHERE a.data.storeClassName = @storeClassName ORDER BY a.data.timestamp DESC OFFSET 0 LIMIT " + querySpec.limit.toString();

      axios.post('https://braidlms.documents.azure.com/dbs/BraidLms/colls/Activity/docs', 
      {
         "query": query,  
         "parameters": [  
           {  
             "name": "@storeClassName",  
             "value": querySpec.storeClassName
           }
         ]  
      },
      {
         headers: headers           
      })
      .then((resp : any) => {

         let responseRecords = resp.data.Documents;
         let storedRecords = new Array<IStorable> ();

         for (let i = 0; i < responseRecords.length; i++) {
            storedRecords.push (responseRecords[i].data);
         }         

         resolve(storedRecords);
      })
      .catch((error: any) => {   

         context.log ("Error calling database:", error);  
         reject(new Array<IStorable> ());     
      });  
   });

   return done;
}
