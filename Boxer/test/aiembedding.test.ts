'use strict';
// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { KStubEnvironmentVariables } from "../core/ConfigStrings";
import { SessionKey } from '../core/Keys';
import { AIConnector } from "../core/AIConnection";

import { LiteEmbedding } from "../core/EmbeddingFormats";
import { kDefaultMinimumCosineSimilarity, kDefaultSearchChunkCount } from "../core/IEmbeddingRepository";
import { getEmbeddingRepository } from '../core/IEmbeddingRepositoryFactory';

describe("AIEmbedding", async function () {

   let repository = getEmbeddingRepository (new SessionKey (""));

   it("Needs to find closest match for an existing Markdown document", async function () {

      let embed = await repository.lookupSimilarfromUrl ("https://github.com/microsoft/generative-ai-for-beginners/blob/main/01-introduction-to-genai/README.md",
         kDefaultMinimumCosineSimilarity, 
         kDefaultSearchChunkCount);         

      let best = await repository.lookupMostSimilar (embed.chunks[0].ada_v2, 
         embed.chunks[0].url,
         kDefaultMinimumCosineSimilarity, 
         kDefaultSearchChunkCount);

      expect (best.chunks.length === kDefaultSearchChunkCount).toBe (true);

   }).timeout (20000);

   it("Needs to find closest match for an existing YouTube document", async function () {

      let embed = await repository.lookupSimilarfromUrl ("https://www.youtube.com/watch?v=l5mG4z343qg&t=00h00m00s",
         kDefaultMinimumCosineSimilarity, 
         kDefaultSearchChunkCount);      

      let best = await repository.lookupMostSimilar (embed.chunks[0].ada_v2, 
         embed.chunks[0].url,
         kDefaultMinimumCosineSimilarity, 
         kDefaultSearchChunkCount);

      expect (best.chunks.length === kDefaultSearchChunkCount).toBe (true);

   }).timeout (20000);

   it("Needs to find closest match for an existing Html document", async function () {

      let embed = await repository.lookupSimilarfromUrl ("https://karpathy.medium.com/software-2-0-a64152b37c35",
         0, // Deliberately set this low so we always match
         kDefaultSearchChunkCount);          

      let best = await repository.lookupMostSimilar (embed.chunks[0].ada_v2, 
         embed.chunks[0].url,
         0, // Deliberately set this low so we always match
         kDefaultSearchChunkCount);

      expect (best.chunks.length === kDefaultSearchChunkCount).toBe (true);

   }).timeout (20000);

   it("Needs to find closest match for a simple query", async function () {
      
      let embeddings = new Array<LiteEmbedding>();
      embeddings = embeddings as Array<LiteEmbedding>;

      let query = "Trolly chicken dilemma chicks"

      const client = new AIConnector();
      let connection = await AIConnector.connect (new SessionKey (KStubEnvironmentVariables.SessionKey));      

      const embedding = await connection.createEmbedding (query);
      let best = await repository.lookupMostSimilar (embedding, 
         undefined,
         0, // Deliberately set this low so we always match
         kDefaultSearchChunkCount);

      expect (best.chunks.length === kDefaultSearchChunkCount).toBe (true);    

   }).timeout (10000);   

   it("Needs to find closest match for an irrelevant query", async function () {
      
      let embeddings = new Array<LiteEmbedding>();
      embeddings = embeddings as Array<LiteEmbedding>;

      let query = "Human baby animals cute cats dogs"

      const client = new AIConnector();
      let connection = await AIConnector.connect (new SessionKey (KStubEnvironmentVariables.SessionKey));      

      const embedding = await connection.createEmbedding (query);
      let best = await repository.lookupMostSimilar (embedding, 
         undefined,
         0, // Deliberately set this low so we always match
         kDefaultSearchChunkCount);

      expect (best.chunks.length === kDefaultSearchChunkCount).toBe (true);   

   }).timeout (10000);     

   it("Needs to find closest match for a Markdown query", async function () {
      
      let embeddings = new Array<LiteEmbedding>();
      embeddings = embeddings as Array<LiteEmbedding>;

      let query = "User experience is a very important aspect of building apps. Users need to be able to use your app in an efficient way to perform tasks. Being efficient is one thing but you also need to design apps so that they can be used by everyone, to make them accessible. This chapter will focus on this area so you hopefully end up designing an app that people can and want to use. Introduction User experience is how a user interacts with and uses a specific product or service be it a system, tool"

      const client = new AIConnector();
      let connection = await AIConnector.connect (new SessionKey (KStubEnvironmentVariables.SessionKey));      

      const embedding = await connection.createEmbedding (query);
      let best = await repository.lookupMostSimilar (embedding, 
         undefined,
         0, // Deliberately set this low so we always match
         kDefaultSearchChunkCount);
         
      expect (best.chunks.length === kDefaultSearchChunkCount).toBe (true);    

   }).timeout (10000);      
});


