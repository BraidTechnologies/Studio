// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import { SessionKey } from "./Keys";
import { IEmbeddingRepository } from "./IEmbeddingRepository";
import { EmbeddingRepositoryFile } from "./EmbeddingRepositoryFile";

export function getEmbeddingRepository (sessionKey_: SessionKey) : IEmbeddingRepository {
   return new EmbeddingRepositoryFile();   
}


