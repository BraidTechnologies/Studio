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
exports.OpenAITextChunker = exports.OpenAIChatModelDriver = exports.OpenAIEmbeddingModelDriver = void 0;
exports.calculateEmbedding = calculateEmbedding;
// Copyright (c) 2024 Braid Technologies Ltd
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
// Internal imports
const IModelDriver_1 = require("./IModelDriver");
const IPromptPersonaFactory_1 = require("./IPromptPersonaFactory");
const Errors_1 = require("./Errors");
const gpt4_tokenizer_1 = __importDefault(require("gpt4-tokenizer"));
const tokenizer = new gpt4_tokenizer_1.default({ type: 'gpt3' });
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
    constructor() {
        this.deploymentName = "Embed-3";
        this.drivenModelType = IModelDriver_1.EModel.kLarge;
        this.drivenModelProvider = IModelDriver_1.EModelProvider.kOpenAI;
    }
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
        try {
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
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
/**
 * Class representing a driver for OpenAI chat models.
 * Implements the IChatModelDriver interface to provide methods for
 * retrieving the model type and generating responses to conversation prompts.
 */
class OpenAIChatModelDriver {
    constructor() {
        this.deploymentName = "GTP4o";
        this.drivenModelType = IModelDriver_1.EModel.kLarge;
        this.drivenModelProvider = IModelDriver_1.EModelProvider.kOpenAI;
    }
    generateResponse(persona, prompt, params) {
        return chat(persona, prompt, params);
    }
}
exports.OpenAIChatModelDriver = OpenAIChatModelDriver;
/**
 * Asynchronously generates a chat response using the Azure OpenAI service.
 *
 * @param persona The type of persona (ArticleSummariser, CodeSummariser, or SurveySummariser) to use for the response
 * @param prompt The conversation prompt containing the system and user messages
 * @param params The parameters for the prompt
 * @returns A Promise that resolves to a model conversation element containing the LLM response
 */
function chat(persona, prompt, params) {
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
        const summariser = (0, IPromptPersonaFactory_1.getChatPersona)(persona, prompt.prompt, params);
        const systemPrompt = summariser.systemPrompt;
        const userPrompt = summariser.itemPrompt;
        let messages = [];
        messages.push({
            role: 'system',
            content: systemPrompt
        });
        for (const message of prompt.history) {
            messages.push({
                role: message.role,
                content: message.content
            });
        }
        messages.push({
            role: 'user',
            content: userPrompt
        });
        try {
            const response = yield axios_1.default.post('https://studiomodels.openai.azure.com/openai/deployments/StudioLarge/chat/completions?api-version=2024-06-01', {
                messages: messages
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.AzureAiKey
                }
            });
            return { role: IModelDriver_1.EModelConversationRole.kAssistant,
                content: response.data.choices[0].message.content };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
/**
 * GPT4 class implementing ITextChunker interface.
 * Represents a model with specific deployment settings and context window sizes.
 */
class OpenAITextChunker {
    constructor() {
        this.drivenModelProvider = IModelDriver_1.EModelProvider.kOpenAI;
        this.implementsModel = IModelDriver_1.EModel.kLarge;
        this.defaultChunkSize = 8192;
        this.maximumChunkSize = 65536;
        this.embeddingChunkSize = 8191;
        this.defaultChunkSizeWithBuffer = (8192 - 256);
        this.embeddingChunkSizeWithBuffer = (8191 - 256);
        this.maximumChunkSizeWithBuffer = (65536 - 256);
    }
    /**
     * Checks if the given text fits within the context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInDefaultChunk(text) {
        let estimatedTokens = tokenizer.estimateTokenCount(text);
        if (estimatedTokens < this.defaultChunkSizeWithBuffer)
            return true;
        return false;
    }
    /**
     * Checks if the given text fits within the maximum context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInMaximumChunk(text) {
        let estimatedTokens = tokenizer.estimateTokenCount(text);
        if (estimatedTokens < this.maximumChunkSizeWithBuffer)
            return true;
        return false;
    }
    /**
     * Checks if the given text fits within the embedding context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInEmbeddingChunk(text) {
        let estimatedTokens = tokenizer.estimateTokenCount(text);
        if (estimatedTokens < this.embeddingChunkSizeWithBuffer)
            return true;
        return false;
    }
    /**
     * Splits the input text into chunks based on the specified overlap of words.
     *
     * @param text The text to be chunked.
     * @param overlapWords The number of overlapping words between consecutive chunks. If undefined, we chunk with no obverlap.
     * @returns An array of strings representing the chunked text.
     */
    chunkText(text, chunkSize, overlapWords) {
        let effectiveChunkSize = chunkSize
            ? Math.min(this.defaultChunkSizeWithBuffer, chunkSize)
            : this.defaultChunkSizeWithBuffer;
        if (overlapWords) {
            if (overlapWords > effectiveChunkSize)
                throw new Errors_1.InvalidParameterError("Overlap window size cannot be bigger than chunk size");
            // If the users requests overlapping chunks, we divide the text into pieces the size of the overlap, then glue them back
            // together until we fill a buffer. 
            let chunked = tokenizer.chunkText(text, Math.floor(overlapWords * 2));
            let chunks = new Array();
            let workingBufferText = "";
            let workingBufferTokens = 0;
            let lastChunkText = "";
            let lastChunkTokens = 0;
            for (let i = 0; i < chunked.length; i++) {
                let thisChunkText = chunked[i].text;
                let thisChunkTokens = tokenizer.estimateTokenCount(thisChunkText);
                if (workingBufferTokens + thisChunkTokens < effectiveChunkSize) {
                    // If we are within buffer size, we just accumulate
                    workingBufferText = workingBufferText + thisChunkText;
                    workingBufferTokens = workingBufferTokens + thisChunkTokens;
                }
                else {
                    // If we are outside buffer, we save the current chunk and build the start of the next one
                    chunks.push(workingBufferText);
                    workingBufferText = lastChunkText + thisChunkText;
                    workingBufferTokens = lastChunkTokens + thisChunkTokens;
                }
                // If we have reached the last chunk, we have to save it. 
                if (i === chunked.length - 1) {
                    chunks.push(workingBufferText);
                }
                lastChunkTokens = thisChunkTokens;
                lastChunkText = thisChunkText;
            }
            return chunks;
        }
        else {
            let chunked = tokenizer.chunkText(text, effectiveChunkSize);
            let chunks = new Array();
            for (let i = 0; i < chunked.length; i++) {
                chunks.push(chunked[i].text);
            }
            return chunks;
        }
    }
    /**
     * Estimates the number of tokens in the provided text using the tokenizer.
     *
     * @param text The text for which to estimate the number of tokens.
     * @returns The estimated number of tokens in the text.
     */
    estimateTokens(text) {
        return tokenizer.estimateTokenCount(text);
    }
}
exports.OpenAITextChunker = OpenAITextChunker;
//# sourceMappingURL=ModelDrivers.OAI.js.map