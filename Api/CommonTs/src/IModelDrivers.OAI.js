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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIEmbeddingModelDriver = void 0;
exports.calculateEmbedding = calculateEmbedding;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
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
//# sourceMappingURL=IModelDrivers.OAI.js.map