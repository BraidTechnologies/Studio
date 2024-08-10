// Copyright (c) 2024 Braid Technologies Ltd

export enum EEnvironment {

   kLocal = "Local", 
   kStaging = "Staging", 
   kProduction = "Production"   
};

export interface IEnvironment {

   checkSessionApi () : string;
   summariseApi () : string;
   classifyApi () : string;
   embedApi() : string;
   saveActivityApi(): string;
   removeActivityApi(): string;
}


