"use strict";
// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module PageRepositoryApi
 * @description Provides an API for managing page storage and retrieval.
 *
 * This module contains the PageRepositoryApi class which handles storage operations
 * for pages in the application. It provides methods for:
 * - Saving pages to persistent storage
 * - Compressing page content for efficient storage
 *
 * The module extends the base Api class and implements IStorablePageRepositoryApiWrapper
 * to provide consistent storage patterns while handling page-specific requirements
 * like content compression.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageRepostoryApi = void 0;
const Api_1 = require("./Api");
const StorableRepositoryApi_1 = require("./StorableRepositoryApi");
const Compress_1 = require("./Compress");
/**
 * Represents an API for the Page repository
 *
 * @param {EEnvironment} environment_ - The environment to use for saving Pages.
 * @param {string} sessionKey_ - The session key for authentication.
 *
 * @method save - Saves a record to the Page API.
 * Does not provide a 'load' as Pages are loaded directly into the browser
 */
class PageRepostoryApi extends Api_1.Api {
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
     * Asynchronously saves a record to the page repository API.
     *
     * @param record - The record to be saved, must implement the IStoredPage interface.
     * @returns A Promise that resolves when the record is successfully saved, or rejects with an error.
     */
    save(record) {
        return __awaiter(this, void 0, void 0, function* () {
            let apiUrl = this.environment.savePageApi() + "?session=" + this.sessionKey.toString();
            return this.storableApi.save(record, apiUrl);
        });
    }
    /**
     * Compresses a string using deflate algorithm
     * @param input The string to compress
     * @returns Base64 encoded compressed string
     */
    compressString(input) {
        return (0, Compress_1.compressString)(input);
    }
    /**
     * Decompresses a string that was compressed using compressString
     * @param input Base64 encoded compressed string
     * @returns Original decompressed string
     */
    decompressString(input) {
        return (0, Compress_1.decompressString)(input);
    }
}
exports.PageRepostoryApi = PageRepostoryApi;
//# sourceMappingURL=PageRepositoryApi.js.map