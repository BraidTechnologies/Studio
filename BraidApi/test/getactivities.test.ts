'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { ActivityRepostoryApi} from '../../BraidCommon/src/ActivityRepositoryApi'
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';


declare var process: any;

function randomInt(min : number, max: number) : number {
   return Math.floor(Math.random() * (max - min)) + min;
}

function randomKey () : string {
   return randomInt (0, 1000000000).toString();
}

describe("GetActivities", async function () {

   let record = {
      storeId: randomKey(),
      storeTimestamp: new Date(),
      storeContextId: "madeupId",
      storeUserId: "madeeupId",
      storeClassName: "madeUpClass",
      test: "Some test data"
   }

   let spec = { limit: 1, storeClassName: "madeUpClass"}

   it("Needs to pull a single record with valid key in local environment", async function () {
      
      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kLocal), process.env.SessionKey.toString());

      let myRecord = { ...record };
      myRecord.storeId = randomKey();

      let ok = await api.save (myRecord); 
      let stored = await api.recent (spec);
      api.remove (myRecord.storeId);

      expect (stored.length).toBe (1) ;         

   }).timeout(20000);

   it("Needs to pull a multiple record with valid key in local environment", async function () {
      
      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kLocal), process.env.SessionKey.toString());

      let myRecord = { ...record };
      myRecord.storeId = randomKey();
      let ok = await api.save (myRecord); 

      let myRecord2 = { ...record };
      myRecord2.storeId = randomKey();      
      ok = await api.save (myRecord2); 

      let mySpec = { ...spec};
      mySpec.limit = 2;
      let stored = await api.recent (mySpec);
      api.remove (myRecord.storeId);
      api.remove (myRecord2.storeId);      

      expect (stored.length).toBe (2) ;         

   }).timeout(20000);   

   it("Needs to fail with invalid key.", async function () {

      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kLocal), "thiswillfail");

      let stored = await api.recent (spec);

      expect (stored.length === 0).toBe (true) ;        

   }).timeout(20000);

});