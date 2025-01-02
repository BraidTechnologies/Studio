"use strict";
/**
 * @module IModelDrivers.OAI
 *
 * This module provides OpenAI-specific implementations for embedding model drivers.
 * It includes functionality to calculate text embeddings using Azure OpenAI services.
 *
 * Key components:
 * - OpenAIEmbeddingModelDriver: Implementation of IEmbeddingModelDriver for OpenAI
 * - calculateEmbedding: Utility function to compute embeddings via Azure OpenAI API
 *
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
exports.OpenAIChatModelDriver = exports.OpenAIEmbeddingModelDriver = void 0;
exports.calculateEmbedding = calculateEmbedding;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const IPromptPersonaFactory_1 = require("./IPromptPersonaFactory");
/**
 * Class representing an OpenAI embedding model driver.
 * Implements the IEmbeddingModelDriver interface.
 *
 * @method embed
 * @param {string} text - The text to be embedded.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of numbers representing the embedding.
 * @throws {Error} Throws an error if the method is not implemented.
 */
class OpenAIEmbeddingModelDriver {
    embed(text) {
        return calculateEmbedding(text);
    }
}
exports.OpenAIEmbeddingModelDriver = OpenAIEmbeddingModelDriver;
/**
 * Asynchronously calculates the embedding for the given text using the Azure AI service.
 *
 * @param text The text for which the embedding needs to be calculated.
 * @returns A Promise that resolves to an array of numbers representing the calculated embedding.
 */
function calculateEmbedding(text) {
    return __awaiter(this, void 0, void 0, function* () {
        // Up to 5 retries if we hit rate limit
        (0, axios_retry_1.default)(axios_1.default, {
            retries: 5,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                var _a;
                return ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429 || axios_retry_1.default.isNetworkOrIdempotentRequestError(error);
            }
        });
        const response = yield axios_1.default.post('https://studiomodels.openai.azure.com/openai/deployments/StudioEmbeddingLarge/embeddings?api-version=2024-06-01', {
            input: text,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.AzureAiKey
            }
        });
        const embedding = response.data.data[0].embedding;
        return (embedding);
    });
}
class OpenAIChatModelDriver {
    generateResponse(persona, words, prompt) {
        return chat(persona, prompt.prompt, words);
    }
}
exports.OpenAIChatModelDriver = OpenAIChatModelDriver;
/**
 * Asynchronously summarizes the given text using an AI assistant.
 *
 * @param persona - The persona to use for the chat
 * @param text The text to be summarized.
 * @param words The number of words to use for the summary.
 * @returns A Promise that resolves to the new conversation element.
 */
function chat(persona, text, words) {
    return __awaiter(this, void 0, void 0, function* () {
        // Up to 5 retries if we hit rate limit
        (0, axios_retry_1.default)(axios_1.default, {
            retries: 5,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                var _a;
                return ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429 || axios_retry_1.default.isNetworkOrIdempotentRequestError(error);
            }
        });
        const summariser = (0, IPromptPersonaFactory_1.getSummariser)(persona, words, text);
        const systemPrompt = summariser.systemPrompt;
        const userPrompt = summariser.itemPrompt;
        console.log(systemPrompt);
        const response = yield axios_1.default.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
                },
                {
                    role: 'user',
                    content: userPrompt
                }
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.AzureAiKey
            }
        });
        return (response.data.choices[0].message.content);
    });
}
//# sourceMappingURL=IModelDrivers.OAI.js.map