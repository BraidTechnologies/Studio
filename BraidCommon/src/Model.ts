// Copyright (c) 2024 Braid Technologies Ltd
import { InvalidParameterError } from './Errors';
import { IModel } from './IModel';
import GPT4Tokenizer from 'gpt4-tokenizer';

const tokenizer = new GPT4Tokenizer({ type: 'gpt3' });


/**
 * GPTMini class implementing IModel interface.
 * Represents a model with specific deployment settings and window sizes.
 */
export class GPTMini implements IModel {

   deploymentName: string;
   contextWindowSize: number;
   contextWindowSizeWithBuffer: number;

   public constructor() {
      this.deploymentName = "BraidLarge";
      this.contextWindowSize = 8192;
      this.contextWindowSizeWithBuffer = (8192 - 256)
   }

   /**
    * Checks if the given text fits within the context window size with buffer.
    * 
    * @param text The text to check if it fits within the context window size with buffer.
    * @returns True if the text fits within the context window size with buffer, false otherwise.
    */
   fitsInContext(text: string): boolean {

      let estimatedTokens = tokenizer.estimateTokenCount(text);

      if (estimatedTokens < this.contextWindowSizeWithBuffer)
         return true;
      return false;
   }

   /**
    * Splits the input text into chunks based on the specified overlap of words.
    * 
    * @param text The text to be chunked.
    * @param overlapWords The number of overlapping words between consecutive chunks. If undefined, we chunk with no obverlap. 
    * @returns An array of strings representing the chunked text.
    */
   chunkText(text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string> {

      let effectiveChunkSize = chunkSize
         ? Math.min(this.contextWindowSizeWithBuffer, chunkSize)
         : this.contextWindowSizeWithBuffer;

      if (overlapWords) {

         if (overlapWords > effectiveChunkSize)
            throw new InvalidParameterError ("Overlap window size cannot be bigger than chunk size")

         // If the users requests overlapping chunks, we divide the text into pieces the size of the overlap, then glue them back
         // together until we fill a buffer. 
         let chunked = tokenizer.chunkText(text, Math.floor(overlapWords * 2));
         let chunks = new Array<string>();

         let workingBufferText = "";
         let workingBufferTokens = 0;
         let lastChunkText = "";
         let lastChunkTokens = 0;

         for (let i = 0; i < chunked.length; i++) {

            let thisChunkText = chunked[i].text;
            let thisChunkTokens = tokenizer.estimateTokenCount(thisChunkText);

            if (workingBufferTokens + thisChunkTokens < effectiveChunkSize) {
               // If we are within buffer size, we just accumulate
               workingBufferText = workingBufferText + thisChunkText;
               workingBufferTokens = workingBufferTokens + thisChunkTokens;
            }
            else {
               // If we are outside buffer, we save the current chunk and build the start of the next one
               chunks.push(workingBufferText);

               workingBufferText = lastChunkText + thisChunkText
               workingBufferTokens = lastChunkTokens + thisChunkTokens;
            }

            // If we have reached the last chunk, we have to save it. 
            if (i === chunked.length - 1) {
               chunks.push(workingBufferText);
            }

            lastChunkTokens = thisChunkTokens;
            lastChunkText = thisChunkText;
         }
         return chunks;
      }
      else {
         let chunked = tokenizer.chunkText(text, effectiveChunkSize);

         let chunks = new Array<string>();

         for (let i = 0; i < chunked.length; i++) {
            chunks.push(chunked[i].text);
         }
         return chunks;
      }
   }

   /**
    * Estimates the number of tokens in the provided text using the tokenizer.
    * 
    * @param text The text for which to estimate the number of tokens.
    * @returns The estimated number of tokens in the text.
    */
   estimateTokens(text: string): number {

      return tokenizer.estimateTokenCount(text);
   }
}
