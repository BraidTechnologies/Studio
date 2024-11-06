// Copyright (c) 2024 Braid Technologies Ltd

import { AssertionFailedError} from './Errors';

export const throwIfUndefined: <T, >(x: T | undefined) => asserts x is T = x => {
   if (typeof x === "undefined") throw new AssertionFailedError ("Object is undefined.");
}

export const throwIfNull: <T, >(x: T | null) => asserts x is T = x => {
   if (x === null) throw new AssertionFailedError ("Object is null.");
}

