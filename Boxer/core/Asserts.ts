// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module Asserts
 * @description Provides utility functions for asserting the validity of objects.
 * 
 * This module includes functions for checking if an object is undefined or null,
 * and throwing an error if it is. It is used to enforce type safety and prevent
 * runtime errors in the application.
 */

import { AssertionFailedError} from './Errors';

export const throwIfUndefined: <T, >(x: T | undefined) => asserts x is T = x => {
   if (typeof x === "undefined") throw new AssertionFailedError ("Object is undefined.");
}

export const throwIfNull: <T, >(x: T | null) => asserts x is T = x => {
   if (x === null) throw new AssertionFailedError ("Object is null.");
}

