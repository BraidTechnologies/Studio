// Copyright (c) 2024 Braid Technologies Ltd

import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec, IEnrichedChunk, IEnrichedChunkSummary } from "../../../CommonTs/src/EnrichedChunk";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";
import enrichedChunksFile from "../../api_embeddings_lite.json";
import { EnrichedChunkRepositoryInMemory } from "./EnrichedChunkRepository";


export class EnrichedChunkRepositoryFile implements IEnrichedChunkRepository {

   private _repositoryInMemory: IEnrichedChunkRepository;
   /**
    * Initializes a new instance of the class with the provided array of chunks.
    * 
    */
   public constructor() {

      let enrichedChunks = enrichedChunksFile as Array<IEnrichedChunk>;
      this._repositoryInMemory = new EnrichedChunkRepositoryInMemory (enrichedChunks);
   }

   /**
    * lookupRelevantFromSummary 
    * look to see of we have similar content to the text in the summary field of the query
    */
   async lookupRelevantFromSummary(spec: IChunkQueryRelevantToSummarySpec): Promise<Array<IRelevantEnrichedChunk>> {

      return this._repositoryInMemory.lookupRelevantFromSummary (spec);
   }

   /**
    * lookupRelevantfromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupRelevantFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<Array<IRelevantEnrichedChunk>> {

      return this._repositoryInMemory.lookupRelevantFromUrl (spec);
   }

   /**
    * lookupFromUrl 
    * look to see of we have similar content to a given URL from other sources
    */
   async lookupFromUrl(spec: IChunkQueryRelevantToUrlSpec): Promise<IEnrichedChunkSummary | undefined> {

      return this._repositoryInMemory.lookupFromUrl (spec);
   }
}

