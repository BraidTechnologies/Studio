/**
 * @module Compress
 * 
 * This module provides functions for compressing and decompressing strings using the deflate algorithm.
 * It supports both Node.js and browser environments.
 */
// Copyright (c) 2024, 2025 Braid Technologies Ltd
import * as pako from 'pako';


/**
 * Compresses a string using deflate algorithm
 * @param input The string to compress
 * @returns Base64 encoded compressed string
 */
export function compressString(input: string): string {
   // Convert string to Uint8Array
   const data = new TextEncoder().encode(input);
   // Compress the data
   const compressed = pako.deflate(data);

   // Universal base64 encoding
   if (typeof window === 'undefined') {
      // Node.js environment
      return Buffer.from(compressed).toString('base64');
   } else {
      // Browser environment
      return btoa(String.fromCharCode.apply(null, Array.from(compressed)));
   }
}

/**
 * Decompresses a string that was compressed using compressString
 * @param input Base64 encoded compressed string
 * @returns Original decompressed string
 */
export function decompressString(input: string): string {
   try {
      // Universal base64 decoding
      let compressedData: Uint8Array;
      if (typeof window === 'undefined') {
         // Node.js environment
         compressedData = Buffer.from(input, 'base64');
      } else {
         // Browser environment
         compressedData = new Uint8Array(
            atob(input).split('').map(char => char.charCodeAt(0))
         );
      }

      // Decompress the data
      const decompressed = pako.inflate(compressedData);
      // Convert back to string
      return new TextDecoder().decode(decompressed);
   } catch (error) {
      throw new Error('Failed to decompress string: Invalid input');
   }
}