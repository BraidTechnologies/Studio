// Copyright (c) 2024, 2025 Braid Technologies Ltd

/**
 * @module IEnrichedChunkRepository
 * @description Interface for an enriched chunk repository.
 * This module provides methods for querying and retrieving enriched chunks based on URL and summary.
 * It includes validation for session authentication and error handling for any issues encountered during the request processing.
 */

// Internal import
import {IRelevantEnrichedChunk, IChunkQueryRelevantToSummarySpec, IEnrichedChunkSummary, IChunkQueryRelevantToUrlSpec} from '../../../CommonTs/src/EnrichedQuery.Api.Types';

export const kDefaultSearchChunkCount: number = 2;
export const kDefaultMinimumCosineSimilarity = 0.5;

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



