'use strict';
// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { KStubEnvironmentVariables } from "../core/ConfigStrings";

import { getEnvironment } from '../../Braid/BraidCommon/src/IEnvironmentFactory';
import { EEnvironment } from '../../Braid/BraidCommon/src/IEnvironment';
import { FindEnrichedChunkApi } from '../../Braid/BraidCommon/src/FindEnrichedChunkApi';
import { EChunkRepository } from '../../Braid/BraidCommon/src/EnrichedChunk';

describe("Embedding", async function () {

   let api = new FindEnrichedChunkApi(getEnvironment (EEnvironment.kLocal), KStubEnvironmentVariables.SessionKey);

   it("Needs to find closest match for an existing Markdown document", async function () {

      let query = {
         repositoryId: EChunkRepository.kBoxer,
         url: "https://github.com/microsoft/generative-ai-for-beginners/blob/main/01-introduction-to-genai/README.md",
         maxCount: 1,
         similarityThreshold : 0.4

      }
      let response = await api.findRelevantChunksFromUrl (query);

      expect(response.length).toEqual(1);     
      
   }).timeout(20000);

   it("Needs to find closest match for an existing YouTube document", async function () {

      let query = {
         repositoryId: EChunkRepository.kBoxer,
         url: "https://www.youtube.com/watch?v=l5mG4z343qg&t=00h00m00s",
         maxCount: 1,
         similarityThreshold : 0.4

      }
      let response = await api.findRelevantChunksFromUrl (query);

      expect(response.length).toEqual(1);       

   }).timeout (20000);

   it("Needs to find closest match for an existing Html document", async function () {

      let query = {
         repositoryId: EChunkRepository.kBoxer,
         url: "https://karpathy.medium.com/software-2-0-a64152b37c35",
         maxCount: 1,
         similarityThreshold : 0.4
      }
      let response = await api.findRelevantChunksFromUrl (query);
   
      expect(response.length).toEqual(1); 

   }).timeout (20000);

   it("Needs to find closest match for a simple query", async function () {
      
      let query = {
         repositoryId: EChunkRepository.kBoxer,
         summary: "Trolly chicken dilemma chicks",
         maxCount: 1,
         similarityThreshold : 0.1 // set low so we get a match
      }
      let response = await api.findRelevantChunksFromSummary (query);
   
      expect(response.length).toEqual(1);    

   }).timeout (10000);   

   it("Needs to find closest match for an irrelevant query", async function () {
      
      let query = {
         repositoryId: EChunkRepository.kBoxer,
         summary: "Human baby animals cute cats dogs",
         maxCount: 1,
         similarityThreshold : 0.1 // set low so we get a match
      }
      let response = await api.findRelevantChunksFromSummary (query);
   
      expect(response.length).toEqual(1);    

   }).timeout (10000);     

   it("Needs to find closest match for a Markdown query", async function () {
      
      let query = {
         repositoryId: EChunkRepository.kBoxer,
         summary: "User experience is a very important aspect of building apps. Users need to be able to use your app in an efficient way to perform tasks. Being efficient is one thing but you also need to design apps so that they can be used by everyone, to make them accessible. This chapter will focus on this area so you hopefully end up designing an app that people can and want to use. Introduction User experience is how a user interacts with and uses a specific product or service be it a system, tool",
         maxCount: 1,
         similarityThreshold : 0.4 
      }
      let response = await api.findRelevantChunksFromSummary (query);
   
      expect(response.length).toEqual(1);   

   }).timeout (10000);      
});


