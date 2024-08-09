'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';

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
      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.saveActivityApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSaveActivityCall (apiUrl);

      expect (summary && summary?.length > 0).toBe (true) ;         

   }).timeout(20000);

   it("Needs to succeed with valid key in production environment", async function () {
      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.saveActivityApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSaveActivityCall (apiUrl);

      expect (summary && summary?.length > 0).toBe (true) ;   

   }).timeout(20000);

   it("Needs to fail with invalid key.", async function () {

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.saveActivityApi() + "?session=" + "thiswillfail";

      let caught = await invalidSaveActivityCall (apiUrl);
      
      expect (caught).toBe (true) ;         

  }).timeout(20000);

  it("Needs to fail with invalid key in production environment.", async function () {

      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.saveActivityApi() + "?session=" + "thiswillfail";

      let caught = await invalidSaveActivityCall (apiUrl);
      
      expect (caught).toBe (true) ;         

}).timeout(20000);

});