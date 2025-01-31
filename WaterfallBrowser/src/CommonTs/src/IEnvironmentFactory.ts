// Copyright (c) 2024, 2025 Braid Technologies Ltd

/**
 * @module IEnvironmentFactory
 * 
 * Factory module for creating environment instances that define application behavior
 * across different deployment contexts (Development, Staging, Production).
 * 
 * This module provides factory functions to create appropriate environment instances
 * based on the current execution context (browser vs Node.js) and configuration.
 * It supports automatic environment detection and explicit environment selection
 * through the getEnvironment function.
 * 
 * The module handles three main scenarios:
 * - Default environment detection
 * - Fluid-specific environment configuration
 * - Login-specific environment configuration
 */

// Internal imports
import {EEnvironment, IEnvironment} from './IEnvironment';
import {DevelopmentEnvironment, StagingEnvironment, ProductionEnvironment} from './Environment';

declare var process : any;


/**
 * Returns the default environment based on the current execution context.
 * If running in a browser and on localhost, returns a DevelopmentEnvironment instance.
 * If the process environment variable BRAID_ENVIRONMENT is set to 'Local', returns a DevelopmentEnvironment instance.
 * Otherwise, returns a ProductionEnvironment instance.
 * @returns An instance of IEnvironment representing the default environment.
 */
export function getDefaultEnvironment () : IEnvironment  {

   // Use Development if we are running in Node.js
   if (typeof process !== 'undefined') {
      if (process.env.BRAID_ENVIRONMENT === EEnvironment.kLocal) {
         return new DevelopmentEnvironment();
      }
   }

   return new ProductionEnvironment();   
}

export function getDefaultFluidEnvironment () : IEnvironment  {

   let environment = getDefaultEnvironment();

   // If we are in Browser, and in localhost, use development
   if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
         environment = getEnvironment (EEnvironment.kLocal);
      }
   }
   return environment;
}

export function getDefaultLoginEnvironment () : IEnvironment  {

   let environment = getDefaultEnvironment();

   // If we are in Browser, and in localhost, use development
   if (typeof window !== 'undefined') {
      if (window.location.hostname === 'localhost') {
         environment = getEnvironment (EEnvironment.kLocal);
      }
   }
   return environment;
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


