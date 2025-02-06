/**
 * @module Fluid
 * @description Defines the core interfaces for Fluid Framework token authentication.
 * Contains type definitions for user authentication, token requests, and token responses
 * used in the Fluid Framework integration.
 * 
 * These interfaces facilitate the token-based authentication flow between the client
 * application and the Fluid service, supporting both local development and production
 * environments.
 */

// Copyright (c) 2024, 2025 Braid Technologies Ltd
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

/**
 * Represents a response to a request for a Fluid token.
 * @interface
 * @property {string} token - the token 
 */
export interface IFluidTokenResponse {

   token: string;   
}


