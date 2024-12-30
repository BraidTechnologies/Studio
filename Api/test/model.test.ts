'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EModel } from '../../CommonTs/src/IModel';
import { getDefaultModel, getModel } from '../../CommonTs/src/IModelFactory';

describe("Model", async function () {

   it("Needs to provide default model", async function () {
      
      let model = getDefaultModel();

      expect (model.deploymentName.length > 0).toBe (true) ;   
      expect (model.defaultChunkSize > 0).toBe (true) ;             

   });

   it("Needs to provide specific model", async function () {
      
      let model = getModel(EModel.kSmall);

      expect (model.deploymentName.length > 0).toBe (true) ;   
      expect (model.defaultChunkSize > 0).toBe (true) ;   

   });

   it("Needs to judge small text", async function () {
      
      let model = getModel(EModel.kSmall);
      let text = "small text";

      expect (model.fitsInDefaultChunk(text)).toBe (true) ;     

   });   

   it("Needs to judge large text", async function () {
      
      let model = getModel(EModel.kSmall);

      let text = "small text";
      for (let i = 0; i < 12; i++)
          text = text + text;

      expect (model.fitsInDefaultChunk(text)).toBe (false) ;   

   });  

   it("Needs to chunk small text", async function () {
      
      let model = getModel(EModel.kSmall);
      let text = "small text";

      expect (model.chunkText(text, undefined, undefined).length).toBe (1);

   });   

   it("Needs to chunk large text", async function () {
      
      let model = getModel(EModel.kSmall);

      let text = "small text ";
      for (let i = 0; i < 12; i++)
          text = text + text;

      expect (model.chunkText(text, undefined, undefined).length > 1).toBe (true) ;   
   });  

   it("Needs to chunk large text with overlaps", async function () {
      
      let model = getModel(EModel.kSmall);

      let text = "small text ";
      for (let i = 0; i < 12; i++)
          text = text + text;

      let baseLength = model.chunkText(text, undefined, undefined).length;
      let overlappedLength = model.chunkText(text, undefined, 2048).length;

      expect (overlappedLength > baseLength).toBe (true) ;   
   });  

});