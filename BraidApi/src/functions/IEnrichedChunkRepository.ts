// Copyright (c) 2024 Braid Technologies Ltd

// Internal import
import {IRelevantEnrichedChunk, IChunkQueryRelevantToSummarySpec, IEnrichedChunkSummary, IChunkQueryRelevantToUrlSpec} from '../../../BraidCommon/src/EnrichedChunk';

export const kDefaultSearchChunkCount: number = 2;
export const kDefaultMinimumCosineSimilarity = 0.825;

export interface IEnrichedChunkRepository  {

   /**
    * lookupRelevantFromSummary 
    * look to see of we have similar content 
    */      
   lookupRelevantFromSummary (spec: IChunkQueryRelevantToSummarySpec) : Promise<Array<IRelevantEnrichedChunk>>;

   /**
    * lookupRelevantfromUrl 
    * look to see of we have similar content from other sources
    */   
   lookupRelevantFromUrl (spec: IChunkQueryRelevantToUrlSpec) : Promise<Array<IRelevantEnrichedChunk>>;  

   /**
    * lookupFromUrl 
    * find the whole chunk given its URL
    */   
   lookupFromUrl (spec: IChunkQueryRelevantToUrlSpec) : Promise<IEnrichedChunkSummary | undefined>;     
}



