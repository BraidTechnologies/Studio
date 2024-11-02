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
exports.ChunkRepostoryApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = require("axios");
const Api_1 = require("./Api");
/**
 * Represents an API for the Chunk repository
 *
 * @param {EEnvironment} environment_ - The environment to use for saving Chunks.
 * @param {string} sessionKey_ - The session key for authentication.
 *
 * @method save - Saves a record to the activity API.
 * @method remove - removes a record
 * @method recent - return a list of recent activities
 */
class ChunkRepostoryApi extends Api_1.Api {
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
     * Asynchronously saves a record to the chunk repository API.
     *
     * @param record - The record to be saved, must implement the IStoredChunk interface.
     * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
     */
    save(record) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.saveStoredChunkApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, record);
                if (response.status === 200) {
                    return true;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return false;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return false;
            }
        });
    }
    /**
     * Asynchronously removes a record from the chunk repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
     */
    remove(querySpec) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.removeStoredChunkApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, querySpec);
                if (response.status === 200) {
                    return true;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return false;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return false;
            }
        });
    }
    /**
     * Asynchronously retrieves a record from the chunk repository API based on the provided query specifications.
     *
     * @param querySpec - The query specification
     * @returns A Promise that resolves to an IStorable object representing the records, or undefined
     */
    load(querySpec) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.getStoredChunkApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, querySpec);
                if (response.status === 200) {
                    let responseRecord = response.data;
                    return responseRecord;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return undefined;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return undefined;
            }
        });
    }
}
exports.ChunkRepostoryApi = ChunkRepostoryApi;
//# sourceMappingURL=ChunkRepositoryApi.js.map