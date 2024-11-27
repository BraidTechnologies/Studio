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
   suppressSummariseFail(): string;
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


