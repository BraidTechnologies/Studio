// Copyright (c) 2024 Braid Technologies Ltd

/**
 * @module EnrichedChunkRepositoryFactory
 * @description Factory for creating instances of IEnrichedChunkRepository.
 * This module provides a way to create and manage instances of IEnrichedChunkRepository
 * based on the specified repository type. It ensures that only one instance of each
 * repository type is created (singleton pattern) to optimize performance.
 */

// Internal imports
import { IEnrichedChunkRepository} from "./IEnrichedChunkRepository";
import { EnrichedChunkRepositoryDb } from "./EnrichedChunkRepositoryDb";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";
import { InvalidParameterError } from "../../../CommonTs/src/Errors";

let waterfallRepository: EnrichedChunkRepositoryDb | undefined = undefined;

/**
 * Returns an instance of IEnrichedChunkRepository based on the specified repository type.
 * 
 * @param repository - The type of repository to retrieve, specified as an EChunkRepository enum.
 * @returns An instance of IEnrichedChunkRepository corresponding to the specified repository type.
 * 
 * If the repository type is 'kWaterfall', it returns an instance of EnrichedChunkRepositoryDb.
 * If the repository type is 'kBoxer' or any other value, it does the same - parameters are reserved for future variation
 * The function ensures that only one instance of each repository type is created (singleton pattern). 
 * Repositories are relative expensive which is why we use singleton. 
 */
export function getEnrichedChunkRepository (repository: EChunkRepository) : IEnrichedChunkRepository {
   switch (repository) {

      case EChunkRepository.kWaterfall:
      case EChunkRepository.kBoxer:             
         if (!waterfallRepository)
            waterfallRepository = new EnrichedChunkRepositoryDb()
         return waterfallRepository;  
      default:          
         throw new InvalidParameterError(`Invalid repository type: ${repository}`);
   }
}


