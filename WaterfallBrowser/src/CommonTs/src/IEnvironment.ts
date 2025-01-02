/**
 * @module IEnvironment
 * @description Defines the environment configuration interface and types for the Braid application.
 * 
 * This module defines the environment configuration interface (IEnvironment) used across
 * the application to handle different deployment environments (Local, Staging, Production).
 * It provides type definitions for environment-specific API endpoints and service URLs.
 * 
 * The interface includes methods for:
 * - Authentication and session management
 * - Content operations (summarization, classification, embedding)
 * - Activity tracking and management
 * - Chunk and page operations
 * - Integration endpoints (LinkedIn, Fluid, Teams)
 */

// Copyright (c) 2024 Braid Technologies Ltd

export const BRAID_ENVIRONMENT_KEY = "BRAID_ENVIRONMENT"

export enum EEnvironment {

   kLocal = "Local", 
   kStaging = "Staging", 
   kProduction = "Production"   
};

export interface IEnvironment {

   name : string;
   hostProtocolAndName(): string;
   checkSessionApi () : string;
   summariseApi () : string;
   findThemeApi(): string;
   chunkApi () : string;   
   classifyApi () : string;
   embedApi() : string;
   testForSummariseFail(): string;
   saveActivityApi(): string;
   removeActivityApi(): string;
   getActivityApi(): string;   
   findActivityApi(): string;      
   getActivitiesApi(): string;
   boxerHome(): string;
   loginWithLinkedInApi(): string;
   authFromLinkedInApi(): string;
   findRelevantEnrichedChunksFromUrl(): string;
   findRelevantEnrichedChunksFromSummary(): string;   
   findEnrichedChunkFromUrl(): string;   
   queryModelWithEnrichment(): string;
   generateQuestion(): string;   
   generateFluidTokenApi(): string;
   fluidApi(): string;
   fluidTenantId(): string;
   studioForTeamsBoxer() : string;
   saveChunkApi() : string;
   removeChunkApi(): string;
   getChunkApi(): string;
   findChunkApi(): string;   
   getChunksApi(): string;   
   savePageApi() : string;   
   getPageApi(): string;   
}


