// Copyright (c) 2024 Braid Technologies Ltd
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