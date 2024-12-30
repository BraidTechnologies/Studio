"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module Model
 * @description Provides a class for managing AI models and their deployment settings.
 *
 * This module contains the GPT4 class, which implements the IModel interface.
 * It provides methods for:
 * - Checking if a text fits within the context window size with buffer
 * - Chunking text into smaller pieces with optional overlap
 * - Estimating the number of tokens in a given text
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPT4 = void 0;
const Errors_1 = require("./Errors");
const IModel_1 = require("./IModel");
const gpt4_tokenizer_1 = __importDefault(require("gpt4-tokenizer"));
const tokenizer = new gpt4_tokenizer_1.default({ type: 'gpt3' });
/**
 * GPTM class implementing IModel interface.
 * Represents a model with specific deployment settings and context window sizes.
 */
class GPT4 {
    constructor() {
        this.implementsModel = IModel_1.EModel.kLarge;
        this.deploymentName = "GPT4o";
        this.embeddingDeploymentName = "Embed-3";
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
exports.GPT4 = GPT4;
//# sourceMappingURL=Model.OAI.js.map