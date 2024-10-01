// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

/**
 * Interface for defining the specifications of a chunk.
 * @property {string} text - The text content of the chunk.
 * @property {number | undefined} chunkSize - The size of the chunk, if specified.
 */
export interface IChunkRequest{

   text: string;
   chunkSize: number | undefined;
   overlapWords: number | undefined;
}

