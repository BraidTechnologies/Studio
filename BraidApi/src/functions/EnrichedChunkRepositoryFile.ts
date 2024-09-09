// Copyright (c) 2024 Braid Technologies Ltd

import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { calculateEmbedding } from "./Embed";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec, IEnrichedChunk } from "../../../BraidCommon/src/EnrichedChunk";
import { IRelevantEnrichedChunk, IChunkQuerySpec } from "../../../BraidCommon/src/EnrichedChunk";
import { throwIfUndefined } from "../../../BraidCommon/src/Asserts";
import enrichedChunksFile from "../../api_embeddings_lite.json";

/**
 * Calculates the cosine similarity between two vectors.
 * @param vector1 The first vector.
 * @param vector2 The second vector.
 * @returns The cosine similarity score.
 */
function cosineSimilarity(vector1: number[], vector2: number[]): number {
   if (vector1.length !== vector2.length) {
      throw new Error("Vector dimensions must match for cosine similarity calculation.");
   }

   const dotProduct = vector1.reduce((acc, val, index) => acc + val * vector2[index], 0);
   const magnitude1 = Math.sqrt(vector1.reduce((acc, val) => acc + val ** 2, 0));
   const magnitude2 = Math.sqrt(vector2.reduce((acc, val) => acc + val ** 2, 0));

   if (magnitude1 === 0 || magnitude2 === 0) {
      throw new Error("Magnitude of a vector must be non-zero for cosine similarity calculation.");
   }

   return dotProduct / (magnitude1 * magnitude2);
}

const youTubeHostname = "www.youtube.com";
const gitHubHostname = "github.com";

export function lookLikeSameSource(url1: string, url2: string): boolean {

   const URLLeft = new URL(url1);
   const URLRight = new URL(url2);

   // Youtube format URL
   // https://www.youtube.com/watch?v=l5mG4z343qg&t=00h00m00s
   // To compare two YouTube URLs we look at the ?v= parameter for the video ID
   if (URLLeft.hostname === (youTubeHostname) && URLRight.hostname === (youTubeHostname)) {
      const videoLeft = URLLeft.searchParams.get('v');
      const videoRight = URLRight.searchParams.get('v');

      if (videoLeft === videoRight)
         return true;
      else
         return false;

   }

   // GitHub format URL
   // https://github.com/organisation/repo/...
   // To compare two GitHub URLs we look at the first two path paramters   
   const pathLeft = URLLeft.pathname.split('/').slice(1);
   const pathRight = URLRight.pathname.split('/').slice(1);

   if (URLLeft.hostname === (gitHubHostname) && URLRight.hostname === (gitHubHostname)
      && (pathLeft.length >= 2) && (pathRight.length >= 2)) {

      if (pathLeft[0] === pathRight[0] && pathLeft[1] === pathRight[1])
         return true;
      else
         return false;
   }

   // To compare two Web URLs we look at the first path paramters  
   if ((URLLeft.hostname === URLRight.hostname) &&
      (pathLeft.length >= 1) && (pathRight.length >= 1)) {

      if (pathLeft[0] === pathRight[0])
         return true;
      else
         return false;
   }

   return false;
}

function lowestOfCurrent(urlIn: string | undefined, current: Array<IRelevantEnrichedChunk>): number {

   if (current.length === 0)
      return -1;

   let lowestRelevance = current[0].relevance;
   let lowestIndex = 0;
   let sameSource = false;
   let sameIndex = -1;

   if (urlIn) {
      for (let i = 1; i < current.length; i++) {
         if (lookLikeSameSource(urlIn, current[i].chunk?.url)) {
            sameSource = true;
            sameIndex = i;
         }
      }
   }

   if (sameSource) {

      // If we have an entry from the same source, replace if the new one looks better
      let comp = current[sameIndex].relevance;

      if (typeof comp !== 'undefined' && typeof lowestRelevance !== 'undefined') {

         let currentRelevance = current[sameIndex].relevance;

         if ((typeof comp !== 'undefined' && typeof currentRelevance !== 'undefined')
            && (comp < currentRelevance)) {
            lowestIndex = sameIndex;
         }
      }
   }
   else {
      // Else replace the lowest relevance entry
      for (let i = 1; i < current.length; i++) {

         let comp = current[i].relevance;

         if (typeof comp !== 'undefined' && typeof lowestRelevance !== 'undefined') {

            if (comp < lowestRelevance) {
               lowestRelevance = comp;
               lowestIndex = i;
            }
         }
      }
   }

   return lowestIndex;
}

function replaceIfBeatsCurrent(candidate: IRelevantEnrichedChunk,
   spec: IChunkQuerySpec,
   urlIn: string | undefined,
   current: Array<IRelevantEnrichedChunk>): boolean {

   // If we have a reference source, check if its just the same source as our reference e.g. different chunk of a Youtube video
   // If it is, we bail 
   if (urlIn && lookLikeSameSource(candidate.chunk.url, urlIn)) {
      return false;
   }

   // Now check we are not piling up multiple references to the same source
   // If it is, we bail 
   for (let i = 0; i < current.length; i++) {
      if (lookLikeSameSource(candidate.chunk.url, current[i].chunk.url))
         return false;
   }

   // If the array can grow we just add the new candidate
   if (current.length < spec.maxCount) {
      if (typeof candidate.relevance !== 'undefined' && candidate.relevance >= spec.similarityThreshold) {
         current.push(candidate);
      }
      return true;
   }

   // Else we do a search and insert the new one if it is better than a current candidate
   let lowestIndex = lowestOfCurrent(candidate.chunk.url, current);
   let currentLowest = current[lowestIndex];

   if (typeof currentLowest.relevance !== 'undefined'
      && typeof candidate.relevance !== 'undefined') {
      if (currentLowest.relevance < candidate.relevance && candidate.relevance >= spec.similarityThreshold) {
         current[lowestIndex] = candidate;
         return true;
      }
   }

   return false;
}


export class EnrichedChunkRepositoryFile implements IEnrichedChunkRepository {

   /**
    * lookupRelevantFromSummary 
    * look to see of we have similar content to the text in the summary field of the query
    */
   async lookupRelevantFromSummary(spec: IChunkQueryRelevantToSummarySpec): Promise<Array<IRelevantEnrichedChunk>> {

      let enrichedChunks = enrichedChunksFile as Array<IEnrichedChunk>;
      let accumulator = new Array<IRelevantEnrichedChunk>();

      let validEmbedding = await calculateEmbedding (spec.summary);

      for (let i = 0; i < enrichedChunks.length; i++) {

         let embedding = enrichedChunks[i].embedding;
         if (embedding) {
            let validIndexedEmbedding: number[];
            throwIfUndefined(embedding);
            validIndexedEmbedding = embedding;

            let relevance = Number(cosineSimilarity(validEmbedding, validIndexedEmbedding).toPrecision(2));

            let candidate: IRelevantEnrichedChunk = {
               chunk: {
                  url: enrichedChunks[i].url,
                  summary: enrichedChunks[i].summary,
                  text: ""
               },
               relevance: relevance
            };

            let changed = replaceIfBeatsCurrent(candidate, spec, undefined, accumulator);
         }
      }

      return accumulator;
   }

   /**
    * lookupRelevantfromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupRelevantfromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<Array<IRelevantEnrichedChunk>> {

      let enrichedChunks = enrichedChunksFile as Array<IEnrichedChunk>;
      let targetChunk: IEnrichedChunk | undefined = undefined;
      let accumulator = new Array<IRelevantEnrichedChunk>();

      let validTargetChunk: IEnrichedChunk;
      let validEmbedding: number[];

      for (let i = 0; i < enrichedChunks.length && !targetChunk; i++) {
         let url = enrichedChunks[i].url;
         if (url == spec.url) {
            targetChunk = enrichedChunks[i];
            break;
         }
      }

      if (!targetChunk || !targetChunk.embedding)
         return accumulator;

      throwIfUndefined(targetChunk);
      validTargetChunk = targetChunk;
      throwIfUndefined(validTargetChunk.embedding);
      validEmbedding = validTargetChunk.embedding;

      for (let i = 0; i < enrichedChunks.length && targetChunk; i++) {

         let embedding = enrichedChunks[i].embedding;
         if (embedding) {
            let validIndexedEmbedding: number[];
            throwIfUndefined(embedding);
            validIndexedEmbedding = embedding;

            let relevance = Number(cosineSimilarity(validEmbedding, validIndexedEmbedding).toPrecision(2));

            let candidate: IRelevantEnrichedChunk = {
               chunk: {
                  url: enrichedChunks[i].url,
                  summary: enrichedChunks[i].summary,
                  text: ""
               },
               relevance: relevance
            };

            let changed = replaceIfBeatsCurrent(candidate, spec, spec.url, accumulator);
         }
      }

      return accumulator;
   }

}

