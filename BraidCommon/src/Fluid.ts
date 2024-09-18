// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Query API

/**
 * Represents a request for a Fluid token.
 * @interface
 * @property {string} documentId - The ID of the document.
 * @property {string} userId - The ID of the user making the request.
 * @property {string} userName - The name of the user making the request.
 */
export interface IFluidTokenRequest {

   documentId: string;
   userId: string;
   userName: string;
}

