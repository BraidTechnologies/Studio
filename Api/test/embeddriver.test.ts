'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EModel, EModelProvider} from '../../CommonTs/src/IModelDriver';
import { getEmbeddingModelDriver, getDefaultEmbeddingModelDriver } from '../../CommonTs/src/IModelFactory';

describe("Embedding Driver", function () {

   it("Needs pass a single line prompt", function () {

      let driver1 = getEmbeddingModelDriver (EModel.kLarge, EModelProvider.kOpenAI);
      let driver2 = getDefaultEmbeddingModelDriver ();

      expect(driver1.drivenModelType).toEqual(driver2.drivenModelType);    

   });

   it("Needs to pass a single line prompt", async function () {

      let driver = getEmbeddingModelDriver (EModel.kLarge, EModelProvider.kOpenAI);

      let prompt = "Who are the most influential figures in generative AI?";

      let response = await driver.embed (prompt);
      expect(response.length > 0).toEqual(true); 
      expect(driver.drivenModelType).toEqual(EModel.kLarge);       

   }).timeout(10000);
  

   it("Needs to pass a small model", async function () {

      let driver = getEmbeddingModelDriver (EModel.kSmall, EModelProvider.kOpenAI);

      let prompt = "Who are the most influential figures in generative AI?";

      let response = await driver.embed (prompt);
      expect(response.length > 0).toEqual(true);      
      expect(driver.drivenModelType).toEqual(EModel.kSmall);

   }).timeout(10000);    

});

