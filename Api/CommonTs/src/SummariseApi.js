"use strict";
// Copyright (c) 2024, 2025 Braid Technologies Ltd
/**
 * @module SummariseApi
 * @description Provides functionality for text summarization through the Summarise API.
 *
 * This module contains the SummariseApi class which handles:
 * - Text summarization with configurable personas
 * - Context-aware summarization
 * - Integration with the base API functionality
 *
 * The class supports different summarization approaches based on the provided
 * prompt persona and handles communication with the backend summarization service.
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
exports.SummariseApi = void 0;
const axios_1 = __importDefault(require("axios"));
const Api_1 = require("./Api");
const IPromptPersona_1 = require("./IPromptPersona");
/**
 * Class representing an API for summarising text.
 */
class SummariseApi extends Api_1.Api {
    /**
     * Initializes a new instance of the class with the provided environment and session key.
     *
     * @param environment_ The environment settings to be used.
     * @param sessionKey_ The session key for authentication.
     */
    constructor(environment_, sessionKey_) {
        super(environment_, sessionKey_);
    }
    summarise(persona, text) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.summariseApi() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = undefined;
            try {
                let summariseRequest = {
                    persona: persona,
                    text: text
                };
                response = yield axios_1.default.post(apiUrl, {
                    request: summariseRequest
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
    summariseContext(context, chunk) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let apiUrl = this.environment.summariseContextApi() + "?session=" + this.sessionKey.toString();
            var response;
            let empty = undefined;
            try {
                let summariseRequest = {
                    persona: IPromptPersona_1.EPromptPersona.kArticleContextSummariser,
                    context: context,
                    chunk: chunk
                };
                response = yield axios_1.default.post(apiUrl, {
                    request: summariseRequest
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
exports.SummariseApi = SummariseApi;
//# sourceMappingURL=SummariseApi.js.map