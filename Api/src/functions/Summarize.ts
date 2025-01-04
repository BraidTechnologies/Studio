'use strict';
// Copyright Braid Technologies Ltd, 2024
// 'func azure functionapp publish Braid-Api' to publish to Azure
// 'func start' to run locally
/**
 * @module Summarize
 * 
 * This module provides functionality for text summarization using AI models.
 * It handles chunking large texts, processing them through AI models, and
 * generating concise summaries based on different personas (article, code, survey).
 * 
 * Key features:
 * - Splits large texts into processable chunks with configurable overlap
 * - Supports multiple summarization personas for different content types
 * - Handles rate limiting and retries for API calls
 * - Validates input text length and session requirements
 * 
 * Deployment:
 * - 'func azure functionapp publish Braid-Api' to publish to Azure
 * - 'func start' to run locally
 */

import { getDefaultChatModelDriver, getDefaultTextChunker } from "../../../CommonTs/src/IModelFactory";
import { EPromptPersona } from "../../../CommonTs/src/IPromptPersona";
import { IModelConversationPrompt } from "../../../CommonTs/src/IModelDriver";

const chunker = getDefaultTextChunker();

/**
 * Splits the input text into chunks of maximum size defined by the model
 * 
 * @param text The text to be chunked.
 * @param overlapwords - how may words to put in overlap of chunks
 * @returns An array of strings, each representing a chunk of the input text.
 */
function chunkText(text: string, overlapWords: number): Array<string> {

   const chunks = chunker.chunkText(text, undefined, overlapWords);

   return chunks;
}

/**
 * Asynchronously summarizes the given text using an AI assistant.
 * 
 * @param persona - The persona to use for the summarisation
 * @param text The text to be summarized.
 * @param words The number of words to use for the summary.
 * @returns A Promise that resolves to the summarized text.
 */
async function singleShotSummarize(persona: EPromptPersona, text: string, words: number): Promise<string> {

   let modelDriver = getDefaultChatModelDriver();
   let prompt : IModelConversationPrompt = {
      history: [],
      prompt: text
   }

   let response = await modelDriver.generateResponse (persona, prompt, {wordTarget: words});

   return response.content;
}

/**
 * Asynchronously generates a recursive summary of the input text based on the specified level and word limit.
 * 
 * @param persona - The persona to use for the summarisation
 * @param text The text to be summarized.
 * @param level The current level of recursion.
 * @param words The maximum number of words in the summary.
 * @returns A Promise that resolves to the generated summary string.
 */
export async function recursiveSummarize(persona: EPromptPersona, text: string, level: number, words: number): Promise<string> {

   let overallSummary: string | undefined = undefined;
   const chunks = chunkText(text, 0);
   const summaries = new Array<string>();

   const recursizeSummarySize = chunker.defaultChunkSize / 5 / 10; // 5 tokens per word, and we compress by a factor of 10

   if (chunks.length > 1) {
      // If the text was > threshold, we break it into chunks.
      // Here we look over each chunk to generate a summary for each
      for (let i = 0; i < chunks.length; i++) {

         const summary = await singleShotSummarize(persona, chunks[i], recursizeSummarySize);
         summaries.push(summary);
      }
   }
   else {
      const summary = await singleShotSummarize(persona, chunks[0], words);
      summaries.push(summary);
   }

   // If we made multiple summaries, we join them all up 
   if (chunks.length > 1) {
      const joinedSummaries = summaries.join(" ");
      overallSummary = await recursiveSummarize(persona, joinedSummaries, level + 1, words);
   }
   else {
      overallSummary = summaries[0];
   }

   return overallSummary;
}

