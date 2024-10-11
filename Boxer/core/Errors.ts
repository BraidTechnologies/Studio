// Copyright (c) 2024 Braid Technologies Ltd

import { logApiError, logCoreError } from "./Logging";

export class InvalidParameterError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidParameterError.name; // stack traces display correctly now

      logCoreError ("InvalidParameterError:" + (message ? message : ""), this.cause ? this.cause: "");
   }
}

export class InvalidOperationError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidOperationError.name; // stack traces display correctly now

      logCoreError ("InvalidOperationError:" + (message ? message : ""), this.cause ? this.cause: "");      
   }
}

export class InvalidStateError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = InvalidStateError.name; // stack traces display correctly now

      logCoreError ("InvalidStateError:" + (message ? message : ""), this.cause ? this.cause: "");      
   }
}

export class ConnectionError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = ConnectionError.name; // stack traces display correctly now

      logApiError ("ConnectionError:" + (message ? message : ""), this.cause ? this.cause: "");      
   }
}

export class EnvironmentError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = EnvironmentError.name; // stack traces display correctly now

      logCoreError ("EnvironmentError:" + (message ? message : ""), this.cause ? this.cause: "");       
   }
}

export class AssertionFailedError extends Error {
   constructor(message?: string) {
      super(message);
      // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.name = AssertionFailedError.name; // stack traces display correctly now

      logCoreError ("AssertionFailedError:" + (message ? message : ""), this.cause ? this.cause: "");       
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