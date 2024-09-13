'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import {getEnvironment} from '../../BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../BraidCommon/src/IEnvironment';

declare var process: any;

describe("Chunk", async function () {

   async function validChunkCall (apiUrl: string, text: string) : Promise<Array<string> | undefined> {

      let chunks: Array<string> | undefined = undefined;

      try {
         let response = await axios.post(apiUrl, {
           data: {
              text: text
           },
           headers: {
              'Content-Type': 'application/json'
           }
         });

         chunks = (response.data as Array<string>);
  
      } catch (e: any) {       

         console.error (e);           
      }   
      
      return chunks;
   }

   async function invalidChunkCall (apiUrl: string, text: string) : Promise <Boolean> {
   
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

      let sampleText = "OpenAI have release a new large language model aimed at coding." ;      
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.chunkApi() + "?session=" + "thiswillfail";

      let caught = await invalidChunkCall (apiUrl, sampleText);

      expect (caught).toBe (true) ;     

   }).timeout(20000);

   it("Needs to chunk a long message", async function () {

      let sampleText = "OpenAI have release a new large language model aimed at coding." ;   
      for (let i = 0; i < 15; i++)   
         sampleText = sampleText + sampleText;

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.chunkApi() + "?session=" + process.env.SessionKey.toString();

      let chunks = await validChunkCall (apiUrl, sampleText);

      expect (chunks && chunks?.length > 1).toBe (true) ;     

   }).timeout(20000);           

});