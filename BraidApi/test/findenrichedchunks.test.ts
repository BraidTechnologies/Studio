'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

declare var process: any;

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { EChunkRepository } from '../../BraidCommon/src/EnrichedChunk';
import { FindEnrichedChunkApi } from '../../BraidCommon/src/FindEnrichedChunkApi';

let urls = ["https://github.com/microsoft/generative-ai-for-beginners/blob/main/01-introduction-to-genai/README.md",
   "https://www.youtube.com/watch?v=l5mG4z343qg&t=00h00m00s",
   "https://karpathy.medium.com/software-2-0-a64152b37c35"];

let summaries = [
   "User experience is a very important aspect of building apps. Users need to be able to use your app in an efficient way to perform tasks. Being efficient is one thing but you also need to design apps so that they can be used by everyone, to make them accessible. This chapter will focus on this area so you hopefully end up designing an app that people can and want to use. Introduction User experience is how a user interacts with and uses a specific product or service be it a system, tool"
];

describe("FindEnrichedChunks", async function () {

   it("Needs to find relevant chunks from a matching Summary.", async function () {

      let api = new FindEnrichedChunkApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());
      let urlQuery = {
         maxCount: 2,
         repositoryId: EChunkRepository.kBoxer,
         summary: summaries[0],
         similarityThreshold: 0.75
      };

      let response = await api.findRelevantChunksFromSummary(urlQuery);

      expect(response.length > 0).toBe(true);

   }).timeout(20000);

   it("Needs to find relevant chunks from a matching URL.", async function () {

      let api = new FindEnrichedChunkApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());

      for (let i = 0; i < urls.length; i++) {
         let urlQuery = {
            maxCount: 2,
            repositoryId: EChunkRepository.kBoxer,
            url: urls[i],
            similarityThreshold: 0.75
         };

         let response = await api.findRelevantChunksFromUrl(urlQuery);

         expect(response.length > 0).toBe(true);
      }

   }).timeout(20000);

   
   it("Needs to find same chunks from a matching URL.", async function () {

      let api = new FindEnrichedChunkApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());

      for (let i = 0; i < urls.length; i++) {
         let urlQuery = {
            maxCount: 2,
            repositoryId: EChunkRepository.kBoxer,
            url: urls[i],
            similarityThreshold: 0.75
         };

         let response = await api.findChunkFromUrl(urlQuery);

         expect(response.length === 1).toBe(true);
      }

   }).timeout(20000);


});