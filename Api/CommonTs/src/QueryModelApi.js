"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module QueryModelApi
 * @description Provides an API for querying models with enrichment and generating questions.
 *
 * This module contains the QueryModelApi class, which handles the interaction with the specified environment
 * to query models with enrichment and generate questions. It provides methods for:
 * - Querying models with enrichment
 * - Generating questions
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
exports.QueryModelApi = void 0;
const axios_1 = __importDefault(require("axios"));
const Api_1 = require("./Api");
/**
 * Represents a QueryModelApi class that interacts with the specified environment to query models with enrichment and generate questions.
 * @constructor
 * @param environment_ - The environment to interact with.
 * @param sessionKey_ - The session key for authentication.
 */
class QueryModelApi extends Api_1.Api {
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
     * Asynchronously queries the model with enrichment data.
     *
     * @param query - The enriched query data to be sent.
     * @returns A promise that resolves to the enriched response data, or undefined if an error occurs.
     */
    queryModelWithEnrichment(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.queryModelWithEnrichment() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = undefined;
            try {
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
    /**
     * Asynchronously generates a question based on the provided query data.
     *
     * @param query - The data containing persona prompt, question generation prompt, and summary.
     * @returns A promise that resolves to the generated question response, or undefined if an error occurs.
     */
    generateQuestion(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.generateQuestion() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = undefined;
            try {
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
exports.QueryModelApi = QueryModelApi;
//# sourceMappingURL=QueryModelApi.js.map