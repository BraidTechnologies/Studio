'use strict';
// Copyright Braid Technologies Ltd, 2024

import { expect } from 'expect';
import { describe, it } from 'mocha';

import { EEnvironment } from '../../BraidCommon/src/IEnvironment';
import { getEnvironment, getDefaultEnvironment } from '../../BraidCommon/src/IEnvironmentFactory';

describe("Environment", async function () {

   it("Should be local in Mocha", async function () {
      
      let def = getDefaultEnvironment();
      let local = getEnvironment (EEnvironment.kLocal);

      expect (def.name === local.name).toBe (true);         
   });
});