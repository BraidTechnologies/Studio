'use strict';
// Copyright Braid technologies ltd, 2024
import { expect } from 'expect';
import { describe, it } from 'mocha';

import { InvalidParameterError, InvalidOperationError, ConnectionError, EnvironmentError, InvalidStateError } from '../core/Errors';

var message = "What";

describe("Errors", function () {

   it("Needs to create InvalidParameterError", function () {

      var error: InvalidParameterError = new InvalidParameterError(message);
      expect(error.message === message).toEqual(true);
   });

   it("Needs to create InvalidOperationError", function () {

      var error: InvalidOperationError = new InvalidOperationError(message);
      expect(error.message === message).toEqual(true);
   });

   it("Needs to create ConnectionError", function () {

      var error: ConnectionError = new ConnectionError(message);
      expect(error.message === message).toEqual(true);
   });

   it("Needs to create EnvironmentError", function () {

      var error: EnvironmentError = new EnvironmentError(message);
      expect(error.message === message).toEqual(true);
   });

   it("Needs to create InvalidStateerror", function () {

      var error: InvalidStateError = new InvalidStateError(message);
      expect(error.message === message).toEqual(true);
   });   
});

