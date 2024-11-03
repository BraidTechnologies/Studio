'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { ActivityRepostoryApi } from '../../BraidCommon/src/ActivityRepositoryApi';
import { randomKey, saveLoadRemove, failSave } from './storable';
import { IStorable, IStorableMultiQuerySpec } from '../../BraidCommon/src/IStorable';

declare var process: any;

describe("StorableActivity", async function () {

   let record : IStorable = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: 1,
      created: new Date(),
      amended: new Date(),      
      contextId: "madeupId",
      userId: "madeeupId",
      className: "madeUpClass"      
   }

   let env = getEnvironment (EEnvironment.kLocal);
   let api = new ActivityRepostoryApi (env, process.env.SessionKey.toString());

   it("Needs to succeed with valid key", async function () {
      
       let myRecord = { ...record };
      myRecord.id = randomKey();   

      let ok = await saveLoadRemove (api, myRecord); 

      expect (ok).toBe (true) ;         

   }).timeout(20000);

   it("Needs to fail with invalid key", async function () {
      
      let apiFail = new ActivityRepostoryApi (env, "thiswillfail");      
      let myRecord = { ...record };
      myRecord.id = randomKey();   

      let ok = await failSave (apiFail, myRecord); 

      expect (ok).toBe (true) ;         

  }).timeout(20000);   

   it("Needs to pull multiple records with valid key", async function () {
   
      let myRecord = { ...record };
      myRecord.id = randomKey();
      let ok = await api.save (myRecord); 

      let myRecord2 = { ...record };
      myRecord2.id = randomKey();      
      ok = await api.save (myRecord2); 

      let mySpec : IStorableMultiQuerySpec = { className: "madeUpClass", limit: 2};

      let stored = await api.recent (mySpec);

      api.remove (myRecord.id);
      api.remove (myRecord2.id);      

      expect (stored.length).toBe (2) ;         

   }).timeout(20000);   

});