/**
 * @module ChunkApi.Types
 * @description Type definitions for the Chunk API, which handles text chunking operations.
 * This module provides interfaces for chunk request and response objects used in text
 * segmentation operations. It supports configurable chunk sizes and overlap between
 * chunks for optimal text processing.
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

/**
 * Interface for chunk reqiest API.
 * @property {string} text - The text content of the chunk.
 * @property {number | undefined} chunkSize - The size of the chunk in tokens, if specified.
 * @property {number | undefined} overlapWords - The size of the overlap between chunks, in words (=2 * tokens) if specified.
 */
export interface IChunkRequest{

   text: string;
   chunkSize?: number | undefined;
   overlapWords?: number | undefined;
}

/**
 * Return type of chunk reqiest API.
 * @property {Array<string>} chunks - Array of text chunks
 */
export interface IChunkResponse {

   chunks: Array<string>;
}