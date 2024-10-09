'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { IEmbedRequest, IEmbedResponse } from "../../BraidCommon/src/EmbedApi.Types";

declare var process: any;

describe("Embed", async function () {

   async function validEmbedCall (apiUrl: string, text: string) : Promise<Array<number> | undefined> {

      let embedding: Array<number> | undefined = undefined;
      let embeddingRequest: IEmbedRequest = {
         text: text
      }

      try {
         let response = await axios.post(apiUrl, {
           request: embeddingRequest,
           headers: {
              'Content-Type': 'application/json'
           }
         });

         let embeddingResponse = (response.data as IEmbedResponse);
         embedding = embeddingResponse.embedding;
         console.log (embeddingResponse);
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return embedding;
   }

   async function invalidEmbedCall (apiUrl: string, text: string) : Promise <Boolean> {
   
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

      let apiUrl = environment.embedApi() + "?session=" + "thiswillfail";

      let caught = await invalidEmbedCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to fail if session key is incorrect against production", async function () {

      let sampleText : string | undefined = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.embedApi() + "?session=" + "thiswillfail";

      let caught = await invalidEmbedCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to embed a simple message", async function () {

      let sampleText = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.embedApi() + "?session=" + process.env.SessionKey.toString();

      let embedding = await validEmbedCall (apiUrl, sampleText);

      expect (embedding && embedding?.length > 0).toBe (true) ;     

   }).timeout(20000); 

   it("Needs to embed a simple message against production", async function () {

      let sampleText = "My name is Jon and I am founding an AI project acceleration company." ;      
      let environment = getEnvironment(EEnvironment.kProduction);

      let apiUrl = environment.embedApi() + "?session=" + process.env.SessionKey.toString();

      let embedding = await validEmbedCall (apiUrl, sampleText);

      expect (embedding && embedding?.length > 0).toBe (true) ;     

   }).timeout(20000); 

   it("Needs to embed a long message", async function () {

      let baseText = "My name is Jon and I am founding an AI project acceleration company." ;  
      let sampleText = baseText;  
      for (var i = 0; i < 1000; i++)  {
         sampleText = sampleText + " " + baseText;
      }

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.embedApi() + "?session=" + process.env.SessionKey.toString();

      let summary = await validEmbedCall (apiUrl, sampleText);

      expect (summary && summary?.length > 0).toBe (true) ;     

   }).timeout(20000);     

});