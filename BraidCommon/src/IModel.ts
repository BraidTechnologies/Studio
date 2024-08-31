// Copyright (c) 2024 Braid Technologies Ltd
export enum EModel {

   kSmall = "Small", 
   kLarge = "Large"  
};

export interface IModel {

   deploymentName : string;
   contextWindowSize : number;
   fitsInContext(text: string): boolean;
   chunkText (text: string): Array<string>;
}


