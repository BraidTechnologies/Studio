"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepostoryApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = __importDefault(require("axios"));
/**
 * Represents an API for activities.
 *
 * @param {EEnvironment} environemnt_ - The environment to use for saving activities.
 * @param {string} sessionKey_ - The session key for authentication.
 *
 * @method save - Saves a record to the activity API.
 */
class ActivityRepostoryApi {
    _environment;
    _sessionKey;
    constructor(environemnt_, sessionKey_) {
        this._environment = environemnt_;
        this._sessionKey = sessionKey_;
    }
    /**
     * Asynchronously saves a record to the activity repository API.
     *
     * @param record - The record to be saved, must implement the IStorable interface.
     * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
     */
    async save(record) {
        let apiUrl = this._environment.saveActivityApi() + "?session=" + this._sessionKey.toString();
        var response;
        try {
            response = await axios_1.default.post(apiUrl, {
                id: record.storeId,
                data: record
            });
            if (response.status === 200) {
                return true;
            }
            else {
                console.error("Error, status: " + response.status);
                return false;
            }
        }
        catch (e) {
            console.error("Error: " + e?.response?.data);
            return false;
        }
    }
    async remove(recordId) {
        let apiUrl = this._environment.removeActivityApi() + "?session=" + this._sessionKey.toString();
        var response;
        try {
            response = await axios_1.default.post(apiUrl, {
                storeId: recordId
            });
            if (response.status === 200) {
                return true;
            }
            else {
                console.error("Error, status: " + response.status);
                return false;
            }
        }
        catch (e) {
            console.error("Error: " + e?.response?.data);
            return false;
        }
    }
    async recent(querySpec) {
        let apiUrl = this._environment.getActivitiesApi() + "?session=" + this._sessionKey.toString();
        var response;
        try {
            response = await axios_1.default.post(apiUrl, querySpec);
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
            console.error("Error: " + e?.response?.data);
            return new Array();
        }
    }
}
exports.ActivityRepostoryApi = ActivityRepostoryApi;
//# sourceMappingURL=ActivityRepositoryApi.js.map