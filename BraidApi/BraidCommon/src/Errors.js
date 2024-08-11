"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionFailedError = exports.EnvironmentError = exports.ConnectionError = exports.InvalidStateError = exports.InvalidOperationError = exports.InvalidParameterError = void 0;
const Logging_1 = require("./Logging");
/**
 * Represents an error thrown when an invalid parameter is encountered.
 * @param {string} message - The error message describing the invalid parameter.
 */
class InvalidParameterError extends Error {
    constructor(message) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = InvalidParameterError.name; // stack traces display correctly now
        (0, Logging_1.logCoreError)("InvalidParameterError:" + (message ? message : ""), this.cause ? this.cause : "");
    }
}
exports.InvalidParameterError = InvalidParameterError;
/**
 * Represents an error that occurs when an invalid operation is attempted.
 * @extends Error
 * @constructor
 * @param {string} [message] - The error message.
 */
class InvalidOperationError extends Error {
    constructor(message) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = InvalidOperationError.name; // stack traces display correctly now
        (0, Logging_1.logCoreError)("InvalidOperationError:" + (message ? message : ""), this.cause ? this.cause : "");
    }
}
exports.InvalidOperationError = InvalidOperationError;
/**
 * Represents an error indicating an invalid state.
 * @param message - Optional. A message to describe the error.
 */
class InvalidStateError extends Error {
    constructor(message) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = InvalidStateError.name; // stack traces display correctly now
        (0, Logging_1.logCoreError)("InvalidStateError:" + (message ? message : ""), this.cause ? this.cause : "");
    }
}
exports.InvalidStateError = InvalidStateError;
/**
 * Represents a custom error class for connection-related errors.
 * @class ConnectionError
 * @extends Error
 * @constructor
 * @param {string} [message] - The error message.
 */
class ConnectionError extends Error {
    constructor(message) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = ConnectionError.name; // stack traces display correctly now
        (0, Logging_1.logApiError)("ConnectionError:" + (message ? message : ""), this.cause ? this.cause : "");
    }
}
exports.ConnectionError = ConnectionError;
/**
 * Represents an error related to the environment.
 * @param {string} [message] - The error message.
 */
class EnvironmentError extends Error {
    constructor(message) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = EnvironmentError.name; // stack traces display correctly now
        (0, Logging_1.logCoreError)("EnvironmentError:" + (message ? message : ""), this.cause ? this.cause : "");
    }
}
exports.EnvironmentError = EnvironmentError;
/**
 * Represents an error that occurs when an assertion fails.
 * @param message - Optional. A message to describe the error.
 */
class AssertionFailedError extends Error {
    constructor(message) {
        super(message);
        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = AssertionFailedError.name; // stack traces display correctly now
        (0, Logging_1.logCoreError)("AssertionFailedError:" + (message ? message : ""), this.cause ? this.cause : "");
    }
}
exports.AssertionFailedError = AssertionFailedError;
/*
 
export class InvalidUnitError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidUnitError.name; // stack traces display correctly now
   }
}

export class InvalidFormatError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidFormatError.name; // stack traces display correctly now
   }
}

export class InvalidServerResponseError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidServerResponseError.name; // stack traces display correctly now
   }
}

*/ 
//# sourceMappingURL=Errors.js.map