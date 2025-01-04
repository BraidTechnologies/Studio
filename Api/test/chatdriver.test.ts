'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EModel, EModelProvider, IModelConversationPrompt, EModelConversationRole} from '../../CommonTs/src/IModelDriver';
import { getChatModelDriver, getDefaultChatModelDriver } from '../../CommonTs/src/IModelFactory';
import { EPromptPersona } from '../../CommonTs/src/IPromptPersona';

describe("Chat Driver", function () {

   it("Needs pass a single line prompt", function () {

      let driver1 = getChatModelDriver (EModel.kLarge, EModelProvider.kOpenAI);
      let driver2 = getDefaultChatModelDriver ();

      expect(driver1.drivenModelType).toEqual(driver2.drivenModelType);    

   });

   it("Needs pass a single line prompt", async function () {

      let driver = getChatModelDriver (EModel.kLarge, EModelProvider.kOpenAI);

      let prompt : IModelConversationPrompt = {prompt: "Hi, how are you?", history: []};

      let response = await driver.generateResponse (EPromptPersona.kArticleSummariser, prompt, {wordTarget: 100});
      expect(response.content.length > 0).toEqual(true);   

   }).timeout(10000);

   it("Needs pass a multi line prompt", async function () {

      let driver = getChatModelDriver (EModel.kLarge, EModelProvider.kOpenAI);

      let prompt : IModelConversationPrompt = {prompt: "What time did I say it was?", 
         history: [ {role: EModelConversationRole.kUser, content: "It is 10:30"} ]};

      let response = await driver.generateResponse (EPromptPersona.kArticleSummariser, prompt, {wordTarget: 100});
      expect(response.content.includes("10:30")).toEqual(true);   

   }).timeout(10000);   

});

