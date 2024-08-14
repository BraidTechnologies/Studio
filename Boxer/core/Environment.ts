// Copyright (c) 2024 Braid Technologies Ltd

export enum EEnvironment {

   kLocal = "Local", 
   kStaging = "Staging", 
   kProduction = "Production"
   
};

let environment = EEnvironment.kLocal;

export class Environment {

   // returns the environment type.
   // code lines are different for each environment
   static environment  () : EEnvironment {
      return environment;
   }

   static override (newEnvironment: EEnvironment): EEnvironment {

      let prev = environment;
      environment = newEnvironment;

      return  prev;
   }

}