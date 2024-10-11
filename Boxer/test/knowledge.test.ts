'use strict';
// Copyright Braid Technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { KStubEnvironmentVariables } from '../core/ConfigStrings';
import { lookLikeSameSource } from '../core/Embedding';

import { getEnvironment } from '../../Braid/BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../Braid/BraidCommon/src/IEnvironment';
import { FindEnrichedChunkApi } from '../../Braid/BraidCommon/src/FindEnrichedChunkApi';
import { EChunkRepository } from '../../Braid/BraidCommon/src/EnrichedChunk';



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