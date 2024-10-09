"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = require("axios");
const Api_1 = require("./Api");
class SessionApi extends Api_1.Api {
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
     * Asynchronously checks the validity of a session key by sending a POST request to the session API endpoint.
     *
     * @returns A Promise that resolves to a boolean value indicating the validity of the session key.
     */
    checkSessionKey() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.checkSessionApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, {});
                if (response.status === 200) {
                    return response.data;
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
exports.SessionApi = SessionApi;
//# sourceMappingURL=SessionApi.js.map