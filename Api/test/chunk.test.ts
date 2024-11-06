'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { IChunkRequest, IChunkResponse } from '../../CommonTs/src/ChunkApi.Types';

declare var process: any;

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

      let apiUrl = environment.chunkApi() + "?session=" + process.env.SessionKey.toString();

      let chunkResponse = await validChunkCall(apiUrl, sampleText);

      expect(chunkResponse && chunkResponse?.chunks.length === 1).toBe(true);

   }).timeout(20000);

   it("Needs to chunk a long message", async function () {

      let sampleText = "OpenAI have release a new large language model aimed at coding.";
      for (let i = 0; i < 15; i++)
         sampleText = sampleText + sampleText;

      let environment = getEnvironment(EEnvironment.kLocal);

      let apiUrl = environment.chunkApi() + "?session=" + process.env.SessionKey.toString();

      let chunkResponse = await validChunkCall(apiUrl, sampleText);

      expect(chunkResponse && chunkResponse?.chunks.length > 1).toBe(true);

   }).timeout(20000);

});