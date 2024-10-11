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

import { IEnrichedChunk } from '../../Braid/BraidCommon/src/EnrichedChunk';   

describe("API Embeddings", function () {
 
   async function makeLite (chunks: Array<IEnrichedChunk>, embeddingsFull : Array<FullEmbedding>, fn: MakeEmbeddingUrlFnFull) {

      for (let i = 0; i < embeddingsFull.length; i++) {

         chunks.push ({id: "", embedding: embeddingsFull[i].ada_v2, 
            url: fn (embeddingsFull[i]), 
                      text: "",  
                      summary: embeddingsFull[i].summary})
      }
   }

   it("Needs to build consolidated embeddings file", async function () {
      
      let embeddings = new Array<FullEmbedding>();
      let chunks = new Array<IEnrichedChunk> (); 

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

      expect (caught).toBe(false);
      return !caught;

   }).timeout (30000);
});

