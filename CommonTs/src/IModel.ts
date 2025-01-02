/**
 * @module IModel
 * @description Defines the core model interfaces and enums used for AI model management.
 * Contains the model size enumeration and the base interface for model implementations,
 * including deployment configuration and text processing capabilities.
 */

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

   implementsModel: EModel
   deploymentName : string;
   embeddingDeploymentName: string;
   defaultChunkSize : number;
   maximumChunkSize : number;
   embeddingChunkSize : number;
   fitsInDefaultChunk(text: string): boolean;
   fitsInMaximumChunk(text: string): boolean;
   fitsInEmbeddingChunk(text: string): boolean;
   chunkText (text: string, chunkSize: number | undefined, overlapWords: number | undefined): Array<string>;
   estimateTokens (text: string): number;
}


