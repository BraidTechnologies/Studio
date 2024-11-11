'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { failSave, randomKey, saveLoadRemove } from './storable';
import { EEnvironment } from '../../CommonTs/src/IEnvironment';
import { getEnvironment } from '../../CommonTs/src/IEnvironmentFactory';
import { ChunkRepostoryApi} from '../../CommonTs/src/ChunkRepositoryApi'
import { IStoredChunk } from '../../CommonTs/src/ChunkRepositoryApi.Types';

declare var process: any;

describe("StorableChunk", async function () {

   let now = new Date().toISOString();

   let record : IStoredChunk = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: "1",
      created: now,
      amended: now,      
      contextId: "madeupId",
      userId: "madeeupId",
      className: "madeUpClass",
      chunkFunctionalKey: "1234",
      parentChunkId: undefined,
      originalText: undefined,
      storedEmbedding : undefined,
      storedSummary: undefined,
      storedTitle: undefined, 
      relatedChunks: undefined      
   }

   let env = getEnvironment (EEnvironment.kLocal);
   let api = new ChunkRepostoryApi (env, process.env.SessionKey.toString());

   it("Needs to succeed with valid key in local environment", async function () {
      
       let myRecord = { ...record };
      myRecord.id = randomKey();
      myRecord.chunkFunctionalKey = myRecord.id;     

      let ok = await saveLoadRemove (api, myRecord); 

      expect (ok).toBe (true) ;         

   }).timeout(20000);

   it("Needs to fail with invalid key", async function () {
      
      let apiFail = new ChunkRepostoryApi (env, "thiswillfail");      
      let myRecord = { ...record };
      myRecord.id = randomKey();   

      let ok = await failSave (apiFail, myRecord); 

      expect (ok).toBe (true) ;         

  }).timeout(20000);      

});