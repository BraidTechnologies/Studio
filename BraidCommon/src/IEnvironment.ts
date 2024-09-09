// Copyright (c) 2024 Braid Technologies Ltd

export enum EEnvironment {

   kLocal = "Local", 
   kStaging = "Staging", 
   kProduction = "Production"   
};

export interface IEnvironment {

   checkSessionApi () : string;
   summariseApi () : string;
   findThemeApi(): string;
   classifyApi () : string;
   embedApi() : string;
   suppressSummariseFail(): string;
   saveActivityApi(): string;
   removeActivityApi(): string;
   getActivitiesApi(): string;
   boxerHome(): string;
   loginWithLinkedInApi(): string;
   authFromLinkedInApi(): string;
   findRelevantEnrichedChunksFromUrl(): string;
   findRelevantEnrichedChunksFromSummary(): string;   
   findEnrichedChunkFromUrl(): string;   
}


