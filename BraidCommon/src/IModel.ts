// Copyright (c) 2024 Braid Technologies Ltd

/**
 * Enum representing different sizes of a model.
 * 
 * @enum {string}
 */
export enum EModel {

   kSmall = "Small", 
   kLarge = "Large"  
};

/**
 * Represents an interface for a model with deployment information.
 * @interface
 */
export interface IModel {

   deploymentName : string;
   contextWindowSize : number;
   fitsInContext(text: string): boolean;
   chunkText (text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string>;
   estimateTokens (text: string): number;
}


