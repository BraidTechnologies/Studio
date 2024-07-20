'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../../BraidCommon/src/IEnvironment';

declare var process: any;

describe("Summarise", async function () {

   async function validSummaryCall (apiUrl: string, text: string) : Promise<string | undefined> {

      let summary: string | undefined = undefined;

      try {
         let response = await axios.post(apiUrl, {
           data: {
              text: text
           },
           headers: {
              'Content-Type': 'application/json'
           }
         });

         summary = (response.data as string);
         console.log (summary);
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return summary;
   }

   async function invalidSummaryCall (apiUrl: string, text: string) : Promise <Boolean> {
   
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

   it("Needs to fail if session key is incorrect", async function () {

      let sampleText : string | undefined = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.summariseApi() + "?session=" + "thiswillfail";

      let caught = await invalidSummaryCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to fail if session key is incorrect against production", async function () {

      let sampleText : string | undefined = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.summariseApi() + "?session=" + "thiswillfail";

      let caught = await invalidSummaryCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to summarise a simple message", async function () {

      let sampleText = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);

   
   it("Needs to summarise a long message", async function () {

      let baseText = "My name is Jon and I am founding an AI project acceleration company." ;  
      let sampleText = baseText;  
      for (var i = 0; i < 500; i++)  {
         sampleText = sampleText + " " + baseText;
      }

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(10000);   

   
   it("Needs to summarise a simple message against production", async function () {

      let sampleText = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);

   it("Needs to summarise a long message against production", async function () {

      let baseText = "My name is Jon and I am founding an AI project acceleration company." ;  
      let sampleText = baseText;  
      for (var i = 0; i < 500; i++)  {
         sampleText = sampleText + " " + baseText;
      }

      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.summariseApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validSummaryCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(10000);    

});