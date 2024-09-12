"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPTMini = void 0;
const gpt4_tokenizer_1 = require("gpt4-tokenizer");
const tokenizer = new gpt4_tokenizer_1.default({ type: 'gpt3' });
/**
 * GPTMini class implementing IModel interface.
 * Represents a model with specific deployment settings and window sizes.
 */
class GPTMini {
    constructor() {
        this.deploymentName = "braiddefaultmini";
        this.contextWindowSize = 8192;
        this.contextWindowSizeWithBuffer = (8192 - 512);
    }
    fitsInContext(text) {
        let estimatedTokens = tokenizer.estimateTokenCount(text);
        if (estimatedTokens < this.contextWindowSizeWithBuffer)
            return true;
        return false;
    }
    chunkText(text) {
        let chunked = tokenizer.chunkText(text, this.contextWindowSizeWithBuffer);
        let chunks = new Array();
        for (let i = 0; i < chunked.length; i++) {
            chunks.push(chunked[i].text);
        }
        return chunks;
    }
    estimateTokens(text) {
        return tokenizer.estimateTokenCount(text);
    }
}
exports.GPTMini = GPTMini;
//# sourceMappingURL=Model.js.map