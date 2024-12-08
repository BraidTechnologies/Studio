'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

declare var process: any;

import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EChunkRepository } from '../../CommonTs/src/EnrichedChunk';
import { FindEnrichedChunkApi } from '../../CommonTs/src/FindEnrichedChunkApi';

let boxerUrls = ["https://www.youtube.com/watch?v=roEKOzxilq4&t=00m",
   "https://karpathy.medium.com/software-2-0-a64152b37c35"];

let boxerSummaries = [
   "User experience is a very important aspect of building apps. Users need to be able to use your app in an efficient way to perform tasks. Being efficient is one thing but you also need to design apps so that they can be used by everyone, to make them accessible. This chapter will focus on this area so you hopefully end up designing an app that people can and want to use. Introduction User experience is how a user interacts with and uses a specific product or service be it a system, tool",
   "The State of Open Source AI Book discusses the role of hardware in machine learning, specifically GPUs. GPUs are well-suited for AI computations due to their parallelization capabilities and specialized hardware for deep learning operations.",
   "The video discusses the patterns for augmenting language models with external context, including retrieval augmentation, chaining, and tool use. It explores the limitations of language models and the need for additional data and tools to enhance their performance. The video provides an overview of information retrieval techniques and explains how to make the most of the limited context window of language models.",
   "Learn to Spell: Prompt Engineering (LLM Bootcamp) is a new course announcement for an in-person bootcamp in the SF Bay Area on November 14, 2023. The video provides high-level intuitions and a default playbook for prompting language models, covering techniques like decomposition, reasoning, and reflection."
];

let waterfallSummaries = [
   "BNY Mellon is investing in AI capabilities using an NVidia platform.",
];

let waterfallUrls = ["https://www.datanami.com/this-just-in/bny-mellon-and-microsoft-unite-to-enhance-capital-markets-with-advanced-cloud-and-analytics-platform/"];

async function commonChunkStoreTests(repo: EChunkRepository,
                                summaries: Array<string>,
                                urls: Array<string>): Promise<void> {

   it("Needs to find relevant chunks from a matching Summary.", async function () {

      for (let i = 0; i < summaries.length; i++) {

         let api = new FindEnrichedChunkApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());
         let urlQuery = {
            maxCount: 2,
            repositoryId: repo,
            summary: summaries[i],
            similarityThreshold: 0.15
         };

         let response = await api.findRelevantChunksFromSummary(urlQuery);
         console.log("\nLooking for:" + urlQuery.summary);
         for (let i = 0; i < response.length; i++) {
            console.log(response[i].chunk.summary);
            console.log(response[i].relevance.toString());
         }
         console.log("\n");
         expect(response.length > 0).toBe(true);
      }

   }).timeout(20000);

   it("Needs to find relevant chunks from a matching URL.", async function () {

      let api = new FindEnrichedChunkApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());

      for (let i = 0; i < urls.length; i++) {
         let urlQuery = {
            maxCount: 2,
            repositoryId: repo,
            url: urls[i],
            similarityThreshold: 0.15
         };

         let response = await api.findRelevantChunksFromUrl(urlQuery);
         console.log("Looking for:" + urlQuery.url);
         for (let i = 0; i < response.length; i++)
            console.log(response[i].chunk.url);

         expect(response.length > 0).toBe(true);
      }
   }).timeout (20000);

   it("Needs to find same chunks from a matching URL.", async function () {

      let api = new FindEnrichedChunkApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());

      for (let i = 0; i < urls.length; i++) {
         let urlQuery = {
            maxCount: 2,
            repositoryId: repo,
            url: urls[i],
            similarityThreshold: 0.75
         };

         let response = await api.findChunkFromUrl(urlQuery);

         expect(response !== undefined).toBe(true);
      }

   }).timeout(20000);   
}


describe("FindEnrichedChunks - Boxer", async function () {
   
   commonChunkStoreTests (EChunkRepository.kBoxer, boxerSummaries, boxerUrls);
   
}).timeout(20000);

describe("FindEnrichedChunks - Waterfall", async function () {

   commonChunkStoreTests (EChunkRepository.kWaterfall, waterfallSummaries, waterfallUrls);
});