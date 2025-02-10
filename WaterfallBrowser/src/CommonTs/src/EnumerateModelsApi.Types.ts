/**
 * Type definitions for the EnumerateModels and EnumerateRepositories APIs
 * 
 * This module contains the interface definitions for requests and responses
 * used in model enumeration and repository listing operations. It defines:
 * - EnumerateModels API interfaces for listing available AI models
 * - EnumerateRepositories API interfaces for listing available chunk repositories
 * 
 * @module EnumerateModelsApi.Types
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd
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