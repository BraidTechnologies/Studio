// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import { IEnrichedChunkRepository } from "./IEnrichedChunkRepository";
import { EnrichedChunkRepositoryFile } from "./EnrichedChunkRepositoryFile";

export function getEnrichedChunkRepository () : IEnrichedChunkRepository {
   return new EnrichedChunkRepositoryFile();   
}


