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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluidApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const Api_1 = require("./Api");
class FluidApi extends Api_1.Api {
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
     * Asynchronously generates a token using the provided query parameters.
     *
     * @param query - The request object containing documentId, userId, and userName.
     * @returns A Promise that resolves to a string if successful, otherwise undefined.
     */
    generateToken(query) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.generateFluidTokenApi() + "?session=" + this.sessionKey;
            var response;
            let empty = undefined;
            try {
                // Up to 5 retries - it is a big fail if we cannot get a token for Fluid
                (0, axios_retry_1.default)(axios_1.default, {
                    retries: 5,
                    retryDelay: axios_retry_1.default.exponentialDelay,
                    retryCondition: (error) => {
                        var _a;
                        return ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429 || axios_retry_1.default.isNetworkOrIdempotentRequestError(error);
                    }
                });
                response = yield axios_1.default.post(apiUrl, {
                    data: query
                });
                if (response.status === 200) {
                    return response.data;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return empty;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return empty;
            }
        });
    }
}
exports.FluidApi = FluidApi;
//# sourceMappingURL=FluidApi.js.map