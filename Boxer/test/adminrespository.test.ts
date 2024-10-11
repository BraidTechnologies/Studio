'use strict';
// Copyright Braid technologies ltd, 2024
import { expect } from 'expect';
import { describe, it } from 'mocha';

import { DefaultAdminRepository } from '../core/IAdminRepository';
import { Persona } from '../core/Persona';
import { EIcon } from '../core/Icons';

describe("AdminRespository", function () {

   var count: number = 0;

   function doSomethingAsync () {
      count++;
   }

   it("Needs to say JV is an adminstrator", async function () {

      let repository = new DefaultAdminRepository();
      let persona1 = new Persona("1", "Jon Verrier", "whatever", EIcon.kPersonPersona, undefined, new Date());

      let isAdmin = await repository.isAdmin(persona1);

      expect(isAdmin).toEqual(true);
   });

   it("Needs to say names other than JV are not an adminstrator", async function () {

      let repository = new DefaultAdminRepository();
      let persona1 = new Persona("1", "Jon Verrier2", "whatever", EIcon.kPersonPersona, undefined, new Date());

      let isAdmin = await repository.isAdmin(persona1);

      expect(isAdmin).toEqual(false);
   });

});

