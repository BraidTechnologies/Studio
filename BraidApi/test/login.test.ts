'use strict';
// Copyright Braid Technologies Ltd, 2024


import { expect } from 'expect';
import { describe, it } from 'mocha';
import axios from 'axios';

declare var process: any;

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';
import { LoginApi } from "../../BraidCommon/src/LoginApi"

describe("Login", async function () {

   it("Needs to succeed with valid key in local environment", async function () {
      
      let api = new LoginApi (getEnvironment (EEnvironment.kLocal), process.env.SessionKey.toString());

      let session = await api.login ();

      expect (session && session?.length > 0).toBe (true) ;         

   }).timeout(20000);


   it("Needs to fail with invalid key.", async function () {

      let api = new LoginApi (getEnvironment (EEnvironment.kLocal), "thiswillfail");

      let session = await api.login ();
      
      expect (session).toEqual ("") ;         

  }).timeout(20000);

  it("Needs to succeed with valid key in production environment", async function () {
      
   let api = new LoginApi (getEnvironment (EEnvironment.kProduction), process.env.SessionKey.toString());

   let session = await api.login ();

   expect (session && session?.length > 0).toBe (true) ;         

}).timeout(20000);


it("Needs to fail with invalid key in production environment.", async function () {

   let api = new LoginApi (getEnvironment (EEnvironment.kProduction), "thiswillfail");

   let session = await api.login ();
   
   expect (session).toEqual ("") ;         

}).timeout(20000);  


});