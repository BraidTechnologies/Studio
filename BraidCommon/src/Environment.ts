// Copyright (c) 2024 Braid Technologies Ltd
import {IEnvironment} from './IEnvironment';

/**
 * DevelopmentEnvironment class that implements the IEnvironment interface.
 * Provides methods to retrieve URLs for checking session, summarizing, and classifying APIs.
 */
export class DevelopmentEnvironment implements IEnvironment {

   checkSessionApi () : string {
      return "http://localhost:7071/api/CheckSession"; 
   }
   summariseApi () : string {
      return "http://localhost:7071/api/Summarize"; 

   }
   classifyApi () : string {
      return "http://localhost:7071/api/Classify"; 
   }
   embedApi () : string {
      return "http://localhost:7071/api/Embed"; 
   }
}

/**
 * StagingEnvironment class that implements the IEnvironment interface.
 * Provides methods to retrieve URLs for checking session, summarizing, and classifying APIs.
 */
export class StagingEnvironment{
   checkSessionApi () : string {
      return "https://braidapi.azurewebsites.net/api/CheckSession";
   }
   summariseApi () : string {
      return "https://braidapi.azurewebsites.net/api/Summarize"; 

   }
   classifyApi () : string {
      return "https://braidapi.azurewebsites.net/api/Classify"; 
   }
   embedApi () : string {
      return "https://braidapi.azurewebsites.net/api/Embed"; 
   }   
}

/**
 * ProductionEnvironment class that implements the IEnvironment interface.
 * Provides methods to retrieve URLs for checking session, summarizing, and classifying APIs.
 */
export class ProductionEnvironment {
   checkSessionApi () : string {
      return "https://braidapi.azurewebsites.net/api/CheckSession";
   }
   summariseApi () : string {
      return "https://braidapi.azurewebsites.net/api/Summarize"; 

   }
   classifyApi () : string {
      return "https://braidapi.azurewebsites.net/api/Classify"; 
   }
   embedApi () : string {
      return "https://braidapi.azurewebsites.net/api/Embed"; 
   }    
}
