// Copyright (c) 2024 Braid Technologies Ltd
export enum EModel {

   kSmall = "Small", 
   kLarge = "Large"  
};

/**
 * Represents a model with deployment information.
 * @interface
 */
export interface IModel {

   deploymentName : string;
   contextWindowSize : number;
   fitsInContext(text: string): boolean;
   chunkText (text: string): Array<string>;
}


