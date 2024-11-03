'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';

declare var process: any;

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { SessionApi } from "../../BraidCommon/src/SessionApi";

describe("CheckSession", async function () {

   it("Needs to succeed with valid key in local environment", async function () {
      
      let api = new SessionApi (getEnvironment (EEnvironment.kLocal), process.env.SessionKey.toString());

      let session = await api.checkSessionKey ();

      expect (session && session?.length > 0).toBe (true) ;         

   }).timeout(20000);

   it("Needs to succeed with valid key in production environment", async function () {
      
      let api = new SessionApi (getEnvironment (EEnvironment.kProduction), process.env.SessionKey.toString());

      let session = await api.checkSessionKey ();

      expect (session && session?.length > 0).toBe (true) ;   

   }).timeout(20000);

   it("Needs to fail with invalid key.", async function () {

      let api = new SessionApi (getEnvironment (EEnvironment.kLocal), "thiswillfail");

      let session = await api.checkSessionKey ();
      
      expect (session).toEqual ("") ;         

  }).timeout(20000);

  it("Needs to fail with invalid key in production environment.", async function () {

     let api = new SessionApi (getEnvironment (EEnvironment.kProduction), "thiswillfail");

     let session = await api.checkSessionKey ();
   
     expect (session).toEqual ("") ;              

   }).timeout(20000);

});