// Copyright (c) 2024 Braid Technologies Ltd

import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec, IEnrichedChunk, IEnrichedChunkSummary } from "../../../CommonTs/src/EnrichedChunk";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";
import { EnrichedChunkRepositoryInMemory } from "./EnrichedChunkRepository";
import { throwIfFalse } from "../../../CommonTs/src/Asserts";

let semaphore = new Promise<boolean> ((resolve) => {
   setTimeout(() => {
      console.log ("Resolving semaphore")
      resolve(true);
   }, 10000);
});

export class EnrichedChunkRepositoryDb implements IEnrichedChunkRepository {

   private _repositoryInMemory: IEnrichedChunkRepository;
   /**
    * Initializes a new instance of the class with the provided array of chunks.
    * 
    */
   public constructor() {

      let enrichedChunks = new Array<IEnrichedChunk>;    
      this._repositoryInMemory = new EnrichedChunkRepositoryInMemory (enrichedChunks);
   }
   
   /**
    * lookupRelevantFromSummary 
    * look to see of we have similar content to the text in the summary field of the query
    */
   async lookupRelevantFromSummary(spec: IChunkQueryRelevantToSummarySpec): Promise<Array<IRelevantEnrichedChunk>> {

      const result = await semaphore;       
      return this._repositoryInMemory.lookupRelevantFromSummary (spec);
   }

   /**
    * lookupRelevantfromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupRelevantFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<Array<IRelevantEnrichedChunk>> {

      const result = await semaphore;       
      return this._repositoryInMemory.lookupRelevantFromUrl (spec);
   }

   /**
    * lookupFromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<IEnrichedChunkSummary | undefined> {

      const result = await semaphore; 
      throwIfFalse(result)
      return this._repositoryInMemory.lookupFromUrl (spec);
   }
}

