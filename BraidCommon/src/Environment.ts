// Copyright (c) 2024 Braid Technologies Ltd
import {EEnvironment, IEnvironment} from './IEnvironment';

/**
 * Class representing the Development Environment with methods to retrieve various API endpoints.
 * @class DevelopmentEnvironment
 */
export class DevelopmentEnvironment implements IEnvironment {

   name: string = EEnvironment.kLocal;

   checkSessionApi () : string {
      return "http://localhost:7071/api/CheckSession"; 
   }
   summariseApi () : string {
      return "http://localhost:7071/api/Summarize"; 

   }
   findThemeApi(): string {
      return "http://localhost:7071/api/FindTheme";
   }
   classifyApi () : string {
      return "http://localhost:7071/api/Classify"; 
   }
   chunkApi () : string {
      return "http://localhost:7071/api/Chunk"; 
   }
   embedApi () : string {
      return "http://localhost:7071/api/Embed"; 
   }
   suppressSummariseFail(): string {
      return "http://localhost:7071/api/SuppressSummariseFail";
   }
   saveActivityApi(): string {
      return "http://localhost:7071/api/SaveActivity"
   }
   removeActivityApi(): string {
      return "http://localhost:7071/api/RemoveActivity"
   }   
   getActivitiesApi(): string {
      return "http://localhost:7071/api/GetActivities"      
   }
   loginWithLinkedInApi(): string {
      return "http://localhost:7071/api/LoginWithLinkedIn"; 
   }
   authFromLinkedInApi(): string {
      return "http://localhost:7071/api/ProcessAuthFromLinkedIn"; 
   }   
   boxerHome(): string {
      return "http://localhost:1337/aibot.html";
   }
   findRelevantEnrichedChunksFromUrl (): string {
      return "http://localhost:7071/api/FindRelevantEnrichedChunksFromUrl";
   }
   findRelevantEnrichedChunksFromSummary(): string{
      return "http://localhost:7071/api/FindRelevantEnrichedChunksFromSummary";
   }
   findEnrichedChunkFromUrl(): string {
      return "http://localhost:7071/api/FindEnrichedChunkFromUrl";      
   }
   queryModelWithEnrichment(): string {
      return "http://localhost:7071/api/QueryModelWithEnrichment";        
   }
   generateQuestion(): string{
      return "http://localhost:7071/api/GenerateQuestion";       
   }      
   generateFluidTokenApi(): string {
      return "http://localhost:7071/api/GenerateFluidToken";        
   } 
   fluidApi(): string {
      return  "http://localhost:7070";
   }
   fluidTenantId(): string {
      return "b9576484-5c2e-4613-bfdf-039948cdd521";
   }     
}

/**
 * Class representing the Staging Environment with methods to retrieve various API endpoints.
 * @class StagingEnvironment
 */
export class StagingEnvironment implements IEnvironment {

   name: string = EEnvironment.kStaging;

   checkSessionApi () : string {
      return "https://braid-api.azurewebsites.net/api/CheckSession";
   }
   summariseApi () : string {
      return "https://braid-api.azurewebsites.net/api/Summarize"; 
   }
   findThemeApi(): string {
      return "https://braid-api.azurewebsites.net/api/FindTheme";
   }
   classifyApi () : string {
      return "https://braid-api.azurewebsites.net/api/Classify"; 
   }
   chunkApi () : string {
      return "https://braid-api.azurewebsites.net/api/Chunk"; 
   }
   embedApi () : string {
      return "https://braid-api.azurewebsites.net/api/Embed"; 
   }   
   suppressSummariseFail(): string {
      return "https://braid-api.azurewebsites.net/api/SuppressSummariseFail";
   }   
   saveActivityApi(): string {
      return "https://braid-api.azurewebsites.net/api/SaveActivity";
   }  
   removeActivityApi(): string {
      return "https://braid-api.azurewebsites.net/api/RemoveActivity";
   }   
   getActivitiesApi(): string {
      return "https://braid-api.azurewebsites.net/api/GetActivities";      
   }  
   loginWithLinkedInApi(): string {
      return "https://braid-api.azurewebsites.net/api/LoginWithLinkedIn"; 
   }
   authFromLinkedInApi(): string {
      return "https://braid-api.azurewebsites.net/api/ProcessAuthFromLinkedIn"; 
   }
   boxerHome(): string {
      return "https://braidapps.io/aibot.html";
   }   
   findRelevantEnrichedChunksFromUrl (): string {
      return "https://braid-api.azurewebsites.net/api/FindRelevantEnrichedChunksFromUrl";
   }
   findRelevantEnrichedChunksFromSummary(): string{
      return "https://braid-api.azurewebsites.net/api/FindRelevantEnrichedChunksFromSummary";
   }   
   findEnrichedChunkFromUrl(): string {
      return "https://braid-api.azurewebsites.net/api/FindEnrichedChunkFromUrl";      
   }   
   queryModelWithEnrichment(): string {
      return "https://braid-api.azurewebsites.net/api/QueryModelWithEnrichment";        
   }   
   generateQuestion(): string{
      return "https://braid-api.azurewebsites.net/api/GenerateQuestion";       
   }     
   generateFluidTokenApi(): string {
      return "https://braid-api.azurewebsites.net/api/GenerateFluidToken";        
   }    
   fluidApi(): string {
      return  "https://eu.fluidrelay.azure.com";
   }
   fluidTenantId(): string {
      return "b9576484-5c2e-4613-bfdf-039948cdd521";
   }     
}

/**
 * Class representing a Production Environment with methods to retrieve various API endpoints.
 * @class ProductionEnvironment
 */
export class ProductionEnvironment implements IEnvironment {

   name: string = EEnvironment.kProduction;
   
   checkSessionApi () : string {
      return "https://braid-api.azurewebsites.net/api/CheckSession";
   }
   summariseApi () : string {
      return "https://braid-api.azurewebsites.net/api/Summarize"; 

   }
   findThemeApi(): string {
      return "https://braid-api.azurewebsites.net/api/FindTheme";
   }
   classifyApi () : string {
      return "https://braid-api.azurewebsites.net/api/Classify"; 
   }
   chunkApi () : string {
      return "https://braid-api.azurewebsites.net/api/Chunk"; 
   }   
   embedApi () : string {
      return "https://braid-api.azurewebsites.net/api/Embed"; 
   }    
   suppressSummariseFail(): string {
      return "https://braid-api.azurewebsites.net/api/SuppressSummariseFail";
   }      
   saveActivityApi(): string {
      return "https://braid-api.azurewebsites.net/api/SaveActivity"
   }    
   removeActivityApi(): string {
      return "https://braid-api.azurewebsites.net/api/RemoveActivity"
   }    
   getActivitiesApi(): string {
      return "https://braid-api.azurewebsites.net/api/GetActivities"      
   }       
   loginWithLinkedInApi(): string {
      return "https://braid-api.azurewebsites.net/api/LoginWithLinkedIn"; 
   }
   authFromLinkedInApi(): string {
      return "https://braid-api.azurewebsites.net/api/ProcessAuthFromLinkedIn"; 
   }    
   boxerHome(): string {
      return "https://braidapps.io/aibot.html";
   }  
   findRelevantEnrichedChunksFromUrl (): string {
      return "https://braid-api.azurewebsites.net/api/FindRelevantEnrichedChunksFromUrl";
   }
   findRelevantEnrichedChunksFromSummary(): string {
      return "https:/braid-api.azurewebsites.net/api/FindRelevantEnrichedChunksFromSummary";   
   }
   findEnrichedChunkFromUrl(): string {
      return "https://braid-api.azurewebsites.net/api/FindEnrichedChunkFromUrl";      
   }    
   queryModelWithEnrichment(): string {
      return "https://braid-api.azurewebsites.net/api/QueryModelWithEnrichment";        
   } 
   generateQuestion(): string{
      return "https://braid-api.azurewebsites.net/api/GenerateQuestion";       
   }   
   generateFluidTokenApi(): string {
      return "https://braid-api.azurewebsites.net/api/GenerateFluidToken";        
   }
   fluidApi(): string {
      return  "https://eu.fluidrelay.azure.com";
   }
   fluidTenantId(): string {
      return "b9576484-5c2e-4613-bfdf-039948cdd521";
   }     
}
