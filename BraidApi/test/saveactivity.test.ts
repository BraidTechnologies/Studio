'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { ActivityRepostoryApi} from '../../BraidCommon/src/ActivityRepositoryApi'


declare var process: any;

describe("SaveActivity", async function () {

   async function validSaveActivityCall (apiUrl: string) : Promise<string | undefined> {
      var response: any;
      let summary : string | undefined = undefined;
   
      try {
         response = await axios.post(apiUrl, {
            id: Math.random().toString(),
            test: "Some test data"
         });
         summary = (response.data as string);

         console.log (apiUrl + ", Returned:" + summary);

      } catch (e: any) {       

         console.error ("Error: " + apiUrl);           
      }     

      return summary;
   }

   async function invalidSaveActivityCall (apiUrl: string) : Promise <Boolean> {
   
      var response: any;
      let caught = false;

      try {
         response = await axios.post(apiUrl, {
         });

      } catch (e: any) {       
         caught = true;
      }     

      return caught;
   }

   it("Needs to succeed with valid key in local environment", async function () {
      
      let api = new ActivityRepostoryApi (EEnvironment.kLocal, process.env.SessionKey.toString());

      let record = {
         id: Math.random().toString(),
         test: "Some test data"
      }

      let ok = await api.save (record); 

      expect (ok).toBe (true) ;         

   }).timeout(20000);

   it("Needs to succeed with valid key in production environment", async function () {
      
      let api = new ActivityRepostoryApi (EEnvironment.kProduction, process.env.SessionKey.toString());

      let record = {
         id: Math.random().toString(),
         test: "Some test data"
      }

      let ok = await api.save (record); 

      expect (ok).toBe (true) ;   

   }).timeout(20000);

   it("Needs to fail with invalid key.", async function () {

      let api = new ActivityRepostoryApi (EEnvironment.kLocal, "thiswillfail");

      let record = {
         id: Math.random().toString(),
         test: "Some test data"
      }

      let ok = await api.save (record); 

      expect (ok).toBe (false) ;        

  }).timeout(20000);

  it("Needs to fail with invalid key in production environment.", async function () {

   let api = new ActivityRepostoryApi (EEnvironment.kLocal, "thiswillfail");

   let record = {
      id: Math.random().toString(),
      test: "Some test data"
   }

   let ok = await api.save (record);    
   
   expect (ok).toBe (false) ;              

}).timeout(20000);

});