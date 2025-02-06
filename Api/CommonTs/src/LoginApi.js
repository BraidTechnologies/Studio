"use strict";
// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module LoginApi
 * @description Provides an API for handling login operations.
 *
 * This module contains the LoginApi class, which handles the login process
 * using LinkedIn API. It provides methods for:
 * - Logging in using LinkedIn API
 * - Handling errors and retries for login operations
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginApi = void 0;
const axios_1 = __importDefault(require("axios"));
const Api_1 = require("./Api");
/**
 * Represents a class for handling login operations.
 * @constructor
 * @param environment_ - The environment settings for the login operations.
 * @param sessionKey_ - The session key for the current login session.
 * @returns A Promise that resolves to a string indicating the login status.
 */
class LoginApi extends Api_1.Api {
    /**
     * Initializes a new instance of the class with the provided environment and session key.
     *
     * @param environment_ The environment settings to be used.
     * @param sessionKey_ The session key for authentication.
     */
    constructor(environment_, sessionKey_) {
        super(environment_, sessionKey_);
    }
    /**
     * Asynchronously logs in using LinkedIn API.
     *
     * @returns A Promise that resolves to a string indicating the status after attempting to log in.
     */
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.loginWithLinkedInApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, {});
                if (response.status === 200) {
                    return "Redirecting...";
                }
                else {
                    console.error("Error, status: " + response.status);
                    return "";
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return "";
            }
        });
    }
}
exports.LoginApi = LoginApi;
//# sourceMappingURL=LoginApi.js.map