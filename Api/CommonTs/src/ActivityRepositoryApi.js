"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
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
/**
 * @module ActivityRepositoryApi
 *
 * This module provides an API wrapper for managing activity records in a repository.
 * It extends the base Api class and implements IStorableRepostoryApiWrapper interface
 * to provide CRUD operations for activity records.
 *
 * The module handles:
 * - Loading individual activity records
 * - Finding activities by search key
 * - Saving new or updated activities
 * - Removing activities
 * - Retrieving recent activities with query specifications
 *
 * All operations require proper authentication via session key and communicate
 * with the appropriate environment-specific API endpoints.
 */
const Api_1 = require("./Api");
const StorableRepositoryApi_1 = require("./StorableRepositoryApi");
/**
 * Represents an API for activities.
 *
 * @param {EEnvironment} environment_ - The environment to use for saving activities.
 * @param {string} sessionKey_ - The session key for authentication.
 *
 * @method save - Saves a record to the Activity API.
 * @method remove - removes a record
 * @method load - load an Activity given the key
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
        this.storableApi = new StorableRepositoryApi_1.StorableRepostoryApi();
    }
    /**
     * Asynchronously loads a record from the activity repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
     */
    load(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.getActivityApi() + "?session=" + this.sessionKey.toString();
            return this.storableApi.load(recordId, apiUrl);
        });
    }
    /**
     * Asynchronously finds a record from the activity repository API.
     *
     * @param functionalSearchKey - The ID of the record to be removed.
     * @returns A Promise that resolves to the record if successfully removed, undefined otherwise.
     */
    find(functionalSearchKey) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.findActivityApi() + "?session=" + this.sessionKey.toString();
            return this.storableApi.load(functionalSearchKey, apiUrl);
        });
    }
    /**
     * Asynchronously saves a record to the activity repository API.
     *
     * @param record - The record to be saved, must implement the IStorable interface.
     * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
     */
    save(record) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.saveActivityApi() + "?session=" + this.sessionKey.toString();
            return this.storableApi.save(record, apiUrl);
        });
    }
    /**
     * Asynchronously removes a record from the activity repository API.
     *
     * @param recordId - The ID of the record to be removed.
     * @returns A Promise that resolves to true if the record is successfully removed, false otherwise.
     */
    remove(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.removeActivityApi() + "?session=" + this.sessionKey.toString();
            return this.storableApi.remove(recordId, apiUrl);
        });
    }
    /**
     * Asynchronously retrieves recent records from the activity repository API based on the provided query specifications.
     *
     * @param querySpec - The query specifications including the limit and storeClassName to filter the records.
     * @returns A Promise that resolves to an array of IStorable objects representing the recent records, or an empty array if an error occurs.
     */
    recent(querySpec) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.getActivitiesApi() + "?session=" + this.sessionKey.toString();
            return this.storableApi.recent(querySpec, apiUrl);
        });
    }
}
exports.ActivityRepostoryApi = ActivityRepostoryApi;
//# sourceMappingURL=ActivityRepositoryApi.js.map