// Copyright (c) 2024 Braid Technologies Ltd
import {IEnvironment} from './IEnvironment';

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
}

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
}

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
}
