// Copyright (c) 2024 Braid Technologies Ltd

import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { IChunkQueryRelevantToUrlSpec, IChunkQueryRelevantToSummarySpec, IEnrichedChunk, IEnrichedChunkSummary } from "../../../CommonTs/src/EnrichedChunk";
import { IRelevantEnrichedChunk } from "../../../CommonTs/src/EnrichedChunk";
import enrichedChunksFile from "../../api_embeddings_lite.json";
import { EnrichedChunkRepositoryInMemory } from "./EnrichedChunkRepository";


/**
 * EnrichedChunkRepositoryFile is a class that implements the IEnrichedChunkRepository interface.
 * It initializes an in-memory repository with enriched chunks loaded from a file and provides
 * methods to look up relevant chunks based on a summary or URL.
 * 
 * Methods:
 * - lookupRelevantFromSummary: Finds chunks with content similar to the summary in the query.
 * - lookupRelevantFromUrl: Finds chunks with content similar to the specified URL.
 * - lookupFromUrl: Retrieves the full chunk associated with the specified URL.
 */
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

