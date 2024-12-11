"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIfFalse = exports.throwIfNull = exports.throwIfUndefined = void 0;
const Errors_1 = require("./Errors");
const throwIfUndefined = x => {
    if (typeof x === "undefined")
        throw new Errors_1.AssertionFailedError("Object is undefined.");
};
exports.throwIfUndefined = throwIfUndefined;
const throwIfNull = x => {
    if (x === null)
        throw new Errors_1.AssertionFailedError("Object is null.");
};
exports.throwIfNull = throwIfNull;
const throwIfFalse = x => {
    if (!x)
        throw new Errors_1.AssertionFailedError("Value is false.");
};
exports.throwIfFalse = throwIfFalse;
//# sourceMappingURL=Asserts.js.map