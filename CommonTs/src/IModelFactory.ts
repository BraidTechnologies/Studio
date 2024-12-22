// Copyright (c) 2024 Braid Technologies Ltd
/**
 * @module IModelFactory
 * @description Factory module for creating AI model instances.
 * 
 * This module provides factory functions to create appropriate model instances
 * based on the requested model type. It supports:
 * - Default model creation through getDefaultModel()
 * - Specific model creation through getModel() based on EModel type
 * 
 * The factory ensures consistent model instantiation across the application
 * while abstracting the concrete model implementation details.
 */

// Internal imports
import {EModel, IModel} from './IModel';
import {GPT4} from './Model';

/**
 * Returns the default model which is an instance of GPT4oMini.
 * @returns {IModel} The default model.
 */
export function getDefaultModel () : IModel  {

   return new GPT4();   
}

/**
 * Returns an instance of IModel based on the provided EModel type.
 * 
 * @param model - The EModel type to determine the model.
 * @returns An instance of IModel corresponding to the specified EModel type.
 */
export function getModel (model: EModel) : IModel  {

   switch (model) {
      default:
         return new GPT4();
   }
}


