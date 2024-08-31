// Copyright (c) 2024 Braid Technologies Ltd

// Internal imports
import {EModel, IModel} from './IModel';
import {GPTMini} from './Model';

/**
 * Returns the default model which is an instance of GPT4oMini.
 * @returns {IModel} The default model.
 */
export function getDefaultModel () : IModel  {

   return new GPTMini();   
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
         return new GPTMini();
   }
}


