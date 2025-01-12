'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EModel, EModelProvider } from '../../CommonTs/src/IModelDriver';
import { getDefaultTextChunker, getTextChunker } from '../../CommonTs/src/IModelFactory';

describe("Chunk Driver", async function () {

   it("Needs to provide default model", async function () {
      
      let model = getDefaultTextChunker();

      expect (model.drivenModelProvider.length > 0).toBe (true) ;   
      expect (model.defaultChunkSize > 0).toBe (true) ;             

   });

   it("Needs to provide specific model", async function () {
      
      let model = getTextChunker(EModel.kLarge, EModelProvider.kOpenAI);

      expect (model.drivenModelProvider.length > 0).toBe (true) ;   
      expect (model.defaultChunkSize > 0).toBe (true) ;   
      expect (model.drivenModelType).toEqual(EModel.kLarge);

   });

   it("Needs to judge small text", async function () {
      
      let model = getTextChunker(EModel.kSmall, EModelProvider.kOpenAI);
      let text = "small text";

      expect (model.fitsInDefaultChunk(text)).toBe (true) ;     

   });   

   it("Needs to judge large text", async function () {
      
      let model = getTextChunker(EModel.kSmall, EModelProvider.kOpenAI);

      let text = "small text";
      for (let i = 0; i < 12; i++)
          text = text + text;

      expect (model.fitsInDefaultChunk(text)).toBe (false) ;   

   });  

   it("Needs to chunk small text", async function () {
      
      let model = getTextChunker(EModel.kSmall, EModelProvider.kOpenAI);
      let text = "small text";

      expect (model.chunkText(text, undefined, undefined).length).toBe (1);

   });   

   it("Needs to chunk large text", async function () {
      
      let model = getTextChunker(EModel.kSmall, EModelProvider.kOpenAI);

      let text = "small text ";
      for (let i = 0; i < 12; i++)
          text = text + text;

      expect (model.chunkText(text, undefined, undefined).length > 1).toBe (true) ;   
   });  

   it("Needs to chunk large text with overlaps", async function () {
      
      let model = getTextChunker(EModel.kSmall, EModelProvider.kOpenAI);

      let text = "small text ";
      for (let i = 0; i < 12; i++)
          text = text + text;

      let baseLength = model.chunkText(text, undefined, undefined).length;
      let overlappedLength = model.chunkText(text, undefined, 2048).length;

      expect (overlappedLength > baseLength).toBe (true) ;   
   });  

});