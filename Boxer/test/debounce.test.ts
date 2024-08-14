'use strict';
// Copyright Braid technologies ltd, 2024
import { expect } from 'expect';
import { describe, it } from 'mocha';

import { debounce} from '../core/Debounce';

async function wait() {
   await new Promise(resolve => setTimeout(resolve, 1000));
}

describe("Debounce", function () {

   var count: number = 0;

   function doSomethingAsync () {
      count++;
   }

   it("Needs to function asynchronously", async function () {

      const debounced = debounce(doSomethingAsync, 0);

      debounced();

      await wait();

      expect(count > 0).toEqual(true);
   });

   it("Needs to function called > once", async function () {

      const debounced = debounce(doSomethingAsync, 0);

      debounced();
      debounced();

      await wait();

      expect(count > 0).toEqual(true);
   });
});

