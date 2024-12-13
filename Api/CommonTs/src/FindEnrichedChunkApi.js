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
exports.FindEnrichedChunkApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = __importDefault(require("axios"));
const Api_1 = require("./Api");
/**
 * Class representing an API for finding enriched chunks.
 */
class FindEnrichedChunkApi extends Api_1.Api {
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
     * Asynchronously finds an enriched chunk summary based on the provided URL query.
     *
     * @param urlQuery - The URL query specifying the URL to search for the enriched chunk.
     * @returns An IEnrichedChunkSummary objects representing the found enriched chunk summary, or undefined.
     */
    findChunkFromUrl(urlQuery) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.findEnrichedChunkFromUrl() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = undefined;
            try {
                response = yield axios_1.default.post(apiUrl, {
                    data: urlQuery
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
     * Asynchronously finds relevant enriched chunks based on the provided URL query.
     *
     * @param urlQuery - The URL query specifying the URL to search for relevant enriched chunks.
     * @returns A Promise that resolves to an array of IRelevantEnrichedChunk objects representing the found relevant enriched chunks.
     */
    findRelevantChunksFromUrl(urlQuery) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.findRelevantEnrichedChunksFromUrl() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = new Array();
            try {
                response = yield axios_1.default.post(apiUrl, {
                    data: urlQuery
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
     * Asynchronously finds relevant enriched chunks based on the provided summary query.
     *
     * @param urlQuery - The summary query specifying the summary to search for relevant enriched chunks.
     * @returns A Promise that resolves to an array of IRelevantEnrichedChunk objects representing the found relevant enriched chunks.
     */
    findRelevantChunksFromSummary(urlQuery) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.findRelevantEnrichedChunksFromSummary() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = new Array();
            try {
                response = yield axios_1.default.post(apiUrl, {
                    data: urlQuery
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
exports.FindEnrichedChunkApi = FindEnrichedChunkApi;
//# sourceMappingURL=FindEnrichedChunkApi.js.map