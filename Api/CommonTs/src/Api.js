"use strict";
// Copyright (c) 2024, 2025 Braid Technologies Ltd
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
/**
 * Represents an API class that interacts with the specified environment using the provided session key.
 * This is a super class of each actual (useful) API. In itself it isn't very useful, it just holds common data.
 * @param {IEnvironment} environemnt_ - The environment interface to interact with.
 * @param {string} sessionKey_ - The session key for authentication.
 */
class Api {
    constructor(environemnt_, sessionKey_) {
        this._environment = environemnt_;
        this._sessionKey = sessionKey_;
    }
    get environment() {
        return this._environment;
    }
    get sessionKey() {
        return this._sessionKey;
    }
}
exports.Api = Api;
//# sourceMappingURL=Api.js.map