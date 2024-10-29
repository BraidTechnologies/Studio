'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { ActivityRepostoryApi} from '../../BraidCommon/src/ActivityRepositoryApi'


declare var process: any;

function randomInt(min : number, max: number) : number {
   return Math.floor(Math.random() * (max - min)) + min;
}

function randomKey () : string {
   return randomInt (0, 1000000000).toString();
}

describe("RemoveActivity", async function () {

   let record = {
      id: randomKey(),
      applicationId: "Test",
      schemaVersion: 1,
      created: new Date(),
      amended: new Date(),      
      contextId: "madeupId",
      userId: "madeeupId",
      className: "madeUpClass",
      test: "Some test data"
   }
      
   it("Needs to succeed with valid key in local environment", async function () {
      
      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kLocal), process.env.SessionKey.toString());

      let myRecord = { ...record };
      myRecord.id = randomKey();

      let notremoved = await api.remove (myRecord.id);     
      let stored = await api.save (myRecord); 
      let removed = await api.remove (myRecord.id);       

      expect (notremoved).toBe (false) ;       
      expect (stored).toBe (true) ;         
      expect (removed).toBe (true) ;     

   }).timeout(20000);

   it("Needs to succeed with valid key in production environment", async function () {
      
      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kProduction), process.env.SessionKey.toString());

      let myRecord = { ...record };
      myRecord.id = randomKey();

      let notremoved = await api.remove (myRecord.id);     
      let stored = await api.save (myRecord); 
      let removed = await api.remove (myRecord.id);       

      expect (notremoved).toBe (false) ;       
      expect (stored).toBe (true) ;         
      expect (removed).toBe (true) ;   

   }).timeout(20000);

   it("Needs to fail with invalid key.", async function () {

      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kLocal), "thiswillfail");

      let myRecord = { ...record };
      myRecord.id = randomKey();

      let ok = await api.remove (myRecord.id); 

      expect (ok).toBe (false) ;        

   }).timeout(20000);

   it("Needs to fail with invalid key in production environment.", async function () {

      let api = new ActivityRepostoryApi (getEnvironment (EEnvironment.kLocal), "thiswillfail");

      let myRecord = { ...record };
      myRecord.id = randomKey();

      let ok = await api.remove (myRecord.id)  

      expect (ok).toBe (false) ;              

      }).timeout(20000);

});