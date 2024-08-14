// Copyright (c) 2024 Braid Technologies Ltd

// Internal import
import { EmbeddingMatchAccumulator } from "./Embedding";
import { Message } from "./Message";

export const kDefaultSearchChunkCount: number = 2;
export const kDefaultMinimumCosineSimilarity = 0.825;

export interface IEmbeddingRepository  {

   /**
    * lookupMostSimilar 
    * look to see of we have similar content 
    */      
   lookupMostSimilar (embedding: Array<number>, url: string | undefined, 
      similarityThresholdLo: number, howMany: number) : Promise<EmbeddingMatchAccumulator>;

   /**
    * lookUpSimilarfromUrl 
    * look to see of we have similar content from other sources
    */   
   lookupSimilarfromUrl (url: string, similarityThresholdLo: number, howMany: number) : Promise<EmbeddingMatchAccumulator>;

   /**
    * lookForSuggestedContent 
    * look to see of we have similar content from other sources
    */   
   lookForRelatedContent (url_: string | undefined, messageText: string) : Promise<Message | undefined>;

   /**
    * lookupUrlSummary 
    * looks for summary given a URL
    */   
   lookupUrlSummary (url_: string) : Promise<string | undefined>;      
}



