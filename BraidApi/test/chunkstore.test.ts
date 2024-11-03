'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { ChunkRepostoryApi} from '../../BraidCommon/src/ChunkRepositoryApi'
import { failSave, randomKey, saveLoadRemove } from './storable';
import { IStoredChunk } from '../../BraidCommon/src/ChunkRepositoryApiTypes';

declare var process: any;

describe("StorableChunk", async function () {

   let record : IStoredChunk = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: 1,
      created: new Date(),
      amended: new Date(),      
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