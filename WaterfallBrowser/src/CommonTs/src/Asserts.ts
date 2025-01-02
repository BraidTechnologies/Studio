// Copyright (c) 2024 Braid Technologies Ltd

/**
 * Provides type-safe assertion utilities for runtime checks.
 * 
 * This module contains a collection of assertion functions that help verify
 * runtime conditions and provide TypeScript type narrowing. Each function
 * throws an AssertionFailedError when the condition is not met.
 * 
 * @module Asserts
 */

import { AssertionFailedError} from './Errors';

export const throwIfUndefined: <T, >(x: T | undefined) => asserts x is T = x => {
   if (typeof x === "undefined") throw new AssertionFailedError ("Object is undefined.");
}

export const throwIfNull: <T, >(x: T | null) => asserts x is T = x => {
   if (x === null) throw new AssertionFailedError ("Object is null.");
}

export const throwIfFalse: (x: boolean) => asserts x is true = x => {
   if (!x) throw new AssertionFailedError ("Value is false.");
}
