'use strict';
// Copyright Braid technologies ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';
import fs from 'node:fs/promises';

import youTubeEmbeddingsFile from '../data/youtube/output/master_enriched.json';
import markdownEmbeddingsFile from '../data/github/output/master_enriched.json';
import htmlEmbeddingsFile from '../data/web/output/master_enriched.json';
import { FullEmbedding, LiteEmbedding, MakeEmbeddingUrlFnFull, 
   makeYouTubeUrlFromFullEmbedding, makeGithubUrlFromFullEmbedding, makeHtmlUrlfromFullEmbedding} from '../core/EmbeddingFormats';

describe("Embedding", function () {
 
   async function makeLite (embeddingsLite: Array<LiteEmbedding>, embeddingsFull : Array<FullEmbedding>, fn: MakeEmbeddingUrlFnFull) {

      for (let i = 0; i < embeddingsFull.length; i++) {

         embeddingsLite.push ({url: fn (embeddingsFull[i]), 
                               summary: embeddingsFull[i].summary, ada_v2: embeddingsFull[i].ada_v2})
      }
   }

   it("Needs to build consolidated embeddings file", async function () {
      
      let embeddings = new Array<FullEmbedding>();
      let embeddingsLite = new Array<LiteEmbedding> (); 

      embeddings = htmlEmbeddingsFile as Array<FullEmbedding>; 
      let result = await makeLite (embeddingsLite, embeddings, makeHtmlUrlfromFullEmbedding);

      embeddings = markdownEmbeddingsFile as Array<FullEmbedding>;      
      result = await makeLite (embeddingsLite, embeddings, makeGithubUrlFromFullEmbedding);   
  
      embeddings = youTubeEmbeddingsFile as Array<FullEmbedding>;      
      result = await makeLite (embeddingsLite, embeddings, makeYouTubeUrlFromFullEmbedding);        

      var jsonContent = JSON.stringify(embeddingsLite);
       
      let caught = false;

      try {
         let result = await fs.writeFile('data/embeddings_lite.json', jsonContent, 'utf8');
      }
      catch (e: any) {
         caught = true;
         console.log (e);
      }

      return !caught;



      expect (result).toBe (true);
   });         
});