"use strict";
// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Chunk API
Object.defineProperty(exports, "__esModule", { value: true });
exports.kDefaultSimilarityThreshold = exports.EChunkRepository = void 0;
// For now there is only one sort of chunk repository. In future there may be new ones so we have an ID to distinguish them. 
var EChunkRepository;
(function (EChunkRepository) {
    EChunkRepository["kBoxer"] = "Boxer";
})(EChunkRepository || (exports.EChunkRepository = EChunkRepository = {}));
;
// Default is we only consider >= 50% relevant to present to the user (GPT4 seems to generate low scores ...)
exports.kDefaultSimilarityThreshold = 0.5;
//# sourceMappingURL=EnrichedChunk.js.map