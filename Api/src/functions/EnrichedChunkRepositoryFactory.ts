// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import { IEnrichedChunkRepository} from "./IEnrichedChunkRepository";
import { EnrichedChunkRepositoryFile } from "./EnrichedChunkRepositoryFile";
import { EnrichedChunkRepositoryDb } from "./EnrichedChunkRepositoryDb";
import { EChunkRepository } from "../../../CommonTs/src/EnrichedChunk";


let boxerRepository: EnrichedChunkRepositoryFile | undefined = undefined;
let waterfallRepository: EnrichedChunkRepositoryDb | undefined = undefined;


/**
 * Returns an instance of IEnrichedChunkRepository based on the specified repository type.
 * 
 * @param repository - The type of repository to retrieve, specified as an EChunkRepository enum.
 * @returns An instance of IEnrichedChunkRepository corresponding to the specified repository type.
 * 
 * If the repository type is 'kWaterfall', it returns an instance of EnrichedChunkRepositoryDb.
 * If the repository type is 'kBoxer' or any other value, it returns an instance of EnrichedChunkRepositoryFile.
 * The function ensures that only one instance of each repository type is created (singleton pattern). 
 * Repositories are relative expensive which is why we use singleton. 
 */
export function getEnrichedChunkRepository (repository: EChunkRepository) : IEnrichedChunkRepository {
   switch (repository) {

      case EChunkRepository.kWaterfall:
         if (!waterfallRepository)
            waterfallRepository = new EnrichedChunkRepositoryDb();    
         return waterfallRepository;   

      case EChunkRepository.kBoxer:             
      default:
         if (!boxerRepository)
            boxerRepository = new EnrichedChunkRepositoryFile()
         return boxerRepository;   
   }
}

