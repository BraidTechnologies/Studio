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
exports.ActivityRepostoryApi = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = require("axios");
const Api_1 = require("./Api");
/**
 * Represents an API for activities.
 *
 * @param {EEnvironment} environment_ - The environment to use for saving activities.
 * @param {string} sessionKey_ - The session key for authentication.
 *
 * @method save - Saves a record to the activity API.
 * @method remove - removes a record
 * @method recent - return a list of recent activities
 */
class ActivityRepostoryApi extends Api_1.Api {
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
     * Asynchronously saves a record to the activity repository API.
     *
     * @param record - The record to be saved, must implement the IStorable interface.
     * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
     */
    save(record) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.saveActivityApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, {
                    id: record.id,
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
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return false;
            }
        });
    }
    /**
     * Asynchronously removes a record from the activity repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
     */
    remove(recordId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.removeActivityApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, {
                    id: recordId
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
                console.error("Error: " + ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.data));
                return false;
            }
        });
    }
    /**
     * Asynchronously retrieves recent records from the activity repository API based on the provided query specifications.
     *
     * @param querySpec - The query specifications including the limit and className to filter the records.
     * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
     */
    recent(querySpec) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.getActivitiesApi() + "?session=" + this.sessionKey.toString();
            var response;
            try {
                response = yield axios_1.default.post(apiUrl, querySpec);
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
exports.ActivityRepostoryApi = ActivityRepostoryApi;
//# sourceMappingURL=ActivityRepositoryApi.js.map