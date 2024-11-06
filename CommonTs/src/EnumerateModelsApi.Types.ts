// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the EnumerateModels API

import {EChunkRepository} from './EnrichedChunk';

/**
 * Interface for the EnumerateModels request object.
 */
export interface IEnumerateModelsRequest{

}

/**
 * Interface for the EnumerateModels response object.
 */
export interface IEnumerateModelsResponse {

   defaultId: string;
   defaultEmbeddingId: string;   
   largeId: string;
   largeEmbeddingId: string;
   smallId: string;
   smallEmbeddingId: string;   
}

/**
 * Interface for the EnumerateRepositories request object.
 */
export interface IEnumerateRepositoriesRequest{

}

/**
 * Interface for the EnumerateModels response object.
 */
export interface IEnumerateReposotoriesResponse {

   repositoryIds: Array<EChunkRepository>
}