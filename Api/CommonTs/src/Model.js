"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPT4 = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
const Errors_1 = require("./Errors");
const gpt4_tokenizer_1 = __importDefault(require("gpt4-tokenizer"));
const tokenizer = new gpt4_tokenizer_1.default({ type: 'gpt3' });
/**
 * GPTM class implementing IModel interface.
 * Represents a model with specific deployment settings and context window sizes.
 */
class GPT4 {
    constructor() {
        this.deploymentName = "BraidLarge";
        this.embeddingDeploymentName = "BraidLargeEmbedding";
        this.contextWindowSize = 8192;
        this.contextWindowSizeWithBuffer = (8192 - 256);
    }
    /**
     * Checks if the given text fits within the context window size with buffer.
     *
     * @param text The text to check if it fits within the context window size with buffer.
     * @returns True if the text fits within the context window size with buffer, false otherwise.
     */
    fitsInContext(text) {
        let estimatedTokens = tokenizer.estimateTokenCount(text);
        if (estimatedTokens < this.contextWindowSizeWithBuffer)
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
            ? Math.min(this.contextWindowSizeWithBuffer, chunkSize)
            : this.contextWindowSizeWithBuffer;
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
//# sourceMappingURL=Model.js.map