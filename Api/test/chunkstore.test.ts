'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { failSave, randomKey, saveLoadRemove, saveFindRemove } from './storable';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { ChunkRepostoryApi } from '../../CommonTs/src/ChunkRepositoryApi'
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';
import { IStorableMultiQuerySpec } from '../../CommonTs/src/IStorable';
import { throwIfUndefined } from '../../CommonTs/src/Asserts';

declare var process: any;

describe("StorableChunk", async function () {

   let now = new Date().toUTCString();

   let record: IStoredChunk = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: "1",
      created: now,
      amended: now,
      contextId: "madeupId",
      userId: "madeeupId",
      className: "madeUpClass",
      functionalSearchKey: "1234",
      parentChunkId: undefined,
      originalText: undefined,
      url: undefined,
      storedEmbedding: undefined,
      storedSummary: undefined,
      storedTitle: undefined,
      relatedChunks: undefined
   }

   let env = getEnvironment(EEnvironment.kLocal);
   let api = new ChunkRepostoryApi(env, process.env.SessionKey.toString());

   // Clean up temp objects we created
   afterEach (async function () {
      let spec: IStorableMultiQuerySpec = {
         className: "madeUpClass",
         limit: 10
      }
      let recent = await api.recent (spec);
      for (let i = 0; i < recent.length; i++) {
         if (recent[i].id)
            api.remove (recent[i].id as string);
      }
   }); 

   it("Needs to succeed with saveLoadRemove & valid key in local environment", async function () {

      let myRecord = { ...record };
      myRecord.id = randomKey();

      let ok = await saveLoadRemove(api, myRecord);

      expect(ok).toBe(true);

   }).timeout(20000);

   it("Needs to succeed with find & valid key in local environment", async function () {

      let myRecord = { ...record };
      myRecord.id = randomKey();

      let ok = await saveFindRemove(api, myRecord);

      expect(ok).toBe(true);

   }).timeout(20000);

   it("Needs to fail with invalid key", async function () {

      let apiFail = new ChunkRepostoryApi(env, "thiswillfail");
      let myRecord = { ...record };
      myRecord.id = randomKey();

      let ok = await failSave(apiFail, myRecord);

      expect(ok).toBe(true);

   }).timeout(20000);

});