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


/**
 * EnrichedChunkRepositoryDb is a class that implements the IEnrichedChunkRepository interface.
 * It initializes an in-memory repository of enriched chunks and manages asynchronous loading
 * of chunk data from a database. The class provides methods to look up relevant enriched chunks
 * based on a summary or URL, and to retrieve a chunk summary by URL.
 * 
 * @constructor
 * Initializes a new instance of the class, setting up an in-memory repository and a semaphore
 * to manage asynchronous data loading from a database.
 * 
 * @method lookupRelevantFromSummary
 * Searches for enriched chunks that are relevant to the text in the summary field of the query.
 * 
 * @method lookupRelevantFromUrl
 * Searches for enriched chunks that are relevant to a given URL from other sources.
 * 
 * @method lookupFromUrl
 * Retrieves the summary of an enriched chunk given its URL.
 */
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

                  if (!storedChunk.url) {
                     console.error ("No URL found for chunk", storedChunk.id);
                     continue;
                  }
                  if (!storedChunk.storedEmbedding) {
                     console.error ("No Embedding found for chunk", storedChunk.id);
                     continue;
                  }                  

                  let chunk: IEnrichedChunk = {
                     id: storedChunk.id as string,
                     embedding: storedChunk.storedEmbedding?.embedding as number[],
                     url: storedChunk.url as string,
                     text: storedChunk.originalText as string,
                     summary: storedChunk.storedSummary?.text as string
                  }

                  loadedChunks.push(chunk);
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

