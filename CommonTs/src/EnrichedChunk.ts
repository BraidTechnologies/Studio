/**
 * @fileoverview Defines the core data structures and interfaces for the Chunk API.
 * This module contains type definitions and interfaces for enriched chunks, which are
 * fundamental units of content that can be stored, queried, and retrieved based on
 * semantic similarity. It includes specifications for both client-side summaries and
 * server-side storage formats, as well as query parameters for retrieving relevant chunks.
 * 
 * Key components:
 * - EChunkRepository: Enumeration of available chunk storage repositories
 * - IEnrichedChunk: Complete chunk representation with embeddings
 * - IEnrichedChunkSummary: simple chunk representation
 * - IChunkQuerySpec: Base query parameters for chunk retrieval
 * 
 * @module EnrichedChunk
 */

// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API

// We have an ID to distinguish different Chunk repostories. 
export enum EChunkRepository {

   kBoxer = "Boxer",
   kWaterfall = "Waterfall"
};

// Default is we only consider >= 50% relevant to present to the user (GPT4 seems to generate low scores ...)
export const kDefaultSimilarityThreshold = 0.5;

