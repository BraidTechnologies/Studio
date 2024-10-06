'use strict';
// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';
import fs from 'node:fs/promises';

import youTubeEmbeddingsFile from '../data/youtube/output/master_enriched.json';
import markdownEmbeddingsFile from '../data/github/output/master_enriched.json';
import htmlEmbeddingsFile from '../data/web/output/master_enriched.json';
import { FullEmbedding, MakeEmbeddingUrlFnFull, 
makeYouTubeUrlFromFullEmbedding, makeGithubUrlFromFullEmbedding, makeHtmlUrlfromFullEmbedding} from '../core/EmbeddingFormats';

import { Chunk } from '../../Braid/BraidCommon/src/Chunk';   

describe("API Embeddings", function () {
 
   async function makeLite (chunks: Array<Chunk>, embeddingsFull : Array<FullEmbedding>, fn: MakeEmbeddingUrlFnFull) {

      for (let i = 0; i < embeddingsFull.length; i++) {

         chunks.push ({id: "", text: "", url: fn (embeddingsFull[i]), 
                      summary: embeddingsFull[i].summary, embedding: embeddingsFull[i].ada_v2})
      }
   }

   it("Needs to build consolidated embeddings file", async function () {
      
      let embeddings = new Array<FullEmbedding>();
      let chunks = new Array<Chunk> (); 

      embeddings = htmlEmbeddingsFile as Array<FullEmbedding>; 
      let result = await makeLite (chunks, embeddings, makeHtmlUrlfromFullEmbedding);

      embeddings = markdownEmbeddingsFile as Array<FullEmbedding>;      
      result = await makeLite (chunks, embeddings, makeGithubUrlFromFullEmbedding);   
  
      embeddings = youTubeEmbeddingsFile as Array<FullEmbedding>;      
      result = await makeLite (chunks, embeddings, makeYouTubeUrlFromFullEmbedding);        

      var jsonContent = JSON.stringify(chunks);
       
      let caught = false;

      try {
         let result = await fs.writeFile('data/api_embeddings_lite.json', jsonContent, 'utf8');
      }
      catch (e: any) {
         caught = true;
         console.log (e);
      }

      return !caught;


      
      expect (result).toBe (true);
   });         
});
