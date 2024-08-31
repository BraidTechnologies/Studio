// Copyright (c) 2024 Braid Technologies Ltd
import {IModel} from './IModel';
import GPT4Tokenizer from 'gpt4-tokenizer';

const tokenizer = new GPT4Tokenizer({ type: 'gpt3' }); 


/**
 * GPTMini class implementing IModel interface.
 * Represents a model with specific deployment settings and window sizes.
 */
export class GPTMini implements IModel {

   deploymentName : string;
   contextWindowSize : number;
   contextWindowSizeWithBuffer : number;
   
   public constructor() {
      this.deploymentName = "braiddefaultmini";
      this.contextWindowSize = 8192;
      this.contextWindowSizeWithBuffer = (8192-512)
   }   
   
   fitsInContext(text: string): boolean {
      let estimatedTokens = tokenizer.estimateTokenCount(text);
      
      if (estimatedTokens < this.contextWindowSizeWithBuffer)
         return true;
      return false;
   }
   chunkText (text: string): Array<string>  {
      let chunked = tokenizer.chunkText (text, this.contextWindowSizeWithBuffer);
      
      let chunks = new Array<string>();
      
      for (let i = 0; i < chunked.length; i++) {
         chunks.push(chunked[i].text);
      }
      return chunks;
   }   
}
