/**
 * Custom error classes for the Braid application.
 * 
 * This module provides a collection of specialized error classes that extend the base Error class.
 * Each error type is designed to handle specific categories of errors that may occur within the
 * application, such as invalid parameters, connection issues, or environment-related problems.
 * 
 * All error classes include:
 * - Proper prototype chain restoration for TypeScript
 * - Automatic error logging through logCoreError or logApiError
 * - Standardized error naming for stack traces
 * 
 * @module Errors
 */

import { logApiError, logCoreError } from "./Logging";

/**
 * Represents an error thrown when an invalid parameter is encountered.
 * @param {string} message - The error message describing the invalid parameter.
 */
export class InvalidParameterError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidParameterError.name; // stack traces display correctly now

      logCoreError ("InvalidParameterError:" + (message ? message : ""), JSON.stringify (this));
   }
}

/**
 * Represents an error that occurs when an invalid operation is attempted.
 * @extends Error
 * @constructor
 * @param {string} [message] - The error message.
 */
export class InvalidOperationError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidOperationError.name; // stack traces display correctly now

      logCoreError ("InvalidOperationError:" + (message ? message : ""), JSON.stringify (this));      
   }
}


/**
 * Represents an error indicating an invalid state.
 * @param message - Optional. A message to describe the error.
 */
export class InvalidStateError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidStateError.name; // stack traces display correctly now

      logCoreError ("InvalidStateError:" + (message ? message : ""), JSON.stringify (this));      
   }
}

/**
 * Represents a custom error class for connection-related errors.
 * @class ConnectionError
 * @extends Error
 * @constructor
 * @param {string} [message] - The error message.
 */
export class ConnectionError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = ConnectionError.name; // stack traces display correctly now

      logApiError ("ConnectionError:" + (message ? message : ""), JSON.stringify (this));      
   }
}

/**
 * Represents an error related to the environment.
 * @param {string} [message] - The error message.
 */
export class EnvironmentError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = EnvironmentError.name; // stack traces display correctly now

      logCoreError ("EnvironmentError:" + (message ? message : ""), JSON.stringify (this));       
   }
}

/**
 * Represents an error that occurs when an assertion fails.
 * @param message - Optional. A message to describe the error.
 */
export class AssertionFailedError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = AssertionFailedError.name; // stack traces display correctly now

      logCoreError ("AssertionFailedError:" + (message ? message : ""), JSON.stringify (this));       
   }
}

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