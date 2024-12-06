// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import { IEnrichedChunkRepository} from "./IEnrichedChunkRepository";
import { EnrichedChunkRepositoryFile } from "./EnrichedChunkRepositoryFile";
import { EnrichedChunkRepositoryDb } from "./EnrichedChunkRepositoryDb";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";

export function getEnrichedChunkRepository (repository: EChunkRepository) : IEnrichedChunkRepository {
   switch (repository) {
      case EChunkRepository.kWaterfall:
         return new EnrichedChunkRepositoryDb();       
      case EChunkRepository.kBoxer:             
      default:
         return new EnrichedChunkRepositoryFile();   
   }
}


