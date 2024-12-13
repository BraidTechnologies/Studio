"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decompressString = exports.compressString = void 0;
const pako = __importStar(require("pako"));
/**
 * Compresses a string using deflate algorithm
 * @param input The string to compress
 * @returns Base64 encoded compressed string
 */
function compressString(input) {
    // Convert string to Uint8Array
    const data = new TextEncoder().encode(input);
    // Compress the data
    const compressed = pako.deflate(data);
    // Universal base64 encoding
    if (typeof window === 'undefined') {
        // Node.js environment
        return Buffer.from(compressed).toString('base64');
    }
    else {
        // Browser environment
        return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
    }
}
exports.compressString = compressString;
/**
 * Decompresses a string that was compressed using compressString
 * @param input Base64 encoded compressed string
 * @returns Original decompressed string
 */
function decompressString(input) {
    try {
        // Universal base64 decoding
        let compressedData;
        if (typeof window === 'undefined') {
            // Node.js environment
            compressedData = Buffer.from(input, 'base64');
        }
        else {
            // Browser environment
            compressedData = new Uint8Array(atob(input).split('').map(char => char.charCodeAt(0)));
        }
        // Decompress the data
        const decompressed = pako.inflate(compressedData);
        // Convert back to string
        return new TextDecoder().decode(decompressed);
    }
    catch (error) {
        throw new Error('Failed to decompress string: Invalid input');
    }
}
exports.decompressString = decompressString;
//# sourceMappingURL=Compress.js.map