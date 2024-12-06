// Copyright (c) 2024 Braid Technologies Ltd

import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec, IEnrichedChunk, IEnrichedChunkSummary } from "../../../CommonTs/src/EnrichedChunk";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";

export class EnrichedChunkRepositoryDb implements IEnrichedChunkRepository {

   /**
    * lookupRelevantFromSummary 
    * look to see of we have similar content to the text in the summary field of the query
    */
   async lookupRelevantFromSummary(spec: IChunkQueryRelevantToSummarySpec): Promise<Array<IRelevantEnrichedChunk>> {

      let accumulator = new Array<IRelevantEnrichedChunk>();
      
      return accumulator;
   }

   /**
    * lookupRelevantfromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupRelevantFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<Array<IRelevantEnrichedChunk>> {

      let accumulator = new Array<IRelevantEnrichedChunk>();

      return accumulator;
   }

   /**
    * lookupFromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<IEnrichedChunkSummary | undefined> {

      let accumulator : IEnrichedChunkSummary | undefined = undefined;

      return accumulator;
   }   
}

