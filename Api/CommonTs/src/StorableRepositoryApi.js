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
exports.StorableRepostoryApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = require("axios");
;
/**
 * Represents an API for Storables.
 *
 * @param {EEnvironment} environment_ - The environment to use for saving Storables.
 * @param {string} sessionKey_ - The session key for authentication.
 *
 * @method save - Saves a record to the Storables API.
 * @method remove - removes a record
 * @method recent - return a list of recent Storables
 */
class StorableRepostoryApi {
    /**
     * Initializes a new instance of the class
     */
    constructor() {
    }
    /**
     * Asynchronously saves a record to the Storables repository API.
     *
     * @param record - The record to be saved, must implement the IStorable interface.
     * @param url - fully factored URL to the API to call
     * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
     */
    save(record, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            var response;
            try {
                response = yield axios_1.default.post(url, { request: record });
                if (response && response.status === 200) {
                    return true;
                }
                else {
                    console.error("Error, status: " + (response === null || response === void 0 ? void 0 : response.status));
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
     * Asynchronously removes a record from the Storables repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @param url - fully factored URL to the API to call
     * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
     */
    remove(recordId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let query = {
                id: recordId,
                functionalSearchKey: undefined
            };
            var response;
            try {
                response = yield axios_1.default.post(url, { request: query });
                if (response && response.status === 200) {
                    return true;
                }
                else {
                    console.error("Error, status: " + (response === null || response === void 0 ? void 0 : response.status));
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
     * Asynchronously loads a record from the Storable repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @param url - fully factored URL to the API to call
     * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
     */
    load(recordId, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let query = {
                id: recordId,
                functionalSearchKey: undefined
            };
            var response;
            try {
                response = yield axios_1.default.post(url, { request: query });
                if (response && response.status === 200) {
                    return response.data;
                }
                else {
                    console.error("Error, status: " + (response === null || response === void 0 ? void 0 : response.status));
                    return undefined;
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return undefined;
            }
        });
    }
    /**
     * Asynchronously finds a record from the Storable repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @param url - fully factored URL to the API to call
     * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
     */
    find(functionalSearchKey, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let query = {
                id: undefined,
                functionalSearchKey: functionalSearchKey
            };
            var response;
            try {
                response = yield axios_1.default.post(url, { request: query });
                if (response.status === 200) {
                    return response.data;
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
    /**
     * Asynchronously retrieves recent records from the Storables repository API based on the provided query specifications.
     *
     * @param querySpec - The query specifications including the limit and storeClassName to filter the records.
     * @param url - fully factored URL to the API to call
     * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
     */
    recent(querySpec, url) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            var response;
            try {
                response = yield axios_1.default.post(url, { request: querySpec });
                if (response.status === 200) {
                    let responseRecords = response.data;
                    let storedRecords = new Array();
                    for (let i = 0; i < responseRecords.length; i++) {
                        storedRecords.push(responseRecords[i]);
                    }
                    return storedRecords;
                }
                else {
                    console.error("Error, status: " + response.status);
                    return new Array();
                }
            }
            catch (e) {
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return new Array();
            }
        });
    }
}
exports.StorableRepostoryApi = StorableRepostoryApi;
//# sourceMappingURL=StorableRepositoryApi.js.map