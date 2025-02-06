'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { IChunkRequest, IChunkResponse } from '../../CommonTs/src/ChunkApi.Types';
import { lookLikeSameSource } from '../src/functions/EnrichedChunkRepository';

declare var process: any;

describe("Chunk URLs", function () {

   it("Needs to identify URLs from same YouTube video", function () {

      var url1 = "https://www.youtube.com/watch?v=roEKOzxilq4&t=00h00m00s";
      var url2 = "https://www.youtube.com/watch?v=roEKOzxilq4&t=00h05m00s";

      expect(lookLikeSameSource (url1, url2)).toEqual(true);     
   });

   it("Needs to identify URLs from different YouTube videos", function () {

      var url1 = "https://www.youtube.com/watch?v=roEKOzxilq4&t=00h00m00s";
      var url2 = "https://www.youtube.com/watch?v=xoEKOzailq4&t=00h00m00s";

      expect(lookLikeSameSource (url1, url2)).toEqual(false);        
   });

   it("Needs to identify URLs from same GitHub repo", function () {

      var url1 = "https://github.com/jonverrier/BraidEng";
      var url2 = "https://github.com/jonverrier/BraidEng/issues";

      expect(lookLikeSameSource (url1, url2)).toEqual(true);     
   });

   it("Needs to identify URLs from different GitHub repos", function () {

      var url1 = "https://github.com/jonverrier/BraidEng";
      var url2 = "https://github.com/jonverrier/BraidWeb";

      expect(lookLikeSameSource (url1, url2)).toEqual(false);        
   });

});

describe("Chunk", async function () {

   async function validChunkCall(apiUrl: string, text: string): Promise<IChunkResponse | undefined> {

      let chunkRequest: IChunkRequest = {
         text: text
      };
      let responseData: IChunkResponse | undefined = undefined;

      try {
         let response = await axios.post(apiUrl, {
            request: chunkRequest,
            headers: {
               'Content-Type': 'application/json'
            }
         });

         responseData = (response.data as IChunkResponse);

      } catch (e: any) {

         console.error(e);
      }

      return responseData;
   }

   async function invalidChunkCall(apiUrl: string, text: string): Promise<Boolean> {

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

      let sampleText = "OpenAI have release a new large language model aimed at coding.";
      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.chunkApi() + "?session=" + "thiswillfail";

      let caught = await invalidChunkCall(apiUrl, sampleText);

      expect(caught).toBe(true);

   }).timeout(20000);

   it("Needs to chunk a short message", async function () {

      let sampleText = "OpenAI have release a new large language model aimed at coding.";

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.chunkApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let chunkResponse = await validChunkCall(apiUrl, sampleText);

      expect(chunkResponse && chunkResponse?.chunks.length === 1).toBe(true);

   }).timeout(20000);

   it("Needs to chunk a long message", async function () {

      let sampleText = "OpenAI have release a new large language model aimed at coding.";
      for (let i = 0; i < 15; i++)
         sampleText = sampleText + sampleText;

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.chunkApi() + "?session=" + process.env.BRAID_SESSION_KEY.toString();

      let chunkResponse = await validChunkCall(apiUrl, sampleText);

      expect(chunkResponse && chunkResponse?.chunks.length > 1).toBe(true);

   }).timeout(20000);

});