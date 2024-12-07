// Copyright (c) 2024 Braid Technologies Ltd

import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec, IEnrichedChunk, IEnrichedChunkSummary } from "../../../CommonTs/src/EnrichedChunk";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";
import { EnrichedChunkRepositoryInMemory } from "./EnrichedChunkRepository";
import { throwIfFalse } from "../../../CommonTs/src/Asserts";
import { ConsoleLogger, loadStorables } from "./CosmosStorableApi";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";
import { storedChunkClassName } from "../../../CommonTs/src/ChunkRepositoryApi.Types";
import { chunkStorableAttributes } from "./CosmosStorableApi";
import { IStorable } from "../../../CommonTs/src/IStorable";
import { IStoredChunk } from "../../../CommonTs/src/ChunkRepositoryApi.Types";



export class EnrichedChunkRepositoryDb implements IEnrichedChunkRepository {

   private _repositoryInMemory: IEnrichedChunkRepository;
   private _semaphore: Promise<boolean>;

   /**
    * Initializes a new instance of the class with the provided array of chunks.
    * 
    */
   public constructor() {

      let enrichedChunks = new Array<IEnrichedChunk>;    
      this._repositoryInMemory = new EnrichedChunkRepositoryInMemory (enrichedChunks);

      this._semaphore = new Promise<boolean> ((resolve) => {
   
         let query = {
            maxCount: 2,
            repositoryId: EChunkRepository.kWaterfall,
            limit: 2,
            className: storedChunkClassName,
            similarityThreshold: 0.15
         };
      
         let logger = new ConsoleLogger();
      
         try {
            let loaded = loadStorables (query, chunkStorableAttributes, logger).then ((values: Array<IStorable>) => {

               let loadedChunks = new Array<IEnrichedChunk>;

               for (let i = 0; i < values.length; i++) {

                  let storedChunk: IStoredChunk = values[i] as IStoredChunk;

                  let chunk: IEnrichedChunk = {
                     id: storedChunk.id as string,
                     embedding: storedChunk.storedEmbedding?.embedding as number[],
                     url: storedChunk.url as string,
                     text: storedChunk.originalText as string,
                     summary: storedChunk.storedSummary?.text as string
                  }

                  loadedChunks.push (chunk);
               }

               this._repositoryInMemory = new EnrichedChunkRepositoryInMemory (loadedChunks);   

               resolve (true);               

            }).catch ((e: any) => {

               resolve (false);
            });       
         }
         catch (err: any) {
            logger.error ("Error loading Chunks", err);
            
            resolve (false);
         }
      });
   }
   
   /**
    * lookupRelevantFromSummary 
    * look to see of we have similar content to the text in the summary field of the query
    */
   async lookupRelevantFromSummary(spec: IChunkQueryRelevantToSummarySpec): Promise<Array<IRelevantEnrichedChunk>> {

      const result = await this._semaphore;       
      return this._repositoryInMemory.lookupRelevantFromSummary (spec);
   }

   /**
    * lookupRelevantfromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupRelevantFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<Array<IRelevantEnrichedChunk>> {

      const result = await this._semaphore;       
      return this._repositoryInMemory.lookupRelevantFromUrl (spec);
   }

   /**
    * lookupFromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<IEnrichedChunkSummary | undefined> {

      const result = await this._semaphore; 
      throwIfFalse(result)
      return this._repositoryInMemory.lookupFromUrl (spec);
   }
}

