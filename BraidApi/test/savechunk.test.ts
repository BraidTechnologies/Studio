'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { ChunkRepostoryApi} from '../../BraidCommon/src/ChunkRepositoryApi'

declare var process: any;

function randomInt(min : number, max: number) : number {
   return Math.floor(Math.random() * (max - min)) + min;
}

function randomKey () : string {
   return randomInt (0, 1000000000).toString();
}

describe("SaveChunk", async function () {

   let record = {
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

   it("Needs to succeed with valid key in local environment", async function () {
      
      let env = getEnvironment (EEnvironment.kLocal);
      console.log (env.saveStoredChunkApi);
      let api = new ChunkRepostoryApi (env, process.env.SessionKey.toString());

      let myRecord = { ...record };
      myRecord.id = randomKey();
      myRecord.chunkFunctionalKey = myRecord.id;      

      let ok = await api.save (myRecord); 

      expect (ok).toBe (true) ;         

   }).timeout(20000);

   it("Needs to fail with invalid key.", async function () {

      let env = getEnvironment (EEnvironment.kLocal);      
      let api = new ChunkRepostoryApi (env, "thiswillfail");

      let myRecord = { ...record };
      myRecord.id = randomKey();
      myRecord.chunkFunctionalKey = myRecord.id;

      let ok = await api.save (myRecord); 

      expect (ok).toBe (false) ;        

   }).timeout(20000);


});