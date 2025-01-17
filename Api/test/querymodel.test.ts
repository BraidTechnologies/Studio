'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

declare var process: any;

import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { EChunkRepository } from '../../CommonTs/src/EnrichedChunk';
import { QueryModelApi } from '../../CommonTs/src/QueryEnrichedModelApi';
import { IEnrichedResponse, IQuestionGenerationResponse } from '../../CommonTs/src/EnrichedQuery.Api.Types';
import { IModelConversationElement, EModelConversationRole } from '../../CommonTs/src/IModelDriver';

let question = "What are the main user interface considerations for building an application using an LLM?"
let summary = "Financial services will adopt generative AI, powered by large language models (LLMs), faster than expected. LLMs can create new content by training on vast amounts of unstructured data, with unlimited computational power. This transformation has the potential to revolutionize the financial services market, going beyond traditional AI/ML capabilities.";

let priorQuestions = ["How does an LLM work?", "What are LLMs bad at?"];
let priorAnswers = ["Large Language Models (LLMs) use transformers, relying on self-attention mechanisms to understand word relationships in text. Trained on vast data, they predict the next word in a sequence by analyzing context. Over time, they learn language patterns, enabling them to generate coherent, context-aware responses.", 
   "LLMs struggle with reasoning, understanding context deeply, and handling ambiguous or nuanced inputs. They may generate incorrect or nonsensical information confidently, lack real-world awareness, and can't verify facts. They also have limited capacity for long-term memory and can be biased based on their training data."];


describe("QueryModel", async function () {

   it("Needs to make a simple query.", async function () {

      let api = new QueryModelApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());
      let query = {
         repositoryId: EChunkRepository.kBoxer,
         history: new Array<IModelConversationElement>(),
         question: question,
         similarityThreshold: 0.4,
         maxCount: 2,
         wordTarget: 50
      };

      let response = await api.queryModelWithEnrichment(query);

      let typedResponse: IEnrichedResponse = response as IEnrichedResponse;
      expect(typeof response === 'undefined').toBe(false);
      expect(typedResponse.answer.length > 0).toBe(true);      
      expect(typedResponse.chunks.length > 0).toBe(true);    
      if (typedResponse.chunks.length > 1)   {
         expect(typedResponse.chunks[0].relevance >= typedResponse.chunks[1].relevance).toBe(true);   
      }

   }).timeout(20000);

   it("Needs to make a query with history.", async function () {

      let api = new QueryModelApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());
      let query = {
         repositoryId: EChunkRepository.kBoxer,
         history: [{role: EModelConversationRole.kUser, content: priorQuestions[0]}, 
                   {role: EModelConversationRole.kAssistant, content: priorAnswers[0]}, 
                   {role: EModelConversationRole.kUser, content: priorQuestions[1]},
                   {role: EModelConversationRole.kAssistant, content: priorAnswers[1]}],
         question: question,
         similarityThreshold: 0.5,
         maxCount: 2,
         wordTarget: 50
      };

      let response = await api.queryModelWithEnrichment(query);

      expect(typeof response === 'undefined').toBe(false);

      let typedResponse: IEnrichedResponse = response as IEnrichedResponse;      
      expect(typedResponse.answer.length > 0).toBe(true);      
      expect(typedResponse.chunks.length > 0).toBe(true);    
      if (typedResponse.chunks.length > 1)   {
         expect(typedResponse.chunks[0].relevance >= typedResponse.chunks[1].relevance).toBe(true);   
      }

   }).timeout(20000);

   it("Needs to generate a questions based on a summary", async function () {

      let api = new QueryModelApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());
      let query = {
         summary: summary,
         wordTarget: 10
      };

      let response = await api.generateQuestion(query);

      expect(typeof response === 'undefined').toBe(false);
      expect((response as IQuestionGenerationResponse).question.length > 0).toBe(true);      

   }).timeout(20000);   
});