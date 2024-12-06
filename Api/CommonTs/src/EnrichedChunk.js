"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API
Object.defineProperty(exports, "__esModule", { value: true });
exports.kDefaultSimilarityThreshold = exports.EChunkRepository = void 0;
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