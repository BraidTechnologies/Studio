"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.kDefaultSimilarityThreshold = exports.EChunkRepository = void 0;
// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API
// We have an ID to distinguish different Chunk repostories. 
var EChunkRepository;
(function (EChunkRepository) {
    EChunkRepository["kBoxer"] = "Boxer";
    EChunkRepository["kWaterfall"] = "Waterfall";
})(EChunkRepository || (exports.EChunkRepository = EChunkRepository = {}));
;
// Default is we only consider >= 50% relevant to present to the user (GPT4 seems to generate low scores ...)
exports.kDefaultSimilarityThreshold = 0.5;
//# sourceMappingURL=EnrichedChunk.js.map