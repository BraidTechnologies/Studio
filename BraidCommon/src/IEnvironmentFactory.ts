// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import {EEnvironment, IEnvironment} from './IEnvironment';
import {DevelopmentEnvironment, StagingEnvironment, ProductionEnvironment} from './Environment';

export function getDefaultEnvironment () : IEnvironment  {

   return new DevelopmentEnvironment();   
}

/**
 * Returns an instance of IEnvironment based on the provided EEnvironment type.
 * 
 * @param environmentString - The EEnvironment type to determine the environment.
 * @returns An instance of IEnvironment corresponding to the specified EEnvironment type.
 */
export function getEnvironment (environmentString: EEnvironment) : IEnvironment  {

   switch (environmentString) {
      case EEnvironment.kLocal:
         return new DevelopmentEnvironment();   

      case EEnvironment.kStaging:
         return new StagingEnvironment();   

      case EEnvironment.kProduction:
      default:
         return new ProductionEnvironment();
   }
}


