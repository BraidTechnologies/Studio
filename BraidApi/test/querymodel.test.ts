'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

declare var process: any;

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { EChunkRepository } from '../../BraidCommon/src/EnrichedChunk';
import { QueryModelApi } from '../../BraidCommon/src/QueryModelApi';
import { IConversationElement, IEnrichedResponse, EConversationRole, IGenerateQuestionQuery, IQuestionGenerationResponse } from '../../BraidCommon/src/EnrichedQuery';


let personaPrompt = "You are an AI assistant helping an application developer understand generative AI. You explain complex concepts in simple language, using Python examples if it helps. You limit replies to 50 words or less. If you don't know the answer, say 'I don't know'. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'.";
let enrichmentDocumentPrompt = "You will be provided with a question about generative AI. Write a 50 word summary of an article that would be a great answer to the question. Enrich the summary with additional topics that the question asker might want to understand. Write the summary in the present tense, as though the article exists. If the question is not related to building AI applications, Python, or Large Language Models (LLMs), say 'That doesn't seem to be about AI'. \n\n ###The Question:";
let question = "What are the main user interface considerations for building an application using an LLM?"

let questionGenerationPrompt = "You will be provided with a short summary of article about building applications that use generative AI technology. Write a question of no more than 10 words that a reader might after they have read the article. \n\n ###The Summary of the Article:";
let summary = "Financial services will adopt generative AI, powered by large language models (LLMs), faster than expected. LLMs can create new content by training on vast amounts of unstructured data, with unlimited computational power. This transformation has the potential to revolutionize the financial services market, going beyond traditional AI/ML capabilities.";

let priorQuestions = ["How does an LLM work?", "What are LLMs bad at?"];
let priorAnswers = ["Large Language Models (LLMs) use transformers, relying on self-attention mechanisms to understand word relationships in text. Trained on vast data, they predict the next word in a sequence by analyzing context. Over time, they learn language patterns, enabling them to generate coherent, context-aware responses.", 
   "LLMs struggle with reasoning, understanding context deeply, and handling ambiguous or nuanced inputs. They may generate incorrect or nonsensical information confidently, lack real-world awareness, and can't verify facts. They also have limited capacity for long-term memory and can be biased based on their training data."];


describe("QueryModel", async function () {

   it("Needs to make a simple query.", async function () {

      let api = new QueryModelApi(getEnvironment(EEnvironment.kLocal), process.env.SessionKey.toString());
      let query = {
         repositoryId: EChunkRepository.kBoxer,
         personaPrompt: personaPrompt,
         enrichmentDocumentPrompt: enrichmentDocumentPrompt,
         history: new Array<IConversationElement>(),
         question: question,
         similarityThreshold: 0.5,
         maxCount: 2
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
         personaPrompt: personaPrompt,
         enrichmentDocumentPrompt: enrichmentDocumentPrompt,
         history: [{role: EConversationRole.kUser, content: priorQuestions[0]}, 
                   {role: EConversationRole.kAssistant, content: priorAnswers[0]}, 
                   {role: EConversationRole.kUser, content: priorQuestions[1]},
                   {role: EConversationRole.kAssistant, content: priorAnswers[1]}],
         question: question,
         similarityThreshold: 0.5,
         maxCount: 2
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
         personaPrompt: personaPrompt,
         questionGenerationPrompt: questionGenerationPrompt,
         summary: summary
      };

      let response = await api.generateQuestion(query);

      expect(typeof response === 'undefined').toBe(false);
      expect((response as IQuestionGenerationResponse).question.length > 0).toBe(true);      

   }).timeout(20000);   
});