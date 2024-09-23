// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Fluid Token API

/**
 * Represents a Fluid user.
 * @interface
 * @property {boolean} local - if true, we are running locally - use local tentantID
 * @property {string} userId - The ID of the user making the request.
 * @property {string} userName - The name of the user making the request.
 
 */
export interface IFluidUser {

   local: boolean;
   userId: string;
   userName: string; 
}

/**
 * Represents a request for a Fluid token.
 * @interface
 * @property {string} documentId - ID of the shared document.
 */
export interface IFluidTokenRequest extends IFluidUser {

   documentId: string;   
}

