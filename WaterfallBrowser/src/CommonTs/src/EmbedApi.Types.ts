// Copyright (c) 2024 Braid Technologies Ltd
// Definitions for the data elements of the Embed API

/**
 * Interface for the embedding request object.
 */
export interface IEmbedRequest{

   text: string;
}

/**
 * Interface for the embedding response object.
 */
export interface IEmbedResponse {

   embedding: Array<number>;
}