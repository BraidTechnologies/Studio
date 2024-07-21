'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';

declare var process: any;

describe("CheckSession", async function () {

   async function validSessionCall (apiUrl: string) : Promise<string | undefined> {
      var response: any;
      let summary : string | undefined = undefined;
   
      try {
         response = await axios.post(apiUrl, {
         });
         summary = (response.data as string);

         console.log (apiUrl + ", Returned:" + summary);

      } catch (e: any) {       

         console.error ("Error: " + apiUrl);           
      }     

      return summary;
   }

   async function invalidSessionCall (apiUrl: string) : Promise <Boolean> {
   
      var response: any;
      let caught = false;

      try {
         response = await axios.get(apiUrl, {
         });

      } catch (e: any) {       
         caught = true;
      }     

      return caught;
   }

   it("Needs to succeed with valid key in local environment", async function () {
      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.checkSessionApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSessionCall (apiUrl);

      expect (summary && summary?.length > 0).toBe (true) ;         

   }).timeout(20000);

   it("Needs to succeed with valid key in production environment", async function () {
      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.checkSessionApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSessionCall (apiUrl);

      expect (summary && summary?.length > 0).toBe (true) ;   

   }).timeout(20000);

   it("Needs to fail with invalid key.", async function () {

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.checkSessionApi() + "?session=" + "thiswillfail";

      let caught = await invalidSessionCall (apiUrl);
      
      expect (caught).toBe (true) ;         

  }).timeout(20000);

  it("Needs to fail with invalid key in production environment.", async function () {

      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.checkSessionApi() + "?session=" + "thiswillfail";

      let caught = await invalidSessionCall (apiUrl);
      
      expect (caught).toBe (true) ;         

}).timeout(20000);

});