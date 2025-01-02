'use strict';
// Copyright Braid Technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { KStubEnvironmentVariables } from '../core/ConfigStrings';

import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { FindEnrichedChunkApi } from '../../CommonTs/src/FindEnrichedChunkApi';
import { EChunkRepository } from '../../CommonTs/src/EnrichedChunk';


describe("ChunkRepository", function () {

   let api = new FindEnrichedChunkApi(getEnvironment (EEnvironment.kLocal), KStubEnvironmentVariables.SessionKey);

   it("Needs to identify related content given an input URL", async function () {

      let query = {
         repositoryId: EChunkRepository.kBoxer,
         url: "https://www.youtube.com/watch?v=l5mG4z343qg&t=00m",
         maxCount: 1,
         similarityThreshold : 0.4

      }
      let response = await api.findRelevantChunksFromUrl (query);

      expect(response.length).toEqual(1);     
   });

   it("Needs to identify starter content", async function () {

      let query = {
         repositoryId: EChunkRepository.kBoxer,
         maxCount: 1,
         similarityThreshold : 0.4,
         summary: "This article exploure user interface considerations for interacting with LLM based applications."

      }
      let response = await api.findRelevantChunksFromSummary (query);

      expect(response.length).toEqual(1);          
   });

});